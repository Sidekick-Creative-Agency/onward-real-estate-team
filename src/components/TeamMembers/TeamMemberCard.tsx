import { TeamMember } from '@/payload-types'
import React from 'react'
import { Media } from '../Media'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../ui/button'
import Link from 'next/link'
import { faPlus } from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'


interface TeamMemberCardProps {
  teamMember: TeamMember
}
export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ teamMember }) => {
  return (
    <Link className="flex flex-col gap-6 w-full" href={`/about/team/${teamMember.slug}`}>
      <Media
        resource={teamMember.details.featuredImage}
        className="aspect-[4/5] relative"
        imgClassName="absolute top-0 left-0 object-cover object-[50%_35%] w-full h-full"
        size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (min-width: 1025px) 33.3vw"
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="text-2xl text-brand-gray-06 font-bold inline leading-tight">
              {teamMember.title}
            </h3>
            {teamMember.details.designations && (
              <span className="inline text-xs text-brand-gray-06 font-bold ml-2 leading-tight">
                {teamMember.details.designations}
              </span>
            )}
          </div>
        </div>
        <span className="text-gray-600 text-base font-light leading-tight">
          {teamMember.details.jobTitle} {teamMember.details.company === 'alliance' && '(Alliance Property Management)'}
        </span>
        <Button
          variant={'link'}
          className="flex gap-2 items-center px-0 py-4 w-fit rounded-none hover:no-underline focus-visible:no-underline focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2"
        >
          <FontAwesomeIcon icon={faPlus} className="w-full max-w-3" />
          <span>Learn More</span>
        </Button>
      </div>
    </Link>
  )
}
