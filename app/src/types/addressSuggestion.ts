export interface AddressSuggestion {
  value: string
  latitude: string
  longitude: string
  postal_code: string
  country: string
  region: string
  region_with_type: string
  city: string
  city_with_type: string
  street: string
  street_with_type: string
  house: string
  house_type: string
  flat: string | null
  flat_type: string | null
}
