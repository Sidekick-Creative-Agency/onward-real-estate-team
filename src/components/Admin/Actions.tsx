'use client'
import { revalidateSite } from '@/app/(frontend)/api/revalidateSite'

import { Button, toast } from '@payloadcms/ui'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { ClientComponentProps } from 'payload'
import { useState } from 'react'

export const Actions: React.FC<ClientComponentProps> = () => {
  const [isRevalidating, setIsRevalidating] = useState(false);
  const handleRevalidateSite = async () => {
    setIsRevalidating(true)
    await revalidateSite();
    toast.success('Site revalidated!')
    setIsRevalidating(false)
  }

  return (
    <div className="flex-grow flex items-center gap-[var(--base)]">
      <Button onClick={handleRevalidateSite} buttonStyle={'secondary'} size={'medium'} tooltip='This will clear the server cache. Use with caution.'>{isRevalidating ? 'Revalidating...' : 'Revalidate Site'}</Button>

      <Link href="/" target="_blank" aria-label="Go to live site">
        <ExternalLink className="w-6 text-white" />
      </Link>
    </div>
  )
}
