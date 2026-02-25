'use client'


import { Button } from '@payloadcms/ui'
import { useState } from 'react'



export const ListingsImport = () => {
    const [isLoading, setIsLoading] = useState(false)
    const handleImport = async () => {
        // try {
        //     setIsLoading(true)
        //     const createdListings = await importResidentialListings()
        //     console.log(`Created ${createdListings?.length} Listings`);
        //     toast.success(`Created ${createdListings?.length} Listings`)
        // } catch (error) {
        //     console.log(error)
        //     toast.error('Error: ' + error)
        // } finally {
        //     setIsLoading(false)
        // }
    }

    return <Button onClick={handleImport}>{isLoading ? 'Importing...' : 'Import Listings'}</Button>
}