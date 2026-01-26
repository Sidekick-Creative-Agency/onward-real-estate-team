import DigestClient from 'digest-fetch'
import { XMLParser } from 'fast-xml-parser'
import { RETSObjectResponse } from '../types/types'

export const fetchRETSPhotos = async (
  listingKeyNumeric: number,
  photosCount: number | undefined,
) => {
  if (!photosCount || photosCount === 0) {
    console.log('NO PHOTOS COUNT PROVIDED OR ZERO PHOTOS COUNT')
    return []
  }
  const searchParams = new URLSearchParams()
  searchParams.append('type', 'HighRes')
  searchParams.append('resource', 'Property')
  searchParams.append('location', '1')
  searchParams.append('ID', listingKeyNumeric.toString() + ':')
  const client = new DigestClient(process.env.RETS_USERNAME, process.env.RETS_PASSWORD, {
    algorithm: 'MD5',
  })
  let urls: string[] = []
  for await (const [index, _] of Array(photosCount).entries()) {
    const url = await client
      .fetch(`https://ntrdd.mlsmatrix.com/rets/GetObject.ashx?${searchParams.toString()}${index}`)
      .then((res) =>
        res.text().then((text) => {
          const parser = new XMLParser()
          const parsedObj = parser.parse(text) as RETSObjectResponse
          const url = parsedObj.RETS.split('Location=')[1]
          return url
        }),
      )
    if (url) {
      urls.push(url)
    }
  }
  return urls.filter((url) => url !== undefined)
}
