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
  status?: string[] | null | undefined
}
