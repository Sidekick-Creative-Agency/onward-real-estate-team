import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Page } from '@/payload-types'
import { ResourcesHeroClient } from './index.client';

export const ResourcesHero: React.FC<Page['hero'] & { title: string }> = async ({
  media,
  enableOverrideTitle,
  overrideTitle,
  title,
  subtitle,
  form
}) => {
  const resolvedForm =
    form && typeof form === 'object'
      ? form
      : typeof form === 'number'
        ? await getPayload({ config: configPromise }).then((payload) =>
            payload.findByID({ collection: 'forms', id: form }),
          )
        : null

  if (!resolvedForm) return null

  return (
    <ResourcesHeroClient
      media={media}
      enableOverrideTitle={enableOverrideTitle}
      overrideTitle={overrideTitle}
      title={title}
      subtitle={subtitle}
      form={resolvedForm}
    />
  )
}
