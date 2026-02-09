import { Gutter } from '@payloadcms/ui'

import { AdminViewProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { ListingsImport } from '@/components/Admin/ListingsImport'
export const ImportView: React.FC<AdminViewProps> = ({ initPageResult, params, searchParams }) => {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Import Listings</h1>
      </Gutter>
      <Gutter className="mt-8">
        <ListingsImport />
      </Gutter>
    </DefaultTemplate>
  )
}
