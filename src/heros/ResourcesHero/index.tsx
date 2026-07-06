import React from 'react'
import type { Form, Page } from '@/payload-types'
import { ResourcesHeroClient } from './index.client';

export const ResourcesHero: React.FC<Page['hero'] & { title: string } & { form: Form }> = async ({
  media,
  enableOverrideTitle,
  overrideTitle,
  title,
  subtitle,
  form
}) => {

  return (
    <ResourcesHeroClient
      media={media}
      enableOverrideTitle={enableOverrideTitle}
      overrideTitle={overrideTitle}
      title={title}
      subtitle={subtitle}
      form={form}
    />
  )
}
