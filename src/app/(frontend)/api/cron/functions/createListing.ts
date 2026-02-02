import { Media } from '@/payload-types'
import { RETSListing } from '../types/types'
import { fetchRETSPhotos } from './fetchRETSPhotos'
import { formatAddress } from './formatAddress'
import { serializeString } from './serializeString'
import { findAgentByName } from './findAgentByName'
import { findMediaByFilename } from './findMediaByFilename'
import { createMedia } from './createMedia'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getFirstTwoSentences } from './getFirstTwoSentences'
import { headers as getHeaders } from 'next/headers'
import { formatSlug } from '@/fields/Slug/formatSlug'

export const createListing = async (listing: RETSListing) => {
  if (listing.ListingKeyNumeric) {
    const urls = await fetchRETSPhotos(listing.ListingKeyNumeric, listing.PhotosCount)
    if (!urls || urls.length === 0) {
      console.log(`NO PHOTOS FOUND FOR LISTING: ${formatAddress(listing)}. RETURNING.`)
      return undefined
    }
    const payload = await getPayload({ config: configPromise })
    const headers = await getHeaders()
    await payload.auth({ headers })

    const formattedDescription = serializeString(listing.PublicRemarks)
    const matchingAgent = await findAgentByName(listing.ListAgentFullName)
    let featuredImageId: number | undefined = undefined
    const filename = `${formatAddress(listing).replaceAll(/[,#]/g, '').replaceAll(' ', '_')}_featured`
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
        if (createdMedia?.id) {
          featuredImageId = createdMedia.id
        }
      }
    }
    const formattedAddress = formatAddress(listing)
    const createdListing = await payload.create({
      collection: 'listings',
      data: {
        title: formattedAddress,
        slug: formatSlug(formattedAddress),
        streetAddress: `${listing.StreetNumber ? `${listing.StreetNumber} ` : ''}${listing.StreetName}${listing.StreetSuffix ? ` ${listing.StreetSuffix}` : ''}`,
        city: listing.City || '',
        state: listing.StateOrProvince || '',
        zipCode: listing.PostalCode || '',
        category: ['COML', 'COMS'].includes(listing?.PropertyType || '')
          ? 'commercial'
          : 'residential',
        price: listing.ListPrice,
        area: listing.LivingArea,
        acreage: listing.LotSizeAcres,
        // Default to Waco coordinates if not provided. Force a negative longitude for US area.
        coordinates: [
          listing.Longitude && listing.Longitude >= 0 ? listing.Longitude * -1 : -97.2753695,
          listing.Latitude || 31.5532499,
        ],
        bedrooms: listing.BedroomsTotal,
        bathrooms: listing.BathroomsTotalInteger,
        featuredImage: featuredImageId || 0,
        availability: 'active',
        transactionType: listing.PropertyType === 'RLSE' ? 'for-lease' : 'for-sale',
        // @ts-ignore
        description: formattedDescription,
        ...(listing.PropertyType === 'RLSE'
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
          title: `${formattedAddress} | Residential Properties | Onward Real Estate Team`,
          image: featuredImageId,
          description: getFirstTwoSentences(listing.PublicRemarks),
        },
        MLS: {
          ListingKeyNumeric: listing.ListingKeyNumeric,
          MlsStatus: 'Active',
          ListAgentKeyNumeric: listing.ListAgentKeyNumeric,
          ListAgentFullName: listing.ListAgentFullName,
          ListOfficeKeyNumeric: listing.ListOfficeKeyNumeric,
          ListOfficeName: listing.ListOfficeName,
          ModificationTimestamp: listing.ModificationTimestamp,
          PhotosChangeTimestamp: listing.PhotosChangeTimestamp,
          PhotosCount: listing.PhotosCount,
          PropertySubType: listing.PropertySubType,
          FeaturedImageUrl: urls[0] || undefined,
          ImageGalleryUrls: urls.slice(2).map((url) => ({ url: url })),
          LastSeenAt: new Date().toISOString(),
        },
        _status: 'published',
      },
    })
    console.log(`CREATED LISTING: ${createdListing.title}\n\n`)
    return createdListing
  }
  console.log(`ERROR CREATING LISTING. NO LISTING_KEY_NUMERIC FOUND: ${formatAddress(listing)}\n\n`)
  throw new Error('NO LISTING_KEY_NUMERIC FOUND')
}
