import { Listing, Media } from '@/payload-types'
import { RETSListing } from '../types/types'
import { fetchRETSPhotos } from './fetchRETSPhotos'
import { formatAddress } from './formatAddress'
import { serializeString } from './serializeString'
import { findAgentByName } from './findAgentByName'
import { createMedia } from './createMedia'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getFirstTwoSentences } from './getFirstTwoSentences'
import { findMediaByFilename } from './findMediaByFilename'
import { headers as getHeaders } from 'next/headers'

export const updateListing = async (listing: Listing, retsListing: RETSListing) => {
  if (retsListing.ListingKeyNumeric) {
    const urls = await fetchRETSPhotos(retsListing.ListingKeyNumeric, retsListing.PhotosCount)
    if (!urls || urls.length === 0) {
      console.log(`NO PHOTOS FOUND FOR LISTING: ${listing.title}. RETURNING.`)
      return
    }
    const payload = await getPayload({ config: configPromise })
    const headers = await getHeaders()
    await payload.auth({ headers })
    const formattedDescription = serializeString(retsListing.PublicRemarks)
    const matchingAgent = await findAgentByName(retsListing.ListAgentFullName)
    let featuredImageId: number | undefined = undefined
    const filename = `${listing.title.replaceAll(/[,#]/g, '').replaceAll(' ', '_')}_featured`
    const matchingMedia = await findMediaByFilename(filename)
    if (matchingMedia) {
      // MEDIA EXISTS
      featuredImageId = matchingMedia.id
    } else {
      // MEDIA DOES NOT EXIST. CREATE NEW MEDIA
      const createdMedia = await createMedia(urls[0], filename)

      if (!createdMedia) {
        return
      } else {
        console.log(`CREATED MEDIA WITH FILENAME: ${filename}`)
        if (createdMedia?.id) {
          featuredImageId = createdMedia.id
        }
      }
    }

    const updatedListing = await payload
      .update({
        collection: 'listings',
        id: listing.id,
        overrideLock: false,
        data: {
          title: formatAddress(retsListing),
          streetAddress: `${retsListing.StreetNumber ? `${retsListing.StreetNumber} ` : ''}${retsListing.StreetName}${retsListing.StreetSuffix ? ` ${retsListing.StreetSuffix}` : ''}`,
          city: retsListing.City || '',
          state: retsListing.StateOrProvince || '',
          zipCode: retsListing.PostalCode || '',
          category: ['COML', 'COMS'].includes(retsListing?.PropertyType || '')
            ? 'commercial'
            : 'residential',
          price: retsListing.ListPrice,
          area: retsListing.LivingArea,
          acreage: retsListing.LotSizeAcres,
          // Default to Waco coordinates if not provided. Force a negative longitude for US area.
          coordinates: [
            retsListing.Longitude && retsListing.Longitude >= 0
              ? retsListing.Longitude * -1
              : -97.2753695,
            retsListing.Latitude || 31.5532499,
          ],
          bedrooms: retsListing.BedroomsTotal,
          bathrooms: retsListing.BathroomsTotalInteger,
          featuredImage: featuredImageId || 0,
          availability: 'active',
          transactionType: retsListing.PropertyType === 'RLSE' ? 'for-lease' : 'for-sale',
          // @ts-ignore
          description: formattedDescription,
          ...(retsListing.PropertyType === 'RLSE'
            ? {
                textAfterPrice: '/MO',
              }
            : {}),
          ...(matchingAgent
            ? {
                agents: [matchingAgent.id],
              }
            : {}),
          meta: {
            title: `${formatAddress(retsListing)} | Residential Properties | Onward Real Estate Team`,
            image: featuredImageId,
            description: getFirstTwoSentences(retsListing.PublicRemarks),
          },
          MLS: {
            ListingKeyNumeric: retsListing.ListingKeyNumeric,
            MlsStatus: 'Active',
            ListAgentKeyNumeric: retsListing.ListAgentKeyNumeric,
            ListAgentFullName: retsListing.ListAgentFullName,
            ListOfficeKeyNumeric: retsListing.ListOfficeKeyNumeric,
            ListOfficeName: retsListing.ListOfficeName,
            ModificationTimestamp: retsListing.ModificationTimestamp,
            PhotosChangeTimestamp: retsListing.PhotosChangeTimestamp,
            PhotosCount: retsListing.PhotosCount,
            PropertySubType: retsListing.PropertySubType,
            FeaturedImageUrl: urls[0] || undefined,
            ImageGalleryUrls: urls.slice(2).map((url) => ({ url: url })),
          },
          _status: 'published',
        },
      })
      .then((res) => {
        if (res.errors) {
          for (const error of res.errors) {
            console.error('ERROR UPDATING LISTING: ' + listing.title)
            console.error(error.message)
          }
          throw new Error(res.errors[0].message)
        }

        console.log(`UPDATED LISTING: ${listing.title}\n\n`)
        return res
      })
      .catch((error) => {
        console.error('UNKNOWN ERROR UPDATING LISTING: ' + listing.title)
        throw new Error(error.message)
      })
    console.log()
    // @ts-ignore
    return updatedListing as Listing
  }
  throw new Error('UNKNOWN ERROR UPDATING LISTING: ' + listing.title)
}
