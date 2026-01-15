import { MapFilters } from '@/app/(frontend)/api/listings/types'

export const sanitizeFilterData = (data: MapFilters | undefined) => {
  if (!data) {
    return {}
  }
  const sanitized: MapFilters = {}

  // Sanitize search - undefined or plain text
  if (data.search) {
    sanitized.search = String(data.search).trim() || undefined
  }

  // Sanitize category - undefined, 'all', 'commercial', or 'residential'
  if (data.category) {
    const category = data.category.toLowerCase()
    if (['all', 'commercial', 'residential'].includes(category)) {
      // @ts-ignore
      sanitized.category = category === 'all' ? undefined : category
    }
  }

  // Sanitize transactionType - undefined, 'for-sale', or 'for-lease'
  if (data.transactionType) {
    const transactionType = data.transactionType.toLowerCase()
    if (['all', 'for-sale', 'for-lease'].includes(transactionType)) {
      sanitized.transactionType =
        transactionType === 'all' ? undefined : (transactionType as 'for-sale' | 'for-lease')
    }
  }

  // Sanitize minPrice and maxPrice - undefined or number
  if (data.minPrice) {
    const num = Number(data.minPrice)
    if (!isNaN(num)) {
      sanitized.minPrice = String(num)
    }
  }
  if (data.maxPrice) {
    const num = Number(data.maxPrice)
    if (!isNaN(num)) {
      sanitized.maxPrice = String(num)
    }
  }

  // Sanitize sizeType - undefined, 'sqft', or 'acres'
  if (data.sizeType) {
    const sizeType = data.sizeType.toLowerCase()
    if (['sqft', 'acres'].includes(sizeType)) {
      // @ts-ignore
      sanitized.sizeType = sizeType
    }
  }

  // Sanitize minSize and maxSize - undefined or number
  if (data.minSize) {
    const num = Number(data.minSize)
    if (!isNaN(num)) {
      sanitized.minSize = String(num)
    }
  }
  if (data.maxSize) {
    const num = Number(data.maxSize)
    if (!isNaN(num)) {
      sanitized.maxSize = String(num)
    }
  }

  // Sanitize propertyType - undefined or string
  if (data.propertyType) {
    const num = Number(data.propertyType)
    if (!isNaN(num)) {
      sanitized.propertyType = String(num)
    }
  }

  return sanitized
}
