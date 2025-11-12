'use client'
import React, { useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormControl, Form, FormField, FormItem, FormLabel } from '../ui/form'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBarsFilter,
  faChevronDown,
  faCircleNotch,
  faMagnifyingGlass,
  faChevronUp,
} from '@awesome.me/kit-a7a0dd333d/icons/sharp/regular'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { formatNumber } from '@/utilities/formatNumber'
import { usePayloadAPI } from '@payloadcms/ui'
import { formatPrice } from '@/utilities/formatPrice'
// import { useSearchParams } from 'next/navigation'
import { FormSchema, MapFilters } from '@/app/(frontend)/listings/map/page.client'
import useWindowDimensions from '@/utilities/useWindowDimensions'
import defaultTheme from 'tailwindcss/defaultTheme'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Label } from '../ui/label'
import { faXmark } from '@awesome.me/kit-a7a0dd333d/icons/sharp/light'
import { useSearchParams } from 'next/navigation'

interface FilterBarProps {
  handleFilter: (filters: MapFilters, page: number | undefined, sort?: string | null, options?: { ignoreBounds: boolean }) => void
  handleReset: () => Promise<void>
  sort: string | undefined
  form: UseFormReturn<z.infer<typeof FormSchema>>
  isLoading: boolean
}

export const FilterBar: React.FC<FilterBarProps> = ({
  handleFilter,
  handleReset,
  sort,
  form,
  isLoading,
}) => {
  // const searchParams = useSearchParams()
  const [sizeText, setSizeText] = useState('Size')
  const [priceText, setPriceText] = useState('Price')
  const [needsRefresh, setNeedsRefresh] = useState(true)
  const [propertyTypes, setPropertyTypes] = useState<{ value: string; label: string }[]>([])
  const { width } = useWindowDimensions()
  const formRef = useRef<HTMLFormElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const minPrice = form.watch('minPrice')
  const maxPrice = form.watch('maxPrice')
  const minSize = form.watch('minSize')
  const maxSize = form.watch('maxSize')
  const sizeType = form.watch('sizeType')
  const propertyTypesResponse = usePayloadAPI(
    `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/property-types`,
  )
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setNeedsRefresh(false)
    const filterData = {
      search: data.search,
      category: data.category,
      propertyType: data.propertyType,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      minSize: data.minSize,
      maxSize: data.maxSize,
      sizeType: data.sizeType,
      availability: data.availability,
      transactionType: data.transactionType as 'for-sale' | 'for-lease' | null | undefined,
    }
    handleFilter(filterData, 1, sort, { ignoreBounds: true })

    setIsOpen(false)
  }

  const handleSizeChange = (
    min: string | number | undefined,
    max: string | number | undefined,
    type: string | undefined,
  ) => {
    if ((min || max) && !type) {
      form.setValue('sizeType', 'sqft')
    }
    if (min && max) {
      setSizeText(`${formatNumber(Number(min))} - ${formatNumber(Number(max))} ${type}`)
    } else if (min) {
      setSizeText(`From ${formatNumber(Number(min))} ${type}`)
    } else if (max) {
      setSizeText(`Up to ${formatNumber(Number(max))} ${type}`)
    } else {
      setSizeText('Size')
    }
  }

  const handlePriceChange = (
    min: string | number | undefined,
    max: string | number | undefined,
  ) => {
    if (min && max) {
      setPriceText(`${formatPrice(Number(min))} - ${formatPrice(Number(max))}`)
    } else if (min) {
      setPriceText(`From ${formatPrice(Number(min))}`)
    } else if (max) {
      setPriceText(`Up to ${formatPrice(Number(max))}`)
    } else {
      setPriceText('Price')
    }
  }

  useEffect(() => {
    if (propertyTypesResponse[0].data && propertyTypesResponse[0].data.docs) {
      setPropertyTypes(
        propertyTypesResponse[0].data.docs.map((propertyType) => {
          return { value: String(propertyType.id), label: propertyType.title }
        }),
      )
    }
  }, [propertyTypesResponse])

  useEffect(() => {

    handleSizeChange(minSize, maxSize, sizeType)


    handlePriceChange(minPrice, maxPrice)

  }, [minSize, maxSize, sizeType, minPrice, maxPrice])


  return (
    <Form {...form}>
      <form
        className="w-full py-8 px-5 md:p-10 bg-white flex gap-2 relative"
        onSubmit={form.handleSubmit(onSubmit)}
        ref={formRef}
      >
        {width && width <= parseInt(defaultTheme.screens.md) && (
          <>
            <FormField
              control={form.control}
              name="search"
              defaultValue={''}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Search by Address, City, Zipcode..."
                        {...field}
                        className="h-full text-lg font-light text-brand-navy"
                      />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant={'link'}
                  className="flex items-center gap-2 text-brand-gray-03 font-medium bg-transparent p-2 hover:no-underline focus-visible:no-underline normal-case tracking-normal"
                >
                  Filters <FontAwesomeIcon icon={faBarsFilter} className="" />
                </Button>
              </SheetTrigger>
              <SheetContent className="max-h-screen overflow-scroll">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <Accordion type="multiple">
                  <AccordionItem value="category">
                    <AccordionTrigger
                      className="text-lg text-brand-navy hover:no-underline focus-visible:no-underline"
                      iconClassName="text-brand-navy"
                      closedIcon={faChevronDown}
                      openIcon={faChevronUp}
                    >
                      Category
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                      <FormField
                        control={form.control}
                        name="category"
                        // defaultValue={searchParams.get('category') || ''}
                        render={({ field }) => {
                          return (
                            <FormItem className="w-full">
                              <RadioGroup onValueChange={field.onChange}>
                                <div className="flex items-center gap-x-2 text-brand-gray-06">
                                  <RadioGroupItem value="all" id="category_r0" />
                                  <Label htmlFor="category_r0">All</Label>
                                </div>
                                <div className="flex items-center gap-x-2 text-brand-gray-06">
                                  <RadioGroupItem value="commercial" id="category_r1" />
                                  <Label htmlFor="category_r1">Commercial</Label>
                                </div>
                                <div className="flex items-center gap-x-2 text-brand-gray-06">
                                  <RadioGroupItem value="residential" id="category_r2" />
                                  <Label htmlFor="category_r2">Residential</Label>
                                </div>
                              </RadioGroup>
                            </FormItem>
                          )
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="transactionType">
                    <AccordionTrigger
                      className="text-lg text-brand-navy hover:no-underline focus-visible:no-underline"
                      iconClassName="text-brand-navy"
                      closedIcon={faChevronDown}
                      openIcon={faChevronUp}
                    >
                      Transaction Type
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                      <FormField
                        control={form.control}
                        name="transactionType"
                        // defaultValue={searchParams.get('transaction_type') || ''}
                        render={({ field }) => {
                          return (
                            <FormItem className="w-full">
                              <RadioGroup onValueChange={field.onChange}>
                                <div className="flex items-center gap-x-2 text-brand-gray-06">
                                  <RadioGroupItem value="all" id="transaction_type_r0" />
                                  <Label htmlFor="transaction_type_r0">All</Label>
                                </div>
                                <div className="flex items-center gap-x-2 text-brand-gray-06">
                                  <RadioGroupItem value="for-sale" id="transaction_type_r1" />
                                  <Label htmlFor="transaction_type_r1">For Sale</Label>
                                </div>
                                <div className="flex items-center gap-x-2 text-brand-gray-06">
                                  <RadioGroupItem value="for-lease" id="transaction_type_r2" />
                                  <Label htmlFor="transaction_type_r2">For Lease</Label>
                                </div>
                              </RadioGroup>
                            </FormItem>
                          )
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="price">
                    <AccordionTrigger
                      className="text-lg text-brand-navy hover:no-underline focus-visible:no-underline"
                      iconClassName="text-brand-navy"
                      closedIcon={faChevronDown}
                      openIcon={faChevronUp}
                    >
                      Price
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                      <div className="flex flex-col gap-4">
                        <FormField
                          control={form.control}
                          name="minPrice"
                          // defaultValue={searchParams.get('min_price') || ''}
                          render={({ field }) => {
                            return (
                              <FormItem className="w-full">
                                <FormLabel>Min</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Min price"
                                    {...field}
                                    className="h-full text-lg font-light text-brand-navy"
                                    onChange={(event) => {
                                      field.onChange(event)
                                      handlePriceChange(
                                        form.getValues().minPrice,
                                        form.getValues().maxPrice,
                                      )
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )
                          }}
                        />
                        <FormField
                          control={form.control}
                          name="maxPrice"
                          // defaultValue={searchParams.get('max_price') || ''}
                          render={({ field }) => {
                            return (
                              <FormItem className="w-full">
                                <FormLabel>Max</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Max price"
                                    {...field}
                                    className="h-full text-lg font-light text-brand-navy"
                                    onChange={(event) => {
                                      field.onChange(event)
                                      handlePriceChange(
                                        form.getValues().minPrice,
                                        form.getValues().maxPrice,
                                      )
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )
                          }}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="size">
                    <AccordionTrigger
                      className="text-lg text-brand-navy hover:no-underline focus-visible:no-underline"
                      iconClassName="text-brand-navy"
                      closedIcon={faChevronDown}
                      openIcon={faChevronUp}
                    >
                      Size
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                      <div className="flex flex-col gap-4">
                        <FormField
                          control={form.control}
                          name="sizeType"
                          // defaultValue={searchParams.get('size_type') || ''}
                          render={({ field }) => {
                            return (
                              <FormItem className="space-y-2">
                                <FormLabel>Size Type</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={(value) => {
                                      handleSizeChange(
                                        form.getValues().minSize,
                                        form.getValues().maxSize,
                                        value,
                                      )
                                      field.onChange(value)
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center gap-2">
                                      <FormControl>
                                        <RadioGroupItem value="sqft" />
                                      </FormControl>
                                      <FormLabel className="font-normal">Sqft</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center gap-2">
                                      <FormControl>
                                        <RadioGroupItem value="acres" />
                                      </FormControl>
                                      <FormLabel className="font-normal">Acres</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                              </FormItem>
                            )
                          }}
                        />
                        <FormField
                          control={form.control}
                          name="minSize"
                          // defaultValue={searchParams.get('min_size') || ''}
                          render={({ field }) => {
                            return (
                              <FormItem className="w-full">
                                <FormLabel>Min</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Min size"
                                    {...field}
                                    className="h-full text-lg font-light text-brand-navy"
                                    onKeyUp={() => {
                                      handleSizeChange(
                                        form.getValues().minSize,
                                        form.getValues().maxSize,
                                        form.getValues().sizeType,
                                      )
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )
                          }}
                        />
                        <FormField
                          control={form.control}
                          name="maxSize"
                          // defaultValue={searchParams.get('max_size') || ''}
                          render={({ field }) => {
                            return (
                              <FormItem className="w-full">
                                <FormLabel>Max</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Max size"
                                    {...field}
                                    className="h-full text-lg font-light text-brand-navy"
                                    onKeyUp={() => {
                                      handleSizeChange(
                                        form.getValues().minSize,
                                        form.getValues().maxSize,
                                        form.getValues().sizeType,
                                      )
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )
                          }}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="propertyType">
                    <AccordionTrigger
                      className="text-lg text-brand-navy hover:no-underline focus-visible:no-underline"
                      iconClassName="text-brand-navy"
                      closedIcon={faChevronDown}
                      openIcon={faChevronUp}
                    >
                      Property Type
                    </AccordionTrigger>
                    <AccordionContent className="px-2">
                      <FormField
                        control={form.control}
                        name="propertyType"
                        // defaultValue={
                        //   propertyTypes
                        //     ? propertyTypes.find(
                        //       (type) => type.value === searchParams.get('property_type') || '',
                        //     )?.value
                        //     : ''
                        // }
                        render={({ field }) => {
                          return (
                            <FormItem className="w-full">
                              <RadioGroup onValueChange={field.onChange}>
                                <div className="flex items-center gap-x-2 text-brand-gray-06">
                                  <RadioGroupItem value="all" id="property_type_r0" />
                                  <Label htmlFor="property_type_r0">All</Label>
                                </div>
                                {propertyTypes &&
                                  propertyTypes.map((propertyType, index) => {
                                    return (
                                      <div
                                        key={propertyType.value}
                                        className="flex items-center gap-x-2 text-brand-gray-06"
                                      >
                                        <RadioGroupItem
                                          value={String(propertyType.value)}
                                          id={`property_type_r${index + 1}`}
                                        />
                                        <Label htmlFor={`property_type_r${index + 1}`}>
                                          {propertyType.label}
                                        </Label>
                                      </div>
                                    )
                                  })}
                              </RadioGroup>
                            </FormItem>
                          )
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Button
                  type="submit"
                  className="flex items-center gap-4 w-full mt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.preventDefault()
                    if (formRef.current) {
                      formRef.current.requestSubmit()
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={!isLoading ? faMagnifyingGlass : faCircleNotch}
                    fontSize={16}
                    className={`w-4 ${isLoading && 'animate-spin'}`}
                  />{' '}
                  <span>Search</span>
                </Button>
              </SheetContent>
            </Sheet>
          </>
        )}
        {width && width > parseInt(defaultTheme.screens.md) && (
          <>
            <FormField
              control={form.control}
              name="search"
              // defaultValue={searchParams.get('search') || ''}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Search by Address, City, Zipcode..."
                        {...field}
                        className="h-full text-lg font-light text-brand-navy"
                      />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="category"
              // defaultValue={searchParams.get('category') || ''}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-full text-lg font-light text-brand-navy w-full rounded-none">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-brand-navy rounded-none">
                        <SelectItem
                          value="all"
                          className="hover:bg-brand-blue rounded-none text-base font-light"
                        >
                          All
                        </SelectItem>
                        <SelectItem
                          value="commercial"
                          className="hover:bg-brand-blue rounded-none text-base font-light"
                        >
                          Commercial
                        </SelectItem>
                        <SelectItem
                          value="residential"
                          className="hover:bg-brand-blue rounded-none text-base font-light"
                        >
                          Residential
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="transactionType"
              // defaultValue={searchParams.get('transaction_type') || ''}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-full text-lg font-light text-brand-navy w-full rounded-none text-left">
                          <SelectValue placeholder="Transaction Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-brand-navy rounded-none">
                        <SelectItem
                          value="all"
                          className="hover:bg-brand-blue rounded-none text-base font-light"
                        >
                          All
                        </SelectItem>
                        <SelectItem
                          value="for-sale"
                          className="hover:bg-brand-blue rounded-none text-base font-light"
                        >
                          For Sale
                        </SelectItem>
                        <SelectItem
                          value="for-lease"
                          className="hover:bg-brand-blue rounded-none text-base font-light"
                        >
                          For Lease
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )
              }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full border border-input flex justify-between items-center py-2 px-3 rounded-none focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2">
                <span className="text-lg font-light text-brand-navy">{priceText}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-sm text-brand-gray-03 w-3.5"
                  fontSize={14}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 rounded-none" tabIndex={0}>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="minPrice"
                    // defaultValue={searchParams.get('min_price') || ''}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormLabel>Min</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Min price"
                              {...field}
                              className="h-full text-lg font-light text-brand-navy"
                              onChange={(event) => {
                                field.onChange(event)
                                handlePriceChange(
                                  event.currentTarget.value,
                                  form.getValues().maxPrice,
                                )
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="maxPrice"
                    // defaultValue={searchParams.get('max_price') || ''}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormLabel>Max</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Max price"
                              {...field}
                              className="h-full text-lg font-light text-brand-navy"
                              onChange={(event) => {
                                field.onChange(event)
                                handlePriceChange(
                                  form.getValues().minPrice,
                                  event.currentTarget.value,
                                )
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                </div>
                {((form.getValues().minPrice && form.getValues().minPrice !== '') ||
                  (form.getValues().maxPrice && form.getValues().maxPrice !== '')) && (
                    <Button
                      className="w-full flex gap-2 mt-4"
                      onClick={() => {
                        form.setValue('minPrice', '')
                        form.setValue('maxPrice', '')
                        handlePriceChange(form.getValues().minPrice, form.getValues().maxPrice)
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                      Reset
                    </Button>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="w-full border border-input flex justify-between items-center py-2 px-3 rounded-none focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2">
                <span className="text-lg font-light text-brand-navy">{sizeText}</span>

                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-sm text-brand-gray-03 w-3.5"
                  fontSize={14}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 rounded-none">
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="sizeType"
                    // defaultValue={searchParams.get('size_type') || ''}
                    render={({ field }) => {
                      return (
                        <FormItem className="space-y-2">
                          <FormLabel>Size Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                handleSizeChange(
                                  form.getValues().minSize,
                                  form.getValues().maxSize,
                                  value,
                                )
                                field.onChange(value)
                              }}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="sqft" checked={field.value === 'sqft'} />
                                </FormControl>
                                <FormLabel className="text-base font-light">Sqft</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="acres" checked={field.value === 'acres'} />
                                </FormControl>
                                <FormLabel className="text-base font-light">Acres</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="minSize"
                    // defaultValue={searchParams.get('min_size') || ''}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormLabel>Min</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Min size"
                              {...field}
                              className="h-full text-lg font-light text-brand-navy"
                              onKeyUp={() => {
                                handleSizeChange(
                                  form.getValues().minSize,
                                  form.getValues().maxSize,
                                  form.getValues().sizeType,
                                )
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="maxSize"
                    // defaultValue={searchParams.get('max_size') || ''}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full">
                          <FormLabel>Max</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Max size"
                              {...field}
                              className="h-full text-lg font-light text-brand-navy"
                              onKeyUp={() => {
                                handleSizeChange(
                                  form.getValues().minSize,
                                  form.getValues().maxSize,
                                  form.getValues().sizeType,
                                )
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                </div>
                {((form.getValues().sizeType && form.getValues().sizeType !== 'all') ||
                  form.getValues().minSize ||
                  form.getValues().maxSize) && (
                    <Button
                      className="w-full mt-4 flex gap-2"
                      onClick={() => {
                        form.resetField('sizeType')
                        form.setValue('minSize', '')
                        form.setValue('maxSize', '')
                        handleSizeChange(form.getValues().minSize, form.getValues().maxSize, '')
                      }}
                    >
                      <FontAwesomeIcon icon={faXmark} /> Reset
                    </Button>
                  )}
              </DropdownMenuContent>
            </DropdownMenu>
            <FormField
              control={form.control}
              name="propertyType"
              // defaultValue={searchParams.get('property_type') || ''}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue('propertyType', value)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-full text-lg font-light text-brand-navy w-full rounded-none">
                          <SelectValue placeholder="Property Type">
                            {
                              propertyTypes.find((type) => type.value.toString() === field.value)
                                ?.label
                            }
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white text-brand-navy rounded-none">
                        <SelectItem
                          value="all"
                          className="hover:bg-brand-blue rounded-none text-base font-light"
                        >
                          All
                        </SelectItem>
                        {propertyTypes &&
                          propertyTypes.length > 0 &&
                          propertyTypes.map((type, index) => (
                            <SelectItem
                              key={index}
                              value={type.value}
                              className="hover:bg-brand-blue rounded-none text-base font-light"
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )
              }}
            />
            <Button
              type="submit"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2"
              disabled={isLoading}
            >
              <FontAwesomeIcon
                icon={!isLoading ? faMagnifyingGlass : faCircleNotch}
                fontSize={16}
                className={`w-4 ${isLoading && 'animate-spin'}`}
              />{' '}
              <span className="hidden lg:inline">Search</span>
            </Button>
          </>
        )}
        {(form.getValues().availability ||
          form.getValues().category ||
          form.getValues().maxPrice ||
          form.getValues().maxSize ||
          form.getValues().minPrice ||
          form.getValues().minSize ||
          form.getValues().propertyType ||
          form.getValues().search ||
          form.getValues().sizeType ||
          form.getValues().transactionType) && (
            <Button
              variant={'link'}
              className="absolute bottom-2 right-10  flex gap-1 items-center text-sm normal-case tracking-normal leading-none p-1 hover:no-underline focus-visible:no-underline"
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handleReset()
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
              Clear Filters
            </Button>
          )}
      </form>
    </Form>
  )
}
