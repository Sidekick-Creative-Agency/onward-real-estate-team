import DigestClient from 'digest-fetch'
import { XMLParser } from 'fast-xml-parser'
import { RETSListing, RETSSearchResponse } from '../types/types'

const RETS_COUNTIES = {
  bell: 14,
  bosque: 18,
  coryell: 50,
  falls: 73,
  hill: 109,
  limestone: 147,
  mclennan: 161,
}

export const fetchRETSListing = async (listingKeyNumeric: number | undefined | null) => {
  if (!listingKeyNumeric) return
  const searchParams = new URLSearchParams()
  searchParams.append('searchType', 'Property')
  searchParams.append('class', 'Property')
  searchParams.append('query', `(ListingKeyNumeric=${listingKeyNumeric})`)
  searchParams.append('format', 'COMPACT-DECODED')
  searchParams.append(
    'select',
    'ListingKeyNumeric,ListingId,City,Latitude,ListAgentFullName,ListAgentKeyNumeric,ListOfficeKeyNumeric,ListOfficeName,ListPrice,LivingArea,Longitude,ModificationTimestamp,PhotosChangeTimestamp,PhotosCount,PostalCode,PropertySubType,PropertyType,PublicRemarks,StateOrProvince,StreetName,StreetNumber,StreetSuffix,LotSizeAcres,LotSizeArea,LotSizeSquareFeet,LotSizeUnits,BedroomsTotal,BathroomsTotalInteger',
  )

  const client = new DigestClient(process.env.RETS_USERNAME, process.env.RETS_PASSWORD, {
    algorithm: 'MD5',
  })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)
  try {
    const listings = await client
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
            const listing: RETSListing = {
              ListingKeyNumeric: listingData[columns.indexOf('ListingKeyNumeric')]
                ? Number(listingData[columns.indexOf('ListingKeyNumeric')])
                : undefined,
              ListingId: listingData[columns.indexOf('ListingId')]
                ? Number(listingData[columns.indexOf('ListingId')])
                : undefined,
              City: listingData[columns.indexOf('City')]
                ? listingData[columns.indexOf('City')]
                : undefined,
              Latitude: listingData[columns.indexOf('Latitude')]
                ? Number(listingData[columns.indexOf('Latitude')])
                : undefined,
              ListAgentFullName: listingData[columns.indexOf('ListAgentFullName')] || undefined,
              ListAgentKeyNumeric: listingData[columns.indexOf('ListAgentKeyNumeric')]
                ? Number(listingData[columns.indexOf('ListAgentKeyNumeric')])
                : undefined,
              ListOfficeKeyNumeric: listingData[columns.indexOf('ListOfficeKeyNumeric')]
                ? Number(listingData[columns.indexOf('ListOfficeKeyNumeric')])
                : undefined,
              ListOfficeName: listingData[columns.indexOf('ListOfficeName')] || undefined,
              ListPrice: listingData[columns.indexOf('ListPrice')]
                ? Number(listingData[columns.indexOf('ListPrice')])
                : undefined,
              LivingArea: listingData[columns.indexOf('LivingArea')]
                ? Number(listingData[columns.indexOf('LivingArea')])
                : undefined,
              Longitude: listingData[columns.indexOf('Longitude')]
                ? Number(listingData[columns.indexOf('Longitude')])
                : undefined,
              ModificationTimestamp:
                listingData[columns.indexOf('ModificationTimestamp')] || undefined,
              PhotosChangeTimestamp:
                listingData[columns.indexOf('PhotosChangeTimestamp')] || undefined,
              PhotosCount: listingData[columns.indexOf('PhotosCount')]
                ? Number(listingData[columns.indexOf('PhotosCount')])
                : undefined,
              PostalCode: listingData[columns.indexOf('PostalCode')] || undefined,
              PropertySubType: listingData[columns.indexOf('PropertySubType')] || undefined,
              PropertyType: listingData[columns.indexOf('PropertyType')] || undefined,
              PublicRemarks: listingData[columns.indexOf('PublicRemarks')] || undefined,
              StateOrProvince: listingData[columns.indexOf('StateOrProvince')] || undefined,
              StreetName: listingData[columns.indexOf('StreetName')] || '',
              StreetNumber: listingData[columns.indexOf('StreetNumber')] || '',
              StreetSuffix: listingData[columns.indexOf('StreetSuffix')] || '',
              LotSizeAcres: listingData[columns.indexOf('LotSizeAcres')]
                ? Number(listingData[columns.indexOf('LotSizeAcres')])
                : undefined,
              LotSizeArea: listingData[columns.indexOf('LotSizeArea')]
                ? Number(listingData[columns.indexOf('LotSizeArea')])
                : undefined,
              LotSizeSquareFeet: listingData[columns.indexOf('LotSizeSquareFeet')]
                ? Number(listingData[columns.indexOf('LotSizeSquareFeet')])
                : undefined,
              LotSizeUnits: listingData[columns.indexOf('LotSizeUnits')] || undefined,
              BedroomsTotal: listingData[columns.indexOf('BedroomsTotal')]
                ? Number(listingData[columns.indexOf('BedroomsTotal')])
                : undefined,
              BathroomsTotalInteger: listingData[columns.indexOf('BathroomsTotalInteger')]
                ? Number(listingData[columns.indexOf('BathroomsTotalInteger')])
                : undefined,
            }
            return listing
          })
        }),
      )
    if (!listings || listings.length === 0) {
      console.log('No listings found for ListingKeyNumeric:', listingKeyNumeric)
      return
    }
    return listings[0]
  } catch (error) {
    console.error('ERROR FETCHING RETS LISTINGS:', error)
    return
  } finally {
    clearTimeout(timeout)
  }
}
