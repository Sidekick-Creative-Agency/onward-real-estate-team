import configPromise from '@payload-config'
import { getPayload } from 'payload'
export const findMediaByFilename = async (filename: string | undefined) => {
  try {
    if (!filename) {
      console.log('NO FILENAME PROVIDED')
      return undefined
    }
    const payload = await getPayload({ config: configPromise })
    const media = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: filename,
        },
      },
      sort: '-createdAt',
      limit: 1,
    })
    if (media.totalDocs === 0) {
      console.log(`NO MEDIA FOUND WITH FILENAME CONTAINING: ${filename}`)
      return undefined
    }
    return media.docs[0]
  } catch (error) {
    console.error('ERROR FINDING MEDIA BY FILENAME:', error)
    return undefined
  }
}
