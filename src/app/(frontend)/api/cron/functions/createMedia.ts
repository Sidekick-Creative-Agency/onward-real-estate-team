import { Media } from '@/payload-types'

export const createMedia = async (url: string | undefined, filename: string | undefined) => {
  if (!url || !filename) return undefined
  const downloadController = new AbortController()
  const downloadTimeout = setTimeout(() => downloadController.abort(), 20000)
  let mediaBlob: Blob
  try {
    mediaBlob = await fetch(url || '/', { signal: downloadController.signal }).then((res) =>
      res.blob().then((blob) => blob),
    )
  } catch (error) {
    console.error('ERROR DOWNLOADING MEDIA:', error)
    return undefined
  } finally {
    clearTimeout(downloadTimeout)
  }
  const formData = new FormData()
  formData.append('file', mediaBlob, filename)

  const uploadController = new AbortController()
  const uploadTimeout = setTimeout(() => uploadController.abort(), 30000)
  const createMediaResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL || `http://localhost:${process.env.PORT}`}/api/media`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${process.env.PAYLOAD_SECRET}`,
      },
      signal: uploadController.signal,
    },
  )
    .then((response) => response.json().then((json) => json))
    .catch((error) => {
      console.error('ERROR CREATING MEDIA:', error)
      return undefined
    })
    .finally(() => {
      clearTimeout(uploadTimeout)
    })
  return createMediaResponse?.doc as Media | undefined
}
