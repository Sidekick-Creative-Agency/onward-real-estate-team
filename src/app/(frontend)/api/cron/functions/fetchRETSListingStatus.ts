import DigestClient from 'digest-fetch'
import { XMLParser } from 'fast-xml-parser'
import { RETSListingStatus, RETSSearchResponse } from '../types/types'

// A malformed RETS reply (missing COLUMNS), a network error, or a timeout is treated
// as transient and retried in-process. Retrying here — rather than punting the listing
// to the next daily reconcile run — recovers from the flaky "no columns returned"
// responses without a 24h delay. A genuine "listing gone" result (empty DATA) is NOT
// an error and is never retried.
const MAX_ATTEMPTS = 4
const BASE_DELAY_MS = 500
const REQUEST_TIMEOUT_MS = 15000

class TransientRETSError extends Error {}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// One request/parse cycle. Throws TransientRETSError on retryable failures.
const attemptFetch = async (
  client: DigestClient,
  url: string,
): Promise<RETSListingStatus[]> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await client.fetch(url, { signal: controller.signal })
    const text = await res.text()
    const parser = new XMLParser()
    const parsedObj = parser.parse(text) as RETSSearchResponse
    if (!parsedObj.RETS?.COLUMNS) {
      console.log('RETS RESPONSE:', text)
      console.log('RETS OBJECT:', parsedObj)
      // A well-formed RETS reply always carries COLUMNS (even for 0 results). Its
      // absence means a malformed/error response, not "listing gone" — retry.
      throw new TransientRETSError('RETS response missing COLUMNS')
    }
    // Query succeeded but matched no listing: genuinely absent from RETS.
    if (!parsedObj.RETS.DATA) {
      return []
    }

    const columns = parsedObj.RETS.COLUMNS.split('\t')
    let data = parsedObj.RETS.DATA
    if (!Array.isArray(data)) {
      data = [data]
    }
    return data.map((listingString) => {
      const listingData = listingString.split('\t')
      const status: RETSListingStatus = {
        MlsStatus: listingData[columns.indexOf('MlsStatus')] || undefined,
      }
      return status
    })
  } catch (error) {
    // Network failure, timeout/abort, or malformed response — all transient.
    if (error instanceof TransientRETSError) {
      throw error
    }
    throw new TransientRETSError(
      error instanceof Error ? error.message : 'RETS fetch failed',
      { cause: error },
    )
  } finally {
    clearTimeout(timeout)
  }
}

export const fetchRETSListingStatus = async (listingKeyNumeric: number | undefined) => {
  if (!listingKeyNumeric) {
    throw new Error('No ListingKeyNumeric provided')
  }
  const searchParams = new URLSearchParams()
  searchParams.append('searchType', 'Property')
  searchParams.append('class', 'Property')
  searchParams.append('query', `(ListingKeyNumeric=${listingKeyNumeric})`)
  searchParams.append('format', 'COMPACT-DECODED')
  searchParams.append('select', 'MlsStatus')

  const client = new DigestClient(process.env.RETS_USERNAME, process.env.RETS_PASSWORD, {
    algorithm: 'MD5',
  })
  const url = `https://ntrdd.mlsmatrix.com/rets/Search.ashx?${searchParams.toString()}`

  let listingStatus: RETSListingStatus[] | undefined
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      listingStatus = await attemptFetch(client, url)
      break
    } catch (error) {
      if (attempt === MAX_ATTEMPTS) {
        // Exhausted retries. Re-throw so the caller skips the listing and tries again
        // on the next run instead of wrongly marking it unavailable.
        console.error(
          `ERROR FETCHING RETS LISTING STATUS (${listingKeyNumeric}) after ${MAX_ATTEMPTS} attempts:`,
          error,
        )
        throw error
      }
      // Exponential backoff with jitter so retries don't hammer a struggling server
      // or synchronize across the concurrent listings in a chunk.
      const backoff = BASE_DELAY_MS * 2 ** (attempt - 1)
      const delay = backoff + Math.floor(Math.random() * backoff)
      console.warn(
        `RETS lookup attempt ${attempt}/${MAX_ATTEMPTS} failed for ${listingKeyNumeric}, retrying in ${delay}ms:`,
        error instanceof Error ? error.message : error,
      )
      await sleep(delay)
    }
  }

  if (!listingStatus || listingStatus.length === 0) {
    // Fetch succeeded, but RETS returned no matching row — the listing is genuinely
    // gone from the feed. Return null (distinct from a thrown transient error).
    console.log('No listing status found for ListingKeyNumeric:', listingKeyNumeric)
    return null
  }
  console.log('Fetched RETS listing status: ', listingStatus[0])
  return listingStatus[0]
}
