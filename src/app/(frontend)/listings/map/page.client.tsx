'use client'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Listing, Media as MediaType } from '@/payload-types'
import { useEffect, useRef, useState } from 'react'
import mapboxgl, { LngLatBounds, LngLatBoundsLike, LngLatLike, Map, MapMouseEvent, Marker } from 'mapbox-gl'
import { Card } from '../../../../components/ui/card'
import { Media } from '../../../../components/Media'
import { Button } from '../../../../components/ui/button'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBath, faBedFront, faFarm } from '@awesome.me/kit-a7a0dd333d/icons/sharp-duotone/thin'
import {
  faEnvelope,
  faArrowUpArrowDown,
  faCircleNotch,
  faList,
  faMap,
  faChevronLeft,
  faChevronRight,
  faChevronDoubleLeft,
  faChevronDoubleRight,
} from '@awesome.me/kit-a7a0dd333d/icons/sharp/light'
import { formatNumber } from '@/utilities/formatNumber'
import { formatPrice } from '@/utilities/formatPrice'
import { FilterBar } from '@/components/Map/filterBar'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Skeleton } from '@/components/ui/skeleton'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useWindowDimensions from '@/utilities/useWindowDimensions'
import defaultTheme from 'tailwindcss/defaultTheme'
import { faXmark } from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import './styles.scss'
import { useDebounce } from '@/utilities/useDebounce'
import { PaginatedDocs } from 'payload'

interface MapPageClientProps {
  listingsCount?: number
}

interface MapListing {
  id: number
  coordinates: [number, number]
  // title: string
  // featuredImage: number | MediaType
  // textAfterPrice?: string | null | undefined;
  // transactionType?: ("for-sale" | "for-lease") | null | undefined;
  // streetAddress: string;
  category?: ("commercial" | "residential") | null | undefined;
  // price?: number | null | undefined;
  MLS?: {
    ListOfficeName?: string | null
  }
  // slug?: string | null | undefined
}



export interface MapFilters {
  search?: string | null | undefined
  category?: string | null | undefined
  propertyType?: string | null | undefined
  minPrice?: string | null | undefined
  maxPrice?: string | null | undefined
  minSize?: string | null | undefined
  maxSize?: string | null | undefined
  sizeType?: string | null | undefined
  availability?: string | null | undefined
  transactionType?: 'for-sale' | 'for-lease' | null | undefined
}

export const FormSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  propertyType: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minSize: z.string().optional(),
  maxSize: z.string().optional(),
  sizeType: z.string().optional(),
  availability: z.string().optional(),
  transactionType: z.string().optional(),
})

const sortOptions = [
  {
    value: '-price',
    label: 'Price (High to Low)',
  },
  {
    value: 'price',
    label: 'Price (Low to High)',
  },
  {
    value: '-area, -acreage',
    label: 'Size (High to Low)',
  },
  {
    value: 'area, acreage',
    label: 'Size (Low to High)',
  },
  {
    value: '-createdAt',
    label: 'Newest',
  },
  {
    value: 'createdAt',
    label: 'Oldest',
  },
]

const calculateBounds = (bounds: LngLatBounds | null | undefined) => {
  if (!bounds) {
    console.log('Error: no bounds found')
    return
  }
  const ne = [bounds._ne.lng, bounds._ne.lat]
  const sw = [bounds._sw.lng, bounds._sw.lat]
  const nw = [ne[0], sw[1]]
  const se = [sw[0], ne[1]]
  return [sw, nw, ne, se, sw] as [number, number][]
}

