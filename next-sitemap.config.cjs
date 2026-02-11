const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'http://localhost:3000'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/posts-sitemap.xml',
    '/pages-sitemap.xml',
    'listings-sitemap.xml',
    'team-sitemap.xml',
    '/*',
    '/posts/*',
    'listings/*',
    'about/team/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/listings-sitemap.xml`,
      `${SITE_URL}/team-sitemap.xml`,
    ],
  },
}
