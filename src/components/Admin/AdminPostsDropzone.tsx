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
import { $getSelection } from '@payloadcms/richtext-lexical/lexical'

interface AdminPostsDropzoneProps {
  collectionSlug: string
}
export const AdminPostsDropzone: React.FC<AdminPostsDropzoneProps> = () => {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [importAmount, setImportAmount] = useState(-1)
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
          if (!item.content) {
            toast.error(`Skipping import on line ${index + 2}. Content is required`)
            return
          }

          const existingPost = await fetch(`/api/posts?where[title][equals]=${item.title}`).then(
            (res) => res.json().then((json) => json),
          )
          if (existingPost.docs && existingPost.docs[0]) {
            skippedImportCount += 1
            toast.info(
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold">Skipping import on line {index + 1}</span>
                <span className="font-light">
                  Post with Title <em>{item.title}</em> already exists
                </span>
              </div>,
            )
            return
          }
          const globalCategories = await fetch('/api/categories', {
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

          // GET IMAGE GALLERY VALUES
          const imageUrls: string[] = item.image_urls ? item.image_urls.split('|') : []
          const imageAltTexts: string[] = item.image_alt_texts
            ? item.image_alt_texts.split('|')
            : []
          const imageFileNames: string[] = item.image_filenames
            ? item.image_filenames.split('|')
            : []
          console.log(imageUrls)
          // GET FEATURED IMAGE VALUES
          const featuredImageUrl = imageUrls.shift() || undefined
          const featuredImageAltText = imageAltTexts.shift() || undefined
          const featuredImageFileName = imageFileNames.shift() || undefined

          // GET LISTING DATA VALUES
          const title = item.title || ''
          const category = globalCategories.find(
            (globalCategory: { id: number; title: string }) =>
              globalCategory.title === item.categories.toLowerCase().replaceAll(' ', '-'),
          )?.id
          const content = item.content || {}
          // const metaDescription = item.meta_description ? item.meta_description : undefined

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

          let formattedContent: SerializedEditorState | undefined = undefined
          const editor = createHeadlessEditor()
          const parser = new DOMParser()

          editor.update(
            () => {
              const dom = parser.parseFromString(content || '', 'text/html')

              const nodes = $generateNodesFromDOM(editor, dom)
              $getRoot().select()
              $getSelection()?.insertNodes(nodes)
            },
            { discrete: true },
          )
          formattedContent = editor.getEditorState().toJSON()

          const postData = {
            title,
            featuredImage: featuredImageId,
            content: formattedContent,
            category: category,
            // excerpt: metaDescription,
            meta: {
              title,
              // description: metaDescription,
              image: featuredImageId,
            },
          }
          const postResponse = await fetch('/api/posts', {
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
                console.error('Error creating Post: ' + error.message)
                toast.error(
                  <div className="flex flex-col gap-2">
                    <span className="text-2xl font-bold">Error importing Post</span>
                    <span className="font-light">{error.message}</span>
                  </div>,
                )
                return undefined
              }),
          )
          if (postResponse.doc) {
            console.log(postResponse.doc)
            successfulImportCount += 1
            toast.success(
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold">Post created successfully</span>
                <span className="font-light">{title} created</span>
              </div>,
            )
          }
        }
        return
      })
      await Promise.all(uploadPromises)

      toast.info(
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold">Import Complete</span>
          <span className="font-light">{successfulImportCount} Posts successfully created</span>
          <span className="font-light">{failedImportCount} Posts failed to be created</span>
          <span className="font-light">{skippedImportCount} Posts skipped</span>
        </div>,
      )
    } catch (error: any) {
      console.error('Unexpected Error: ' + error.message)
      toast.error(
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold">Error importing Post</span>
          <span className="font-light">{error.message}</span>
        </div>,
      )
      return
    } finally {
      setIsLoading(false)
      setFile(null)
      setData([])
      // router.push('/admin/collections/posts')
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
                    setData(successfulRows)
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
            'Import Posts'
          ) : (
            <FontAwesomeIcon icon={faCircleNotch} className="w-4 h-auto animate-spin" />
          )}
        </Button>
      )}
    </div>
  )
}
