import { CollectionBeforeChangeHook } from 'payload'

export const beforeChangeHook: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data

  const filename = data.filename as string
  if (!filename) return data

  // Split off the extension so its dot is preserved.
  const dot = filename.lastIndexOf('.')
  const base = dot > 0 ? filename.slice(0, dot) : filename
  const ext = dot > 0 ? filename.slice(dot) : '' // includes the leading '.'

  let candidate = filename
  let count = 0

  // Bump a numeric suffix until we find a filename that isn't already taken.
  while (true) {
    const existing = await req.payload.find({
      collection: 'attachments',
      where: { filename: { equals: candidate } },
      limit: 1,
      depth: 0,
      req,
    })

    if (existing.totalDocs === 0) break

    count += 1
    candidate = `${base}-${count}${ext}`
  }

  data.filename = candidate
  return data
}