export const PageClient: React.FC<MapPageClientProps> = ({ listingsCount }) => {
  const mapContainerRef = useRef<any>(null)
  const mapRef = useRef<Map>(null)
  const searchParams = useSearchParams()
  const { width } = useWindowDimensions()
  const [activeCardListings, setActiveCardListings] = useState<Listing[] | undefined>([])

  const [totalListings, setTotalListings] = useState<number | undefined>(listingsCount)
  const [isCardsLoading, setIsCardsLoading] = useState(false)
  const [isMapLoading, setIsMapLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('map')
  const [filters, setFilters] = useState<MapFilters | undefined>(undefined)
  const [hasNextPage, setHasNextPage] = useState<boolean | null | undefined>(undefined)
  const [hasPrevPage, setHasPrevPage] = useState<boolean | null | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<number | null | undefined>(searchParams.get('page') ? Number(searchParams.get('page')) : undefined)
  const [totalPages, setTotalPages] = useState<number | null | undefined>(undefined)
  const [nextPage, setNextPage] = useState<number | null | undefined>(undefined)
  const [prevPage, setPrevPage] = useState<number | null | undefined>(undefined)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [bounds, setBounds] = useState<[number, number][] | undefined>(undefined)
  const { setHeaderTheme } = useHeaderTheme()
  const router = useRouter()

  const pathname = usePathname()
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [sortData, setSortData] = useState<{ value: string; label: string } | undefined>(undefined)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search: '',
      category: '',
      propertyType: '',
      minPrice: undefined,
      maxPrice: undefined,
      minSize: '',
      maxSize: '',
      sizeType: '',
      availability: '',
      transactionType: ''
    }
  })

  const debouncedBounds = useDebounce(bounds, 750)

  const handleFilter = (filters: MapFilters, page: number | undefined, sort?: string | null, options?: { ignoreBounds: boolean }) => {
    setFilters(filters)
    Promise.all([
      fetchCardListings(filters, page, sort, options),
      fetchMapListings(filters, options)
    ]).then((res) => {
      if (res) {
        updateSearchParams(res)
      }
    })
  }

  const updateSearchParams = (paramsArray: (string | undefined)[]) => {
    const paramsSet = new Set<string>();
    paramsArray.forEach(str => {
      if (str) {
        str.split('&').forEach(pair => {
          const key = pair.split('=')[0];
          paramsSet.delete(Array.from(paramsSet).find(p => p.startsWith(key + '=')) || '');
          paramsSet.add(pair);
        });
      }
    });
    const dedupedParams = Array.from(paramsSet).join('&');
    router.replace(pathname + '?' + dedupedParams, { scroll: false });
  }

  const fetchCardListings = async (
    filterData?: MapFilters,
    page?: number | null,
    sort?: string | null,
    options?: {
      ignoreBounds: boolean
    }
  ) => {
    setActiveCardListings([])
    setIsCardsLoading(true)
    const querySearchParams = new URLSearchParams()
    if (filterData) {
      querySearchParams.set('filters', JSON.stringify(filterData))
    }
    if (!options?.ignoreBounds && debouncedBounds) {
      querySearchParams.set('bounds', JSON.stringify(debouncedBounds))
    }
    if (sort) {
      querySearchParams.set('sort', sort);
    }
    if (page) {
      querySearchParams.set('page', String(page));
    }
    const response = await fetch('/api/listings/cards?' + querySearchParams.toString()).then((res) => res.json()) as {
      ok: boolean;
      listings: PaginatedDocs<Listing> | null;
      error: string | null;
    }
    if (!response.ok) {
      console.log('Error fetching map listings:', response.error)
      return
    }
    const newSearchParams = new URLSearchParams()
    if (sort) {
      newSearchParams.set('sort', sort.toString())
    }
    if (page) {
      newSearchParams.set('page', page.toString())
    }
    if (filterData) {
      for (const [key, value] of Object.entries(filterData)) {
        if (value) {
          newSearchParams.set(key, value)
        }
      }
    }
    setSortData(sortOptions.find((option) => option.value === sort) || undefined);
    setHasPrevPage(response.listings?.hasPrevPage)
    setHasNextPage(response.listings?.hasNextPage)
    setActiveCardListings(response.listings?.docs)
    setPrevPage(response.listings?.prevPage)
    setNextPage(response.listings?.nextPage)
    setTotalPages(response.listings?.totalPages)
    setCurrentPage(page)
    setIsCardsLoading(false)
    return newSearchParams.toString()
  }
  const fetchMapListings = async (
    filterData?: MapFilters,
    options?: {
      ignoreBounds: boolean
    }
  ) => {
    setIsMapLoading(true)

    const querySearchParams = new URLSearchParams()
    if (filterData) {
      querySearchParams.set('filters', JSON.stringify(filterData))
    }
    if (!options?.ignoreBounds && debouncedBounds) {
      querySearchParams.set('bounds', JSON.stringify(debouncedBounds))
    }
    const response = await fetch('/api/listings/map?' + querySearchParams.toString()).then((res) => res.json()) as {
      ok: boolean;
      listings: PaginatedDocs<Listing> | null;
      error: string | null;
    }
    if (!response.ok) {
      console.log('Error fetching map listings:', response.error)
      return
    }
    const newSearchParams = new URLSearchParams()
    if (filterData) {
      for (const [key, value] of Object.entries(filterData)) {
        if (value) {
          newSearchParams.set(key, value)
        }
      }
    }

    if (response.listings) {
      updateMapListings(response.listings?.docs as MapListing[] || [])
      setTotalListings(response.listings?.totalDocs)
    }
    setIsMapLoading(false)
    return newSearchParams.toString()
  }

  const clearPopups = () => {
    if (mapRef.current) {
      mapRef.current._popups.forEach((popup) => popup.remove())
    }
  }

  const updateBounds = () => {
    setBounds(calculateBounds(mapRef.current?.getBounds()))
  }

  const handleClusterClick = (e: MapMouseEvent) => {
    const features = mapRef.current?.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });
    if (features && typeof features === 'object') {
      const clusterId = features[0].properties?.cluster_id;
      // @ts-expect-error
      mapRef.current?.getSource('listings')?.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        mapRef.current?.easeTo({
          // @ts-expect-error
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      })
    }
  }

  const loadMarkerImages = () => {
    mapRef.current?.loadImage(
      '/map/map-marker.png',
      (error, image) => {
        if (error) throw error;
        if (image) mapRef.current?.addImage('default-marker', image);
      })
    mapRef.current?.loadImage(
      '/map/onward-map-marker.png',
      (error, image) => {
        if (error) throw error;
        if (image) mapRef.current?.addImage('onward-marker', image);
      })
  }

  const handleClearMap = () => {
    if (mapRef?.current?.getLayer('clusters')) {
      mapRef.current.removeLayer('clusters');
    }
    if (mapRef?.current?.getLayer('clusters-inner')) {
      mapRef.current.removeLayer('clusters-inner');
    }

    if (mapRef?.current?.getLayer('clusters-outer')) {
      mapRef.current.removeLayer('clusters-outer');
    }

    if (mapRef?.current?.getLayer('cluster-count')) {
      mapRef.current.removeLayer('cluster-count');
    }

    if (mapRef?.current?.getLayer('unclustered-point')) {
      mapRef.current.removeLayer('unclustered-point');
    }

    if (mapRef?.current?.getSource('listings')) {
      mapRef.current.removeSource('listings');
    }
  }

  const updateMapListings = (mapListings: MapListing[]) => {
    if (mapListings && mapListings.length > 0) {
      const geoJson = {
        type: 'FeatureCollection',
        features: mapListings.map((listing) => {
          return {
            type: 'Feature',
            properties: {
              // title: listing.title,
              // slug: listing.slug,
              // address: listing.streetAddress,
              // price:
              //   typeof listing.price === 'number' && listing.price !== 0
              //     ? formatPrice(listing.price)
              //     : '',
              // textAfterPrice: listing.textAfterPrice || '',
              // transactionType: listing.transactionType,
              // imageSrc: (listing.featuredImage as MediaType).thumbnailURL,
              // imageAlt: (listing.featuredImage as MediaType).alt,
              lat: listing.coordinates[1],
              lon: listing.coordinates[0],
              id: listing.id,
              // iconSize: 32,
              category: listing.category,
              listOfficeName: listing.MLS?.ListOfficeName || '',
            },
            geometry: {
              type: 'Point',
              coordinates: [listing.coordinates[0], listing.coordinates[1]] as LngLatLike,
            },
          }
        }),
      }
      if (mapRef.current) {
        handleClearMap()
        mapRef.current.addSource('listings', {
          type: 'geojson',
          data: geoJson as GeoJSON.GeoJSON,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 40
        });

        // MAP LAYERS
        mapRef.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'listings',
          filter: ['has', 'point_count'],
          paint: {
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              18,
              5,
              24
            ],
            "circle-opacity": 0
          }
        });

        mapRef.current.addLayer({
          id: 'clusters-inner',
          type: 'circle',
          source: 'listings',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#A9C1C9',
              5,
              '#0B2A35',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              12,
              5,
              14
            ]
          },
          layout: {
            'circle-sort-key': 2
          }
        });

        mapRef.current.addLayer({
          id: 'clusters-outer',
          type: 'circle',
          source: 'listings',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#A9C1C9',
              5,
              '#0B2A35',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              18,
              5,
              20
            ],
            'circle-opacity': .5
          },
          layout: {
            'circle-sort-key': 0
          }
        });

        mapRef.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'listings',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-size': 12
          },
          paint: {
            'text-color': [
              'step',
              ['get', 'point_count'],
              '#0B2A35',
              5,
              '#FFFFFF'
            ]
          }
        });

        mapRef.current.addLayer({
          id: 'unclustered-point',
          type: 'symbol',
          source: 'listings',
          filter: ["all", ['!', ['has', 'point_count']],],
          layout: {
            'icon-image': ["case", ["all", ["!=", ["get", "listOfficeName"], ''], ["!=", ["get", "listOfficeName"], process.env.NEXT_PUBLIC_RETS_LIST_OFFICE_NAME]], 'default-marker', 'onward-marker'],
            'icon-size': ["case", ["all", ["!=", ["get", "listOfficeName"], ''], ["!=", ["get", "listOfficeName"], process.env.NEXT_PUBLIC_RETS_LIST_OFFICE_NAME]], .07, .225],
          }
        });

        mapRef.current.on('click', 'clusters', handleClusterClick);

        mapRef.current.on('click', 'unclustered-point', async (e) => {
          const feature = e.features?.at(0)
          clearPopups()
          if (!feature) return
          // @ts-expect-error
          const coordinates = feature.geometry.coordinates;
          const listingId = feature.properties?.id
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          const popup = new mapboxgl.Popup({ offset: 25, focusAfterOpen: false })
            .setLngLat(coordinates)
            .setHTML(
              `
              <div class="marker-popup rounded-lg overflow-hidden">
                <div class="marker-popup_image-container relative aspect-[3/2] bg-white">
                <div class="animate-pulse absolute inset-0 bg-brand-gray-01"></div>
                </div>
                <div class="p-6 bg-white flex flex-col gap-2">
                  <div class="animate-pulse rounded-sm w-full h-3 bg-brand-gray-01"></div>
                  <div class="animate-pulse rounded-sm w-1/2 h-2 bg-brand-gray-01"></div>
                  <div class="animate-pulse rounded-sm w-1/3 h-4 bg-brand-gray-01"></div>
                </div>
              </div>
              `,
            )
            // @ts-expect-error
            .addTo(mapRef.current);
          const listingResponse = await fetch(`/api/listings/map/${listingId}`).then((res) => res.json()) as {
            ok: boolean;
            listing: {
              id: number;
              title: string;
              featuredImage: number | MediaType;
              category?: ("commercial" | "residential") | null | undefined;
              price?: number | null | undefined;
              textAfterPrice?: string | null | undefined;
              transactionType?: ("for-sale" | "for-lease") | null | undefined;
              streetAddress: string;
              slug?: string | null | undefined;
              MLS?: {
                ListOfficeName?: string | null;
                FeaturedImageUrl?: string | null;
              } | undefined;
            } | null;
            error: string | null;
          }

          if (listingResponse.ok) {
            const listing = listingResponse.listing
            popup
              .setHTML(
                `
              <div class="marker-popup rounded-lg overflow-hidden">
                <div class="marker-popup_image-container relative aspect-[3/2] bg-white">
                <div class="animate-pulse absolute inset-0 bg-brand-gray-01"></div>
                  <img src="${listing?.featuredImage ? (listing?.featuredImage as MediaType).url : listing?.MLS?.FeaturedImageUrl || null}" alt="${listing?.featuredImage ? (listing?.featuredImage as MediaType).alt : ''}" class="marker-popup_image w-full absolute top-0 left-0 h-full object-cover" />
                </div>
                <div class="p-6 bg-white flex flex-col">
                <span class="marker-description text-2xl font-basic-sans font-bold text-brand-gray-06">${listing?.price
                  ? `${formatPrice(listing.price)}${listing?.textAfterPrice
                    ? `<span class="text-sm ml-2 font-normal">${listing?.textAfterPrice}</span>`
                    : ''
                  }`
                  : 'Contact for price'
                }</span>
                  <h3 class="marker-title font-basic-sans text-brand-gray-04 text-base font-light">${listing?.streetAddress}</h3>
                  <a href="/listings/${listing?.slug}" class="p-2 w-fit text-sm rounded-sm transition-colors hover:bg-brand-gray-00 focus-visible:bg-brand-gray-00 focus-visible:outline-none font-light flex items-center gap-1 text-brand-gray-04"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-2 h-auto fill-brand-gray-04"><!--!Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc.--><path d="M240 64l0-16-32 0 0 16 0 176L32 240l-16 0 0 32 16 0 176 0 0 176 0 16 32 0 0-16 0-176 176 0 16 0 0-32-16 0-176 0 0-176z"/></svg>Learn More</a>
                </div>
              </div>
              `,
              )
          }



          mapRef.current?.jumpTo({
            center: coordinates,
            // speed: 0.5,
          })
        });

        mapRef.current.on('mouseenter', 'clusters', () => {
          // @ts-expect-error
          mapRef.current.getCanvas().style.cursor = 'pointer';
        });

        mapRef.current.on('mouseleave', 'clusters', () => {
          // @ts-expect-error
          mapRef.current.getCanvas().style.cursor = '';
        });
        const source = mapRef.current.getSource('listings');
        if (source && mapListings.length > 0) {
          const coordinates = mapListings.map(listing => listing.coordinates);
          if (coordinates.length > 0) {
            const bounds = coordinates.reduce((b, coord) => b.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
            mapRef.current.fitBounds(bounds, { padding: 60 });
          }
        }
      }
    }
  }


  //     mapRef.current?.off('click', 'clusters', handleClusterClick);
  //     if (mapRef.current?.getSource('listings')) {
  //       mapRef.current?.removeSource('listings');
  //     }
  //   }
  // }, [activeMapListings, isFirstRender])

  // FIRST RENDER


  const handleReset = async () => {
    try {
      form.reset()
      setFilters(undefined)
      await Promise.all([
        fetchCardListings(undefined, undefined, sortData?.value, { ignoreBounds: true }),
        fetchMapListings(undefined, { ignoreBounds: true })
      ]).then((res) => updateSearchParams(res))
    } catch (error: any) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    setHeaderTheme('filled')
    setIsFirstRender(false)
    mapRef.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
      container: mapContainerRef.current,
      center: [-97.2753695, 31.5532499],
      zoom: 10,
      scrollZoom: false,
      maxZoom: 20
    })
    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left')
    mapRef.current.on('load', loadMarkerImages)
    mapRef.current?.on('dragend', updateBounds)
    // mapRef.current?.on('zoomend', updateBounds)

    // FETCH PROPERTIES ON FIRST RENDER
    const filterData = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      propertyType: searchParams.get('property_type') || '',
      minPrice: searchParams.get('min_price') || '',
      maxPrice: searchParams.get('max_price') || '',
      sizeType: searchParams.get('size_type') || '',
      minSize: searchParams.get('min_size') || '',
      maxSize: searchParams.get('max_size') || '',
      availability: searchParams.get('availability') || '',
      transactionType: (searchParams.get('transaction_type') || '') as
        | 'for-sale'
        | 'for-lease'
        | null
        | undefined,
    }
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined
    const sort = searchParams.get('sort') || undefined
    for (const [key, value] of Object.entries(filterData)) {
      if (!value) continue
      form.setValue(key as keyof z.infer<typeof FormSchema>, value)
      setFilters((current) => ({ ...current, [key]: value }))
    }
    if (page) setCurrentPage(page)
    if (sort) setSortData(sortOptions.find(({ value }) => value === sort))

    return () => {
      mapRef.current?.off('load', loadMarkerImages)
      mapRef.current?.off('dragend', updateBounds)
      mapRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!isFirstRender) {
      Promise.all([
        fetchCardListings(filters, currentPage, sortData?.value, { ignoreBounds: true }),
        fetchMapListings(filters, { ignoreBounds: false })
      ])
    }
  }, [debouncedBounds, isFirstRender])


  return (
    <div>
      <FilterBar
        handleFilter={handleFilter}
        handleReset={handleReset}
        sort={sortData?.value}
        form={form}
        isLoading={isMapLoading}
      />
      <div className="w-full border-t border-brand-gray-01 md:grid md:grid-cols-5">
        {width && width <= parseInt(defaultTheme.screens.md) && (
          <div className="flex">
            <Button
              className={`flex-1 flex gap-2 items-center text-lg font-medium tracking-normal normal-case bg-transparent hover:bg-transparent focus-visible:bg-transparent  border-0 border-b-2 ${activeTab === 'map' ? 'text-brand-navy border-b-brand-navy' : 'text-brand-gray-03 border-b-transparent'}`}
              onClick={() => setActiveTab('map')}
            >
              <FontAwesomeIcon icon={faMap} className="w-5 h-auto" /> Map
            </Button>
            <Button
              className={`flex-1 flex gap-2 items-center text-lg font-medium tracking-normal normal-case bg-transparent hover:bg-transparent focus-visible:bg-transparent border-0 border-b-2 ${activeTab === 'list' ? 'text-brand-navy border-b-brand-navy' : 'text-brand-gray-03 border-b-transparent'}`}
              onClick={() => setActiveTab('list')}
            >
              <FontAwesomeIcon icon={faList} className="w-5 h-auto" /> List
            </Button>
          </div>
        )}

        <div
          className={`col-span-3 relative md:sticky md:top-20 h-fit ${width && width <= parseInt(defaultTheme.screens.md) && activeTab !== 'map' && 'hidden'}`}
        >
          {(isFirstRender || !mapRef.current) && (
            <Skeleton className="h-[calc(100vh-5rem)]"></Skeleton>
          )}

          <div id="map" ref={mapContainerRef} className="h-[calc(100vh-5rem)]"></div>
        </div>

        <div
          className={`col-span-2 overflow-scroll bg-white ${width && width <= parseInt(defaultTheme.screens.md) && activeTab !== 'list' && 'hidden'}`}
        >
          <div className="p-6 border-b border-brand-gray-01 flex gap-6 justify-between items-center">
            <span className="text-lg font-medium text-brand-gray-03">
              {(isFirstRender || isMapLoading) && (
                <FontAwesomeIcon icon={faCircleNotch} className="animate-spin w-4 h-auto inline" />
              )}
              {!isFirstRender &&
                !isMapLoading &&
                totalListings &&

                `${totalListings} Listings`}
            </span>
            <DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
              <DropdownMenuTrigger className="text-lg text-brand-gray-03 font-medium tracking-normal flex items-center gap-2 rounded-none focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2">
                <FontAwesomeIcon icon={faArrowUpArrowDown} className="w-5 h-auto" />{' '}
                {sortData ? sortData.label : 'Sort By'}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none">
                <DropdownMenuRadioGroup
                  value={sortData?.value}
                  onValueChange={(value) => {
                    fetchCardListings(filters, currentPage || 1, value).then((res) => updateSearchParams([res]))
                  }}
                >
                  {sortOptions.map((option, index) => {
                    return (
                      <DropdownMenuRadioItem
                        key={index}
                        className="hover:bg-brand-blue rounded-none text-base font-light"
                        value={option.value}
                      >
                        {option.label}
                      </DropdownMenuRadioItem>
                    )
                  })}
                </DropdownMenuRadioGroup>
                {sortData && (
                  <Button
                    variant={'ghost'}
                    className="flex items-center gap-2 w-full"
                    onClick={() => {
                      fetchCardListings(filters, currentPage).then((res) => updateSearchParams([res]))
                      setIsSortOpen(false)
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                    Reset
                  </Button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] xl:grid-cols-2 gap-x-4 gap-y-6 p-6 content-start ">
            {(isFirstRender || isCardsLoading) &&
              Array.from(Array(4).keys()).map((_, index) => {
                return (
                  <Card key={index} className="rounded-none bg-white border-none shadow-md">
                    <div className="relative pb-[66.66%] rounded-none overflow-hidden w-full">
                      <Skeleton className="absolute w-full h-full top-0 left-0 rounded-none" />
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex justify-between gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                          <div>
                            <Skeleton className="w-full h-8" />
                          </div>

                          <Skeleton className="w-full h-6" />
                          <Skeleton className="w-full h-6" />
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}

            {activeCardListings &&
              activeCardListings.length > 0 &&
              activeCardListings.map((listing, index) => {
                return (
                  <Card
                    key={listing.id}
                    className="rounded-none bg-white border-none shadow-md transition-shadow hover:shadow-xl focus-visible:shadow-xl"
                  // onMouseEnter={() => {
                  //   setFocusedListing(listing)
                  // }}
                  // onMouseLeave={() => {
                  //   setFocusedListing(null)
                  // }}
                  // onFocus={() => {
                  //   setFocusedListing(listing)
                  // }}
                  // onBlur={() => {
                  //   setFocusedListing(null)
                  // }}
                  >
                    <Link href={`/listings/${listing.slug}`} className="h-full block">
                      <div className="relative pb-[66.66%] overflow-hidden w-full">
                        <Media
                          resource={listing.featuredImage}
                          className="absolute top-0 left-0 w-full h-full"
                          imgClassName="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between gap-4 flex-wrap">
                          <div className="flex flex-col gap-2 flex-1">
                            <h3 className="sr-only">{listing.title}</h3>
                            <div>
                              <span className="text-2xl text-brand-gray-06 font-bold font-basic-sans leading-none">
                                {typeof listing.price === 'number' && listing.price !== 0
                                  ? `${formatPrice(listing.price)}`
                                  : 'Contact for price'}
                              </span>
                              {typeof listing.price === 'number' &&
                                listing.price !== 0 &&
                                listing.textAfterPrice && (
                                  <span className="text-sm ml-2">{listing.textAfterPrice}</span>
                                )}
                            </div>

                            <span className="text-xl font-light text-brand-gray-06">
                              {listing.city}, {listing.state}
                            </span>
                            <span className="text-base font-light font-basic-sans text-brand-gray-03">
                              {listing.streetAddress}
                            </span>
                          </div>
                          <div>
                            <Button
                              className="flex justify-center items-center w-12 h-12 p-0 rounded-full border border-brand-gray-00 bg-white text-brand-gray-06 hover:bg-brand-gray-00"
                              style={{ boxShadow: '0px 3px 10px rgba(0,0,0,.1)' }}
                              onClick={(e) => {
                                e.preventDefault()
                                const mailtoLink = `mailto:info@onwardrealestateteam.org?subject=${encodeURIComponent(`Onward Real Estate Property Inquiry: ${listing.streetAddress}, ${listing.city}, ${listing.state} ${listing.zipCode}`)}&body=${encodeURIComponent(`Hello,\n\n I am interested in receiving more information about ${listing.streetAddress}, ${listing.city}, ${listing.state} ${listing.zipCode}`)}.`
                                window.location.href = mailtoLink
                              }}
                            >
                              <FontAwesomeIcon icon={faEnvelope} fontWeight={300} size="lg" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-start flex-wrap">
                          {typeof listing.bedrooms === 'number' && listing.bedrooms > 0 && (
                            <div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
                              <FontAwesomeIcon icon={faBedFront} className="w-6" />
                              <span className="text-base text-brand-gray-06 font-light">
                                {formatNumber(listing.bedrooms)}
                              </span>
                            </div>
                          )}
                          {typeof listing.bathrooms === 'number' && listing.bathrooms > 0 && (
                            <div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
                              <FontAwesomeIcon icon={faBath} className="w-6" />
                              <span className="text-base text-brand-gray-06 font-light">
                                {formatNumber(listing.bathrooms)}
                              </span>
                            </div>
                          )}
                          {typeof listing.area === 'number' && listing.area > 0 && (
                            <div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
                              <FloorPlanIcon className="w-6" />
                              <span className="text-base text-brand-gray-06 font-light">
                                {formatNumber(listing.area)} sqft
                              </span>
                            </div>
                          )}
                          {typeof listing.acreage === 'number' && listing.acreage > 0 && (
                            <div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
                              <FontAwesomeIcon icon={faFarm} className="w-6 text-brand-navy" />
                              <span className="text-base text-brand-gray-06 font-light fill-brand-navy">
                                {formatNumber(listing.acreage)} acres
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Card>
                )
              })}
            <div className="col-span-full flex justify-center gap-2 items-center">
              <Button
                className="p-2 text-brand-gray-04"
                variant="ghost"
                onClick={() => {
                  if (hasPrevPage && prevPage) {
                    fetchCardListings(filters, 1, sortData?.value).then((res) => updateSearchParams([res]))
                    window.scrollTo({ top: 0 })
                  }
                }}
              >
                <FontAwesomeIcon icon={faChevronDoubleLeft} className="w-4 h-4" />
              </Button>
              <Button
                className="p-2 text-brand-gray-04"
                variant="ghost"
                onClick={() => {
                  if (hasPrevPage && prevPage) {
                    fetchCardListings(filters, prevPage, sortData?.value).then((res) => updateSearchParams([res]))
                    window.scrollTo({ top: 0 })
                  }
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
              </Button>

              <span className="font-light leading-none text-brand-gray-04">
                {currentPage} {totalPages && `of ${totalPages}`}
              </span>

              <Button
                className="p-2 text-brand-gray-04"
                variant="ghost"
                onClick={() => {
                  if (hasNextPage && nextPage) {
                    fetchCardListings(filters, nextPage, sortData?.value).then((res) => updateSearchParams([res]))
                    window.scrollTo({ top: 0 })
                  }
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </Button>
              <Button
                className="p-2 text-brand-gray-04"
                variant="ghost"
                onClick={() => {
                  if (hasNextPage && totalPages) {
                    fetchCardListings(filters, totalPages, sortData?.value).then((res) => updateSearchParams([res]))
                    window.scrollTo({ top: 0 })
                  }
                }}
              >
                <FontAwesomeIcon icon={faChevronDoubleRight} className="w-4 h-4" />
              </Button>


            </div>

            {!isFirstRender &&
              !isCardsLoading &&
              (!activeCardListings ||
                (activeCardListings.length === 0 && (
                  <div className="p-5 text-center flex flex-col gap-4">
                    <span>No listings found</span>
                    <Button
                      onClick={() => {
                        handleReset()
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )))}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapMarkerIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="48" viewBox="0 0 37 48" fill="none" style="width: 100%">
        <path d="M18.1622 48C18.1622 48 36.3243 28.5 36.3243 18C36.3243 8.0625 28.1892 0 18.1622 0C8.13514 0 0 8.0625 0 18C0 28.5 18.1622 48 18.1622 48ZM18.1622 12C19.7678 12 21.3077 12.6321 22.443 13.7574C23.5784 14.8826 24.2162 16.4087 24.2162 18C24.2162 19.5913 23.5784 21.1174 22.443 22.2426C21.3077 23.3679 19.7678 24 18.1622 24C16.5565 24 15.0167 23.3679 13.8813 22.2426C12.7459 21.1174 12.1081 19.5913 12.1081 18C12.1081 16.4087 12.7459 14.8826 13.8813 13.7574C15.0167 12.6321 16.5565 12 18.1622 12Z" fill="#0B2A35" />
      </svg>`

export const FloorPlanIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={props.className}
      {...props}
    >
      <rect opacity="0.4" x="2" y="2" width="16" height="16" fill="#0B2A35" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2H18V7V7.5V18H15.5V17.5H17.5V7.5H12V7H17.5V2.5H7V7H6.5V2.5H2.5V13H12V13.5H2.5V17.5H12V18H2V13.5V13V2H6.5H7Z"
        fill="#0B2A35"
      />
    </svg>
  )
}
