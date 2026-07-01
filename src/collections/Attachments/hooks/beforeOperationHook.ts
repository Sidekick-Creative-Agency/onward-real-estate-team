import { getMeUser } from '@/utilities/getMeUser'
import { CollectionBeforeOperationHook } from 'payload'

export const beforeOperationHook: CollectionBeforeOperationHook = async ({
  req,
  operation,
}) => {
  // Read operations are public — no need to resolve user, and doing so would
  // call cookies() which breaks ISR revalidation (no request context available).
  if (operation === 'find' || operation === 'findByID' || operation === 'count' || operation === 'read' || operation === 'readDistinct' || operation === 'findDistinct') {
    return
  }

  try {
    const user = await getMeUser()
    req.user = {
      ...user.user,
      collection: 'users',
    }
  } catch (error) {
    console.log('Error getting me user in beforeOperationHook:', error)
  }
}
