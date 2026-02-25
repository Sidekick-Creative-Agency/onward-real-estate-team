import React from 'react'
import { Card } from '@/components/Card'
import { DataFromCollectionSlug } from 'payload'

export type Props = {
  archive: DataFromCollectionSlug<'posts' | 'team-members' | 'listings'>[]
  relationTo?: 'posts' | 'team-members' | 'listings' | null | undefined
}

export const CollectionArchiveGrid: React.FC<Props> = (props) => {
  const { archive, relationTo } = props
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
      {archive?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div className="col-span-4" key={index}>
              <Card className="h-full" doc={result} relationTo={relationTo} />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
