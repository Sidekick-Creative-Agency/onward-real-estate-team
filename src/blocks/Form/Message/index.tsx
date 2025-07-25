import RichText from '@/components/RichText'
import React from 'react'

export const Message: React.FC = ({ message, className }: { message: Record<string, any>, className?: string }) => {
  if (!message) return
  return (
    <div className={className}>
      <RichText content={message} enableGutter={false} />
    </div>

  )
}
