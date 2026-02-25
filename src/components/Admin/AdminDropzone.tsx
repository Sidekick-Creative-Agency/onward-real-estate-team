'use client'

import { Button, Dropzone, toast } from '@payloadcms/ui'
import React, { useState } from 'react'
import Papa from 'papaparse'
import { $generateNodesFromDOM } from '@lexical/html'
import { createHeadlessEditor } from '@lexical/headless'
import { $getRoot, SerializedEditorState } from 'lexical'
import { PropertyType } from '@/payload-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import { useRouter } from 'next/navigation'
import { $getSelection } from '@payloadcms/richtext-lexical/lexical'
import { cleanNumber } from '@/utilities/cleanNumber'

interface AdminDropzoneProps {
  collectionSlug: string
}
interface ListingData {
  title: string | null | undefined
  featuredImage: string | null | undefined
  imageGallery: string | null | undefined
  category: string | null | undefined
  bathrooms: string | null | undefined
  bedrooms: string | null | undefined
  description: string | null | undefined
  price: string | null | undefined
  propertyType: string | null | undefined
  transactionType: string | null | undefined
  status: string | null | undefined
  area: string | null | undefined
  acreage: string | null | undefined
  streetAddress: string | null | undefined
  city: string | null | undefined
  state: string | null | undefined
  zipCode: string | null | undefined
  latitude: string | null | undefined
  longitude: string | null | undefined
  attatchments: string | null | undefined
  isFeatured: string | null | undefined
  agents: string | null | undefined
}
export const AdminDropzone: React.FC<AdminDropzoneProps> = () => {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [importAmount, setImportAmount] = useState<number | undefined>(undefined)
  const [importOffset, setImportOffset] = useState(0)

  const handleUpload = async () => {
    try {
      setIsLoading(true)
      if (!file) {
        toast.error('No file found')
        return
      }
      if (!data) {
        toast.error('No file data found')
        return
      }
      let successfulImportCount = 0
      let failedImportCount = 0
      let skippedImportCount = 0
      const uploadPromises = data.map(async (item, index) => {
        if (index >= importOffset && importAmount ? index <= importOffset + importAmount : true) {
          if (!item.title) {
            toast.error(`Skipping import on line ${index + 2}. Title is required`)
            return
          }
          // if (!item.street_address) {
          //   toast.error(`Skipping import on line ${index + 2}. Street Address is required`)
          //   return
          // }
          // if (!item.city) {
          //   toast.error(`Skipping import on line ${index + 2}. City is required`)
          //   return
          // }
          // if (!item.state) {
          //   toast.error(`Skipping import on line ${index + 2}. State is required`)
          //   return
          // }
          // if (!item.zip_code) {
          //   toast.error(`Skipping import on line ${index + 2}. Zip Code is required`)
          //   return
          // }
          // if (!item.latitude) {
          //   toast.error(`Skipping import on line ${index + 2}. Latitude is required`)
          //   return
          // }
          // if (!item.longitude) {
          //   toast.error(`Skipping import on line ${index + 2}. Longitude  is required`)
          //   return
          // }
          const existingListing = await fetch(
            `/api/listings?where[title][like]=${item.title}`,
          ).then((res) => res.json().then((json) => json))
          if (existingListing.docs && existingListing.docs[0]) {
            skippedImportCount += 1
            toast.info(
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold">Skipping import on line {index + 1}</span>
                <span className="font-light">
                  Listing with Title <em>{item.title}</em> already exists
                </span>
              </div>,
            )
            return
          }
          const globalPropertyTypes = await fetch('/api/property-types', {
            method: 'GET',
          }).then((res) =>
            res.json().then((json) =>
              json.docs.map((doc: PropertyType) => {
                return { id: doc.id, title: doc.title.toLowerCase().replaceAll(' ', '-') }
              }),
            ),
          )

          // INITIALIZE COLLECTION RELATIONSHIP VARIABLES
          let featuredImageId: number | undefined = undefined
          let imageGallery: { image: number }[] | undefined = []
          let attachments: { attachment: number }[] | undefined = []

          // GET IMAGE GALLERY VALUES
          const imageUrls: string[] = item.image_urls ? item.image_urls.split('|') : []
          const imageAltTexts: string[] = item.image_alt_texts
            ? item.image_alt_texts.split('|')
            : []
          const imageFileNames: string[] = item.image_filenames
            ? item.image_filenames.split('|')
            : []

          // GET FEATURED IMAGE VALUES
          const featuredImageUrl = imageUrls?.shift() || undefined
          const featuredImageAltText = imageAltTexts?.shift() || undefined
          const featuredImageFileName = imageFileNames?.shift() || undefined

          // GET ATTACHMENT VALUES
          const attachmentIds = item.attachment_ids ? item.attachment_ids.split('|') : []
          const attachmentUrls: string[] = item.attachment_urls
            ? item.attachment_urls.split('|')
            : []
          const attachmentFileNames: string[] = item.attachment_filenames
            ? item.attachment_filenames.split('|')
            : []
          const attachmentTitles = item.attachment_titles ? item.attachment_titles.split('|') : []

          const propertyAttachmentIds = item.file_attachments
            .split('i:')
            .map((attachment, index) => {
              if (index > 0) {
                return attachment.split(';')[0]
              }
            })
            .filter((attachment) => attachment)

          const propertyAttachmentIndexes = propertyAttachmentIds.map((id) =>
            attachmentIds.indexOf(id),
          )
          const propertyAttachmentUrls = propertyAttachmentIndexes
            .map((index) => {
              if (index !== -1) {
                return attachmentUrls[index] || ''
              }
            })
            .filter((url) => url)
          const propertyAttachmentFilenames = propertyAttachmentIndexes
            .map((index) => {
              if (index !== -1) {
                return attachmentFileNames[index] || ''
              }
            })
            .filter((filename) => filename)

          const propertyAttachmentTitles = propertyAttachmentIndexes
            .map((index) => {
              if (index !== -1) {
                return attachmentTitles[index] || ''
              }
            })
            .filter((filename) => filename)

          // GET LISTING DATA VALUES
          const title = item.title || ''
          const category = item.bedrooms || item.bathrooms ? 'residential' : 'commercial'
          const propertyTypes = (
            item.property_types ? (item.property_types.split('|') as string[]) : []
          ).map(
            (propertyType) =>
              globalPropertyTypes.find(
                (type) => type.title === propertyType.toLowerCase().replaceAll(' ', '-'),
              )?.id,
          )
          const price = item.price ? cleanNumber(item.price) : undefined
          const textAfterPrice = item.text_after_price
          const transactionType = item.transaction_type
            ? item.transaction_type.toLowerCase().replaceAll(' ', '-')
            : undefined
          const availability = item.property_status
            ? item.property_status.toLowerCase().replaceAll(' ', '-')
            : undefined
          const area = item.area ? cleanNumber(item.area) : undefined
          const acreage = item.acreage ? cleanNumber(item.acreage) : undefined
          const isFeatured =
            item.is_featured &&
              (item.is_featured.toLowerCase() === 'yes' || item.is_featured.toLowerCase() === 'true')
              ? true
              : false
          const streetAddress = item.street_address ? item.street_address : undefined
          const city = item.city ? item.city : undefined
          const state = item.state ? item.state : undefined
          const zipCode = item.zip_code ? item.zip_code : undefined
          const longitude = item.longitude ? cleanNumber(item.longitude) : undefined
          const latitude = item.latitude ? cleanNumber(item.latitude) : undefined
          const bedrooms = item.bedrooms ? cleanNumber(item.bedrooms) : undefined
          const bathrooms = item.bathrooms ? cleanNumber(item.bathrooms) : undefined
          const virtualTourLink = item.virtual_tour_link ? item.virtual_tour_link : undefined
          const videos = [item.video_1, item.video_2, item.video_3].filter(
            (video) => video !== undefined && /^https/.test(video),
          )
          const metaTitle = item.meta_title ? item.meta_title : title
          const metaDescription = item.meta_description ? item.meta_description : undefined
          const slug = item.slug ? item.slug : undefined

          // FEATURED IMAGE UPLOAD
          if (featuredImageUrl) {
            const existingImage = await fetch(
              `/api/media?where[filename][equals]=${featuredImageFileName?.split('.')[0]}.webp`,
            ).then((res) => res.json().then((json) => json))
            if (existingImage.docs && existingImage.docs[0]) {
              featuredImageId = existingImage.docs[0].id
            } else {
              const featuredImageBlob = await fetch(featuredImageUrl).then((res) =>
                res.blob().then((blob) => blob),
              )
              const formData = new FormData()
              formData.append('file', featuredImageBlob, featuredImageFileName)
              formData.append('_payload', JSON.stringify({ alt: featuredImageAltText || '' }))
              const featuredImageResponse = await fetch('/api/media', {
                method: 'POST',
                body: formData,
                credentials: 'include',
              })
                .then((response) => response.json().then((json) => json))
                .catch((error) => {
                  console.error('Error creating Media:', error)
                  toast.error(
                    `Error importing Listing on row ${index + 1}: ${featuredImageResponse.errors[0].message}`,
                  )
                  return undefined
                })
              if (!featuredImageResponse || featuredImageResponse.errors) {
                failedImportCount += 1
                return
              }
              featuredImageId = featuredImageResponse.doc.id
            }
          }

          // IMAGE GALLERY UPLOAD
          if (imageUrls && imageUrls.length > 0) {
            const allImages: { image: number }[] = await Promise.all(
              imageUrls.map(async (imageUrl, _index) => {
                const existingImage = await fetch(
                  `/api/media?where[filename][equals]=${imageFileNames[_index].split('.')[0]}.webp`,
                ).then((res) => res.json().then((json) => json))
                console.log('EXISTING IMAGE')
                if (existingImage.docs && existingImage.docs[0]) {
                  return { image: existingImage.docs[0].id }
                } else {
                  const imageBlob = await fetch(imageUrl).then((res) =>
                    res.blob().then((blob) => blob),
                  )
                  const formData = new FormData()
                  formData.append('file', imageBlob, imageFileNames[_index])
                  formData.append('_payload', JSON.stringify({ alt: imageAltTexts[_index] || '' }))
                  const imageResponse = await fetch('/api/media', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                  })
                    .then((response) => response.json().then((json) => json))
                    .catch((error) => {
                      console.error('Error creating Media:', error)
                      return { image: undefined }
                    })
                  if (!imageResponse || imageResponse.errors) {
                    failedImportCount += 1
                    toast.error(
                      `Error importing Listing on row ${index + 1}: ${imageResponse.errors[0].message}`,
                    )
                    return { image: undefined }
                  }
                  return { image: imageResponse.doc.id }
                }
                return { image: undefined }
              }),
            )
            imageGallery.push(...allImages?.filter((image) => image.image))
          }

          // ATTACHMENTS UPLOAD
          if (propertyAttachmentUrls && propertyAttachmentUrls.length > 0) {
            const allAttachments = await Promise.all(
              propertyAttachmentUrls.map(async (attachmentUrl: string, _index: number) => {
                const attachmentBlob = await fetch(attachmentUrl).then((res) =>
                  res.blob().then((blob) => blob),
                )
                const formData = new FormData()
                formData.append('file', attachmentBlob, propertyAttachmentFilenames[_index])
                formData.append(
                  '_payload',
                  JSON.stringify({ title: propertyAttachmentTitles[_index] || '' }),
                )
                const attachmentResponse = await fetch('/api/attachments', {
                  method: 'POST',
                  body: formData,
                  credentials: 'include',
                })
                  .then((response) => response.json().then((json) => json))
                  .catch((error) => {
                    console.error('Error creating Attachment:', error)
                    return { attachment: undefined }
                  })
                if (!attachmentResponse || attachmentResponse.errors) {
                  failedImportCount += 1
                  toast.error(
                    `Error importing Listing on row ${index + 1}: ${attachmentResponse.errors[0].message}`,
                  )
                  return { attachment: undefined }
                }
                return { attachment: attachmentResponse.doc.id }
              }),
            )
            attachments.push(...allAttachments?.filter((attachment) => attachment.attachment))
          }

          let formattedDescription: SerializedEditorState | undefined = undefined
          const editor = createHeadlessEditor()
          const parser = new DOMParser()

          editor.update(
            () => {
              const dom = parser.parseFromString(item.description || '', 'text/html')

              const nodes = $generateNodesFromDOM(editor, dom)
              $getRoot().select()
              $getSelection()?.insertNodes(nodes)
            },
            { discrete: true },
          )
          formattedDescription = editor.getEditorState().toJSON()
          const postData = {
            title,
            featuredImage: featuredImageId,
            imageGallery,
            category,
            description: formattedDescription,
            price,
            textAfterPrice,
            propertyType: propertyTypes,
            transactionType,
            availability,
            area,
            acreage,
            streetAddress,
            city,
            state,
            zipCode,
            coordinates: [longitude, latitude],
            attachments,
            isFeatured,
            bedrooms,
            bathrooms,
            videos,
            virtualTourLink,
            _status: 'published',
            meta: {
              title: metaTitle,
              description: metaDescription,
              image: featuredImageId,
            },
            slug,
          }
          const listingResponse = await fetch('/api/listings', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          }).then((res) =>
            res
              .json()
              .then((json) => json)
              .catch((error) => {
                console.error('Error creating Listing: ' + error.message)
                toast.error(
                  <div className="flex flex-col gap-2">
                    <span className="text-2xl font-bold">Error importing Listing</span>
                    <span className="font-light">{error.message}</span>
                  </div>,
                )
                return undefined
              }),
          )
          if (listingResponse.doc) {
            successfulImportCount += 1
            toast.success(
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold">Listing created successfully</span>
                <span className="font-light">{title} created</span>
              </div>,
            )
          }
          imageGallery = []
          attachments = []
        }
      })
      await Promise.all(uploadPromises)
      toast.info(
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold">Import Complete</span>
          <span className="font-light">{successfulImportCount} Listings successfully created</span>
          <span className="font-light">{failedImportCount} Listings failed to be created</span>
          <span className="font-light">{skippedImportCount} Listings skipped</span>
        </div>,
      )
    } catch (error: any) {
      console.error('Unexpected Error: ' + error.message)
      toast.error(
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold">Error importing Listing</span>
          <span className="font-light">{error.message}</span>
        </div>,
      )
      return
    } finally {
      setIsLoading(false)
      setFile(null)
      setData([])
      // router.push('/admin/collections/listings')
    }
  }

  return (
    <div>
      <Dropzone
        onChange={(fileList) => {
          if (fileList.length > 0) {
            const firstFile = fileList[0]
            const firstFileType = firstFile.type
            if (firstFileType === 'text/csv') {
              console.log('CSV file detected')
              setFile(firstFile)
              Papa.parse(firstFile, {
                header: true,
                complete: (results) => {
                  const errors = results.errors
                  const errorIndices: number[] = []
                  if (errors.length > 0) {
                    errors.forEach((error) => {
                      if (error.row) {
                        errorIndices.push(error.row)
                      }
                      toast.error(`Error parsing row ${error.row}:  ${error.message}`)
                    })
                  }
                  const successfulRows = results.data.filter((_, index) => {
                    return !errorIndices.includes(index)
                  })
                  if (successfulRows && successfulRows.length > 0) {
                    setData(successfulRows as ListingData[])
                    toast.success(
                      `Successfully read ${successfulRows.length} rows from file ${firstFile.name}`,
                    )
                  }
                },
              })
            } else {
              console.log('Unsupported file type')
              toast.error('Unsupported file type. Only CSV files are allowed')
            }
          }
        }}
        dropzoneStyle="default"
        multipleFiles={false}
      >
        <span>{file?.name ? file.name : 'Drag or Drop CSV file here'}</span>
      </Dropzone>
      <div className="flex gap-2 mt-4">
        <div className="field-type number" style={{ flex: '1 1 auto' }}>
          <div className="field-type__wrap">
            <div>
              <input
                type="number"
                placeholder="Number of posts to import"
                min={0}
                max={data.length}
                onChange={(e) => {
                  setImportAmount(parseInt(e.target.value))
                }}
              />
            </div>
          </div>
        </div>
        <div className="field-type number" style={{ flex: '1 1 auto' }}>
          <div className="field-type__wrap">
            <div>
              <input
                type="number"
                placeholder="Number of posts to skip"
                min={0}
                max={data.length}
                onChange={(e) => {
                  setImportOffset(parseInt(e.target.value))
                  console.log(e.target.value)
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {file && (
        <Button
          onClick={() => {
            handleUpload()
          }}
          disabled={isLoading}
        >
          {!isLoading ? (
            'Import Listings'
          ) : (
            <FontAwesomeIcon icon={faCircleNotch} className="w-4 h-auto animate-spin" />
          )}
        </Button>
      )}
    </div>
  )
}
