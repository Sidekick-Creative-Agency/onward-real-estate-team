import { Media } from '@/payload-types'

export const createMedia = async (url: string | undefined, filename: string | undefined) => {
  if (!url || !filename) return undefined
  const mediaBlob = await fetch(url || '/').then((res) => res.blob().then((blob) => blob))
  const formData = new FormData()
  formData.append('file', mediaBlob, filename)

  const createMediaResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL || `http://localhost:${process.env.PORT}`}/api/media`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${process.env.PAYLOAD_SECRET}`,
      },
    },
  )
    .then((response) => response.json().then((json) => json))
    .catch((error) => {
      console.error('ERROR CREATING MEDIA:', error)
      return undefined
    })
  return createMediaResponse?.doc as Media | undefined
}
