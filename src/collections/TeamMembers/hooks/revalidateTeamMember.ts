import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { TeamMember } from '../../../payload-types'

export const revalidateTeamMember: CollectionAfterChangeHook<TeamMember> = ({
  doc,
  req: { payload },
}) => {
  if (doc.slug) {
    const path = `/team-members/${doc.slug}`
    payload.logger.info(`Revalidating team member at path: ${path}`)
    revalidatePath(path)
    revalidateTag('team-sitemap', 'max')
  }

  return doc
}
