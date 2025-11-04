'use client'
import { useField } from '@payloadcms/ui'
import React, { useEffect } from 'react'

export function AttachmentsUpload() {
    const { value, setValue } = useField({ path: 'attachments' })

    useEffect(() => {
        console.log('Current value:', value)
    }, [value])
    return <input type="file" onChange={(e) => setValue(e.target.files)} />
}