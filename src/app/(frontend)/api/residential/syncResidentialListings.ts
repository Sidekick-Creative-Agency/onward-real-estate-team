'use server'
import { getPayload } from 'payload'
import oauth2 from 'simple-oauth2'
import configPromise from '@payload-config'
import { Listing } from '@/payload-types'
import { $getRoot, $getSelection, SerializedEditorState } from 'lexical'
import { createHeadlessEditor } from '@lexical/headless'
import { $generateNodesFromDOM } from '@lexical/html'
import { generateId } from '@/utilities/generateId'
import { JSDOM } from 'jsdom'

type IdXResponse = {
  '@odata.context': string | null
  '@odata.count': number | null
  '@odata.nextLink': string | null
  value: IdxProperty[]
}

type IdxProperty = {
  LotSizeAcres: number | null
  BedroomsTotal: number | null
  ListAgentFullName: string | null
  PostalCode: string | null
  Latitude: number | null
  ListAgentEmail: string | null
  PhotosCount: number | null
  PropertySubTypeAdditional: string | null
  StoriesTotal: number | null
  BathroomsTotalInteger: number | null
  City: string | null
  StateOrProvince: string | null
  Longitude: number | null
  UnparsedAddress: string | null
  PropertySubType: string | null
  CurrentPrice: number | null
  BuildingAreaTotal: number | null
  VirtualTourURLUnbranded: null
  VirtualTourURLUnbranded3: null
  VirtualTourURLUnbranded2: null
  PublicRemarks: string | null
  SaleOrLeaseIndicator: string | null
  StandardStatus: string | null
  Media: IdxMedia[] | null
}

type IdxMedia = {
  Order: number | null
  MediaObjectID: string | null
  MediaURL: string | null
  MediaType: string | null
  MediaClassification: string | null
}

