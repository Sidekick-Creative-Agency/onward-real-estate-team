export type RETSSearchResponse = {
  RETS: {
    DELIMITER: string
    COLUMNS: string
    DATA: string[]
  }
}
export type RETSListing = {
  ListingKeyNumeric: number | undefined
  ListingId: number | undefined
  City: string | undefined
  Latitude: number | undefined
  ListAgentFullName: string | undefined
  ListAgentKeyNumeric: number | undefined
  ListOfficeKeyNumeric: number | undefined
  ListOfficeName: string | undefined
  ListPrice: number | undefined
  LivingArea: number | undefined
  Longitude: number | undefined
  ModificationTimestamp: string | undefined
  PhotosChangeTimestamp: string | undefined
  PhotosCount: number | undefined
  PostalCode: string | undefined
  PropertySubType: string | undefined
  PropertyType: string | undefined
  PublicRemarks: string | undefined
  StateOrProvince: string | undefined
  StreetName: string | undefined
  StreetNumber: string | undefined
  StreetSuffix: string | undefined
  LotSizeAcres: number | undefined
  LotSizeArea: number | undefined
  LotSizeSquareFeet: number | undefined
  LotSizeUnits: string | undefined
  BedroomsTotal: number | undefined
  BathroomsTotalInteger: number | undefined
}
export type RETSObjectResponse = {
  RETS: string
}

export type RETSListingStatus = {
  MlsStatus: string | undefined
}
