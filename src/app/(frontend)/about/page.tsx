import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { queryPageByUrl } from '@/utilities/queryPageByUrl'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Metadata } from 'next'
import { Page as PageType } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'

export default async function Page() {
  const url = '/about'

  const page = await queryPageByUrl({
    url,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
    // notFound()
  }
  const { hero, layout, title } = page
  return (
    <main id="main">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      <RenderHero {...hero} title={title} />
      <RenderBlocks blocks={layout} />
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const url = '/about'
  let page: PageType | null
  page = await queryPageByUrl({
    url,
  })
  if (page) {
    return generateMeta({ doc: page })
  }
  return {}
}
