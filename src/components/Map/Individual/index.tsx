'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles.scss'
import { Listing, Media as MediaType } from '@/payload-types'

import { useEffect, useRef } from 'react'
import mapboxgl, { Map } from 'mapbox-gl'

import { formatPrice } from '@/utilities/formatPrice'

interface ListingMapProps {
  listing: Listing
}

export const ListingMap: React.FC<ListingMapProps> = ({ listing }) => {
  const mapContainerRef = useRef<any>(null)
  const mapRef = useRef<Map>(null)

  const centerMap = () => {
    mapRef.current?.flyTo({
      center: [listing.coordinates[0], listing.coordinates[1]],
      speed: 0.5,
    })
  }

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
      container: mapContainerRef.current,
      center: [listing.coordinates[0], listing.coordinates[1]],
      zoom: 10,
      scrollZoom: false,
    })
    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left')

    const el = document.createElement('div')
    el.className = 'marker'
    el.style.maxWidth = '32px'

    el.innerHTML = mapMarkerIcon

    const newMarker = new mapboxgl.Marker(el)
      .setLngLat([listing.coordinates[0], listing.coordinates[1]])
      .setPopup(
        new mapboxgl.Popup({ offset: 25, focusAfterOpen: false }).setHTML(
          `
                <div class="marker-popup rounded-lg overflow-hidden">
                  <div class="marker-popup_image-container relative aspect-video">
                    <img src="${(listing.featuredImage as MediaType)?.sizes?.medium?.url}" alt="${(listing.featuredImage as MediaType).alt}" class="marker-popup_image w-full absolute top-0 left-0 h-full object-cover" />
                  </div>
                  <div class="p-6 bg-white flex flex-col-reverse">
                    <h3 class="marker-title font-basic-sans text-brand-gray-04 text-base font-light">${listing.streetAddress}</h3>
                    <span class="marker-description text-2xl font-basic-sans font-bold text-brand-gray-06"> ${typeof listing?.price === 'number' && listing?.price !== 0 && !listing?.priceLabel ? (

            `${formatPrice(listing?.price)}${listing?.textAfterPrice ? `<span class="text-sm ml-2 text-normal" > ${listing.textAfterPrice}</span>` : ''}`

          ) : (

            `${listing?.priceLabel || 'Contact for price'}`

          )}</span>
                  </div>
                </div>

                `,
        ),
      )
      .addTo(mapRef.current)
      .togglePopup()

    el.addEventListener('click', (e) => {
      centerMap()
    })

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return (
    <div className="w-full border-t border-gray-100">
      <div className="relative">
        <div
          id="map"
          ref={mapContainerRef}
          className="h-1/2 min-h-[35rem] sm:h-full sm:min-h-[calc(100vh-10rem)]"
        ></div>
      </div>
    </div>
  )
}

const mapMarkerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="48" viewBox="0 0 37 48" fill="none" style="width: 100%">
  <path d="M18.1622 48C18.1622 48 36.3243 28.5 36.3243 18C36.3243 8.0625 28.1892 0 18.1622 0C8.13514 0 0 8.0625 0 18C0 28.5 18.1622 48 18.1622 48ZM18.1622 12C19.7678 12 21.3077 12.6321 22.443 13.7574C23.5784 14.8826 24.2162 16.4087 24.2162 18C24.2162 19.5913 23.5784 21.1174 22.443 22.2426C21.3077 23.3679 19.7678 24 18.1622 24C16.5565 24 15.0167 23.3679 13.8813 22.2426C12.7459 21.1174 12.1081 19.5913 12.1081 18C12.1081 16.4087 12.7459 14.8826 13.8813 13.7574C15.0167 12.6321 16.5565 12 18.1622 12Z" fill="#0B2A35"/>
</svg>`
