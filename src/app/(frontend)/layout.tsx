import type { Metadata } from 'next'
import React from 'react'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
// import { draftMode } from 'next/headers'

import './globals.css'
import { Toaster } from '@/components/ui/toaster'

import { CookieBanner } from '@/CookieBanner/Component'
import { GoogleAnalytics } from '@next/third-parties/google'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // const { isEnabled } = await draftMode()

  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <head>
        {/* <InitTheme /> */}
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link rel="stylesheet" href="https://use.typekit.net/kcr2apw.css"></link>
      </head>
      <body>
        <Providers>
          {/* <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          /> */}
          <LivePreviewListener />

          <Header />
          {children}
          <Footer />
          <CookieBanner />
        </Providers>
        <Toaster />
      </body>
      {process.env.NODE_ENV === 'production' && <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID || ''} />}

    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  openGraph: mergeOpenGraph(),
}
