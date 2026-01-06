import { getMeUser } from '@/utilities/getMeUser'
import { CollectionBeforeOperationHook } from 'payload'

export const beforeOperationHook: CollectionBeforeOperationHook = async ({ args, req }) => {
  try {
    const user = await getMeUser()
    req.user = {
      ...user.user,
      collection: 'users',
    }
  } catch (error) {
    // Silently fail during static generation
    console.log('Skipping getMeUser during static generation')
  }
}
