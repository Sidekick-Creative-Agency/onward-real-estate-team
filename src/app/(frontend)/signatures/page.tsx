

import configPromise from '@payload-config'
import React from 'react'
import { getPayload } from 'payload'
import PageClient from './page.client'
import './styles.scss'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: {
    index: false
  }
}

export default async function Page() {

  const payload = await getPayload({ config: configPromise })
  const teamMembersResponse = await payload.find({
    collection: 'team-members',
    pagination: false,
    sort: 'lastName'
  })
  const teamMembers = teamMembersResponse.docs

  return (
    <div className='container py-20'>
      <div className="flex flex-col gap-6">
        <h1
          className="text-brand-navy text-[2.5rem] sm:text-[4rem] text-center font-bold"
        >
          Email Signatures
        </h1>
        <p
          className="text-center font-light text-brand-gray-04"
        >
          The email signatures below have been coded for consistency across most email clients on
          multiple desktop platforms (PC, Mac, Linux) and mobile devices (IOS, Android). You will
          need to add your signature to every mail client you use to send emails for Onward Real
          Estate. This could include your phone’s email app, Gmail on your desktop, or a
          browser-based email suite.<br /><br />
          A video walkthrough of how to install your email signature can be found {' '}
          <a
            href="https://www.loom.com/share/6cbf9791551d4745aaea84c63f0f15cd?sid=d7e1ef2e-9ecc-4a51-b4f8-aef5cc600b20"
            target="_blank"
            rel="noreferrer noopener"
            className="underline text-brand-navy"
          >here</a>.<br /><br /><span className="font-bold"
          >Select your name from the list below to navigate to your email signature.</span>
        </p>
        <ul
          className="flex gap-y-2 justify-center flex-wrap items-center mb-40"
        >
          {teamMembers.map((teamMember, index) => (
            <li key={index}
              className={`${index !== teamMembers.length - 1 ? 'border-r border-brand-gray-01' : ''} px-4 py-0 inline-block`}
            >
              <a
                className="text-brand-navy underline text-center"
                href={`#email-signature-${teamMember.slug}`}
              >{teamMember.title}</a>
            </li>
          ))}
        </ul>
      </div>
      <PageClient teamMembers={teamMembers} />
    </div>
  )
}
