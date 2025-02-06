import { CollectionBeforeChangeHook } from 'payload'

export const beforeChangeHook: CollectionBeforeChangeHook = async ({
  req,
  data,
  operation,
  originalDoc,
}) => {
  if (operation !== 'create') return data
  console.log(data)
  const filename = (data.filename as string)?.slice(0, -4)
  const existingAttachmentFilenames = await req.payload.find({
    collection: 'attachments',
    where: {
      filename: {
        like: filename,
      },
    },
  })
  if (existingAttachmentFilenames) {
    data.filename = `${filename}-${existingAttachmentFilenames.docs.length}.pdf`
  }

  return data
}
