import DigestClient from 'digest-fetch'
import { XMLParser } from 'fast-xml-parser'
import { RETSListingStatus, RETSSearchResponse } from '../types/types'
import { th } from 'framer-motion/client'

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
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  let listingStatus: RETSListingStatus[] | undefined
  try {
    listingStatus = await client
      .fetch(`https://ntrdd.mlsmatrix.com/rets/Search.ashx?${searchParams.toString()}`, {
        signal: controller.signal,
      })
      .then((res) =>
        res.text().then((text) => {
          const parser = new XMLParser()
          const parsedObj = parser.parse(text) as RETSSearchResponse
          if (!parsedObj.RETS.COLUMNS) {
            console.log('ERROR: Columns not found')
            return
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
        }),
      )
  } catch (error) {
    console.error('ERROR FETCHING RETS LISTING STATUS:', error)
    return
  } finally {
    clearTimeout(timeout)
  }
  if (!listingStatus || listingStatus.length === 0) {
    console.log('ERROR: No listing status found for ListingKeyNumeric:', listingKeyNumeric)
    return
  }
  console.log('Fetched RETS listing status: ', listingStatus[0])
  return listingStatus[0]
}