export const syncResidentialListings = async () => {
  /***** GENERATE AUTH TOKEN *****/
  const authResponse = await authenticate(process.env.IDX_CLIENT_ID, process.env.IDX_CLIENT_SECRET)
  const accessToken = authResponse?.token?.access_token

  if (!accessToken) {
    console.error('FAILED TO AUTHENTICATE. EXITING.')
    return {
      ok: false,
      message: 'Failed to authenticate',
      data: null,
    }
  }
  /***** END GENERATE AUTH TOKEN *****/

  /***** FETCH LISTINGS FROM TRESTLE *****/
  const searchParams = new URLSearchParams()
  searchParams.append('$top', '1000')
  searchParams.append(
    '$filter',
    `ListOfficeKey eq '${process.env.IDX_OFFICE_ID}' and PropertyType eq 'Residential' and contains(ListAgentEmail, 'onward')`,
  )
  searchParams.append(
    '$select',
    'BuildingAreaTotal,BathroomsTotalInteger,BedroomsTotal,City,CurrentPrice,Latitude,ListAgentEmail,ListAgentEmail,ListAgentFullName,Longitude,LotSizeAcres,PhotosCount,PostalCode,PropertySubType,PropertySubTypeAdditional,PublicRemarks,SaleOrLeaseIndicator,StandardStatus,StateOrProvince,StoriesTotal,UnparsedAddress,VirtualTourURLUnbranded,VirtualTourURLUnbranded2,VirtualTourURLUnbranded3',
  )
  searchParams.append(
    '$expand',
    'Media($select=MediaClassification,MediaObjectID,MediaType,MediaURL,Order)',
  )
  searchParams.append('$count', 'true')

  const listingsResponse = await fetch(
    `${process.env.IDX_ENDPOINT}/trestle/odata/Property/?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  ).then((res) => res.json().then((json) => json as IdXResponse))
  /***** END FETCH LISTINGS FROM TRESTLE *****/

  /***** INSTANTIATE PAYLOAD *****/
  const payload = await getPayload({ config: configPromise })
  /***** END INSTANTIATE PAYLOAD *****/

  /***** FETCH AGENTS FROM PAYLOAD *****/
  const agentsResponse = await payload.find({
    collection: 'team-members',
    pagination: false,
  })
  /***** END FETCH AGENTS FROM PAYLOAD *****/

  /***** LOOP OVER LISTINGS *****/
  listingsResponse.value.forEach(async (listing, index) => {
    if (index > -1) {
      /***** CHECK IF LISTING EXISTS IN PAYLOAD *****/
      const existingListing = await payload.find({
        collection: 'listings',
        where: {
          title: {
            equals: `${listing.UnparsedAddress}, ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`,
          },
        },
      })
      if (existingListing.docs && existingListing.docs.length > 0) {
        /***** EXIT IF LISTING EXISTS *****/
        console.log('EXISITNG LISTING FOUND: ' + existingListing.docs[0].title)
        console.log('SKIPPING\n\n')
        return
      }
      /***** END CHECK IF LISTING EXISTS IN PAYLOAD *****/

      /***** CHECK FOR AGENT ON THE LISTING *****/
      console.log(
        `CHECKING FOR AGENT: ${listing.UnparsedAddress}, ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`,
      )
      const matchingAgent = agentsResponse?.docs?.find(
        (agent) => agent.details.email === listing.ListAgentEmail,
      )
      if (matchingAgent) {
        console.log('MATCHING AGENT FOUND')
      } else {
        console.log('NO AGENT FOUND')
      }
      /***** END CHECK FOR AGENT ON THE LISTING *****/

      /***** FORMAT DESCRIPTION TO LEXICAL *****/
      let formattedDescription: SerializedEditorState | undefined = undefined
      const editorNodes = []
      const editor = createHeadlessEditor({ nodes: editorNodes })
      editor.update(
        () => {
          const dom = new JSDOM(listing.PublicRemarks || '')
          const nodes = $generateNodesFromDOM(editor, dom.window.document)
          $getRoot().select()
          $getSelection()?.insertNodes(nodes)
        },
        { discrete: true },
      )
      formattedDescription = editor.getEditorState().toJSON()
      /***** END FORMAT DESCRIPTION TO LEXICAL *****/

      /***** UPLOAD MEDIA *****/
      if (listing.Media && listing.Media?.length > 0) {
        console.log(
          `UPLOADING MEDIA FOR PROPERTY: ${listing.UnparsedAddress}, ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`,
        )
        const reversedMedia = listing.Media.slice().reverse()
        let featuredImageId: number | undefined = undefined
        const mediaIdsArray: any[] = []
        await Promise.all(
          reversedMedia.map(async (media) => {
            const filename =
              `${media?.MediaObjectID?.split('.')[0]}_${listing.UnparsedAddress?.toLowerCase()}`.replaceAll(
                /[\s.]/g,
                (match) => (match === ' ' ? '-' : ''),
              )
            const existingMedia = await payload.find({
              collection: 'media',
              where: {
                filename: {
                  like: filename,
                },
              },
            })
            if (existingMedia.docs && existingMedia.docs[0]) {
              // MEDIA EXISTS
              console.log('EXISTING MEDIA FOUND WITH FILENAME: ' + existingMedia.docs[0].filename)
              mediaIdsArray.push(existingMedia.docs[0].id)
            } else {
              // MEDIA DOES NOT EXIST. CREATE NEW MEDIA
              console.log(`CREATING MEDIA WITH FILENAME: ${filename}`)
              const mediaBlob = await fetch(media.MediaURL || '/').then((res) =>
                res.blob().then((blob) => blob),
              )
              const formData = new FormData()
              formData.append('file', mediaBlob, filename)

              const createMediaResponse = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL || `http://localhost:${process.env.PORT}`}/api/media`,
                {
                  method: 'POST',
                  body: formData,
                  credentials: 'include',
                },
              )
                .then((response) => response.json().then((json) => json))
                .catch((error) => {
                  console.error('Error creating Media:', error)
                  return undefined
                })
              if (!createMediaResponse || createMediaResponse?.errors) {
                console.error(createMediaResponse)
                console.error('Error creating Media:', createMediaResponse?.errors[0].data)
                return
              } else {
                console.log(
                  `SUCCESSFULLY CREATED MEDIA WITH FILENAME: ${createMediaResponse.doc.filename}`,
                )
                if (createMediaResponse?.doc.id) {
                  mediaIdsArray.push(createMediaResponse?.doc.id)
                }
              }
            }
          }),
        )

        const listingData: Listing = {
          title: `${listing.UnparsedAddress}, ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`,
          streetAddress: listing.UnparsedAddress || '',
          featuredImage: mediaIdsArray.shift(),
          imageGallery: mediaIdsArray.map((media) => ({ image: media })),
          city: listing.City || '',
          state: listing.StateOrProvince || '',
          zipCode: listing.PostalCode || '',
          category: 'residential',
          price: listing.CurrentPrice,
          area: listing.BuildingAreaTotal,
          acreage: listing.LotSizeAcres,
          coordinates: [listing.Longitude || 0, listing.Latitude || 0],
          bedrooms: listing.BedroomsTotal,
          bathrooms: listing.BathroomsTotalInteger,
          // @ts-ignore
          availability: listing.StandardStatus?.toLowerCase(),
          // @ts-ignore
          transactionType: listing.SaleOrLeaseIndicator || 'for-sale',
          // @ts-ignore
          description: formattedDescription,
          ...(matchingAgent
            ? {
                agents: [matchingAgent.id],
              }
            : {}),
          meta: {
            title: `${listing.UnparsedAddress}, ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode} | Residential Properties | Onward Real Estate Team`,
            image: featuredImageId,
            description: getFirstTwoSentences(listing.PublicRemarks),
          },
        }

        const newListing = await payload.create({ collection: 'listings', data: listingData })
        console.log(newListing)
      } else {
        console.error('Error: No featured image')
        return
      }
    }
  })
  // END LOOP OVER LISTINGS
}

async function authenticate(client_id: string | undefined, client_secret: string | undefined) {
  const trestleConfig = {
    client: {
      id: client_id || '',
      secret: client_secret || '',
    },
    auth: {
      tokenHost: process.env.IDX_ENDPOINT || '',
      tokenPath: '/trestle/oidc/connect/token',
    },
  }

  try {
    const o = new oauth2.ClientCredentials(trestleConfig)
    return await o.getToken({ scope: 'api' })
  } catch (error) {
    console.log(error)
    return undefined
  }
}

function getFirstTwoSentences(text) {
  const sentences = text.split(/(?<=[.?!])\s+/)
  return sentences.length >= 2 ? sentences.slice(0, 2).join(' ') : text
}
