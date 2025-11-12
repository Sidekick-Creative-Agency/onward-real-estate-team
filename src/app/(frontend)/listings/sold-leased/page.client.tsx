'use client'
import { Listing, Media as MediaType } from '@/payload-types'
import { useEffect, useRef, useState } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useWindowDimensions from '@/utilities/useWindowDimensions'
import { faXmark } from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import { PaginatedDocs } from 'payload'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface SoldLeasedPageClientProps {
  listings?: PaginatedDocs<Listing>
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

interface Filters {
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


export const PageClient: React.FC<SoldLeasedPageClientProps> = ({ listings }) => {


  const searchParams = useSearchParams()
  const { width } = useWindowDimensions()
  const [activeCardListings, setActiveCardListings] = useState<Listing[] | undefined>(listings?.docs)

  const [totalListings, setTotalListings] = useState<number | undefined>(listings?.totalDocs)
  const [isCardsLoading, setIsCardsLoading] = useState(false)
  const [filters, setFilters] = useState<Filters | undefined>(undefined)
  const [hasNextPage, setHasNextPage] = useState<boolean | null | undefined>(listings?.hasNextPage)
  const [hasPrevPage, setHasPrevPage] = useState<boolean | null | undefined>(listings?.hasPrevPage)
  const [currentPage, setCurrentPage] = useState<number | null | undefined>(searchParams.get('page') ? Number(searchParams.get('page')) : listings?.page)
  const [totalPages, setTotalPages] = useState<number | null | undefined>(listings?.totalPages)
  const [nextPage, setNextPage] = useState<number | null | undefined>(listings?.nextPage)
  const [prevPage, setPrevPage] = useState<number | null | undefined>(listings?.prevPage)
  const [isSortOpen, setIsSortOpen] = useState(false)
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
      minPrice: '',
      maxPrice: '',
      minSize: '',
      maxSize: '',
      sizeType: '',
      availability: '',
      transactionType: '',
    }
  })


  const handleFilter = (filters: Filters, page: number | undefined, sort?: string | null, options?: { ignoreBounds: boolean }) => {
    setFilters(filters)
    Promise.all([
      fetchCardListings(filters, page, sort),
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
    filterData?: Filters,
    page?: number | null,
    sort?: string | null,
  ) => {
    setActiveCardListings([])
    setIsCardsLoading(true)
    const querySearchParams = new URLSearchParams()

    querySearchParams.set('filters', JSON.stringify({ ...filterData, availability: 'sold', status: ['published', 'draft'] }))

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
    setTotalListings(response.listings?.totalDocs)
    return newSearchParams.toString()
  }

  const handleReset = async () => {
    try {
      form.reset()
      setFilters(undefined)
      await Promise.all([
        fetchCardListings(undefined, undefined, sortData?.value),
      ]).then((res) => updateSearchParams(res))
    } catch (error: any) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    setHeaderTheme('filled')
    setIsFirstRender(false)
    // FETCH PROPERTIES ON FIRST RENDER
    const filterData = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      propertyType: searchParams.get('property_type') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sizeType: searchParams.get('sizeType') || '',
      minSize: searchParams.get('minSize') || '',
      maxSize: searchParams.get('maxSize') || '',
      availability: searchParams.get('availability') || '',
      transactionType: (searchParams.get('transactionType') || '') as
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

  }, [])


  return (
    <div className='pb-20'>
      <FilterBar
        handleFilter={handleFilter}
        handleReset={handleReset}
        sort={sortData?.value}
        form={form}
        isLoading={isCardsLoading}
      />
      <div className="w-full border-t border-brand-gray-01">

        <div
          className={`overflow-scroll bg-white`}
        >
          <div className="p-6 border-b border-brand-gray-01 flex gap-6 justify-between items-center">
            <span className="text-lg font-medium text-brand-gray-03">
              {(isFirstRender) && (
                <FontAwesomeIcon icon={faCircleNotch} className="animate-spin w-4 h-auto inline" />
              )}
              {!isFirstRender &&
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]  gap-x-4 gap-y-6 p-6 content-start ">
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
            {totalListings !== 0 && !isFirstRender && (
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
            )}

            {!isFirstRender &&
              !isCardsLoading &&
              (!activeCardListings ||
                activeCardListings.length === 0) && (
                <div className="p-5 text-center flex flex-col items-center gap-4 col-span-full">
                  <span>No listings found</span>
                  <Button
                    onClick={() => {
                      handleReset()
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}



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
