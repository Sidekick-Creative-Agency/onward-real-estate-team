import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateCookieBanner: GlobalAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating Cookie Banner`)

  revalidateTag('global_cookie-banner', 'max')

  return doc
}
