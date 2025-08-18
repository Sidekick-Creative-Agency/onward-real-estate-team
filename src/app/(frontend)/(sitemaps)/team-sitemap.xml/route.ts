import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getTeamSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'team-members',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((teamMember) => Boolean(teamMember?.slug))
          .map((teamMember) => {
            return {
              loc: `${SITE_URL}/about/team/${teamMember?.slug}`,
              lastmod: teamMember.updatedAt || dateFallback,
            }
          })
      : []

    return [...sitemap]
  },
  ['team-sitemap'],
  {
    tags: ['team-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getTeamSitemap()

  return getServerSideSitemap(sitemap)
}
