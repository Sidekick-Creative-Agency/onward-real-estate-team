import { withPayload } from '@payloadcms/next/withPayload'
import withPlaiceholder from '@plaiceholder/next'

import redirects from './redirects.js'
const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL, 'https://ntrdd.mlsmatrix.com'].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https' | undefined,
        }
      }),
    ],
  },
  reactStrictMode: true,
  staticPageGenerationTimeout: 120,
  redirects,
}

export default withPayload(withPlaiceholder(nextConfig))
