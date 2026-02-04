import { getMeUser } from '@/utilities/getMeUser'
import { CollectionBeforeOperationHook } from 'payload'

export const beforeOperationHook: CollectionBeforeOperationHook = async ({ args, req }) => {
  const isStaticGeneration =
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-export' ||
    process.env.NEXT_EXPORT === 'true'
  if (isStaticGeneration) {
    return
  }

  try {
    const user = await getMeUser()
    req.user = {
      ...user.user,
      collection: 'users',
    }
  } catch (error) {
    // Silently fail during static generation
    console.log('Error getting me user in beforeOperationHook:', error)
  }
}
