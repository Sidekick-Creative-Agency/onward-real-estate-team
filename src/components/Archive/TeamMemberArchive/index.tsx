import { cn } from 'src/utilities/cn'
import React from 'react'

import { Card } from '@/components/Card'
import { DataFromCollectionSlug } from 'payload'
import { TeamMemberCard } from '@/components/TeamMembers/TeamMemberCard'

interface TeamMemberArchiveGridProps {
  data: DataFromCollectionSlug<'team-members'>[]
}

export const TeamMemberArchiveGrid: React.FC<TeamMemberArchiveGridProps> = (props) => {
  const { data } = props
  return (
    <div className="flex flex-col gap-12 md:gap-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-x-10 md:gap-y-20">
        {data
          ?.filter((teamMember) => teamMember.details.isLeadership)
          .map((teamMember) => {
            if (typeof teamMember === 'object' && teamMember !== null) {
              return (
                <div className="w-full" key={teamMember.id}>
                  <TeamMemberCard teamMember={teamMember} />
                </div>
              )
            }
            return null
          })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-x-10 md:gap-y-20">
        {data
          ?.filter((teamMember) => !teamMember.details.isLeadership)
          .map((teamMember) => {
            if (typeof teamMember === 'object' && teamMember !== null) {
              return (
                <div className="w-full" key={teamMember.id}>
                  <TeamMemberCard teamMember={teamMember} />
                </div>
              )
            }
            return null
          })}
      </div>
    </div>
  )
}
