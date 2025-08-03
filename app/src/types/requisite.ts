export interface Requisite {
  id?: number
  title: string
  type: string | null
  description: string | null
  legal_name: string
  opf_short: string | null
  inn: string
  ogrn: string
  ogrn_date: string | null
  kpp: string
  okpo: string
  legal_address: string
  real_address: string
  postal_address: string | null
  email: string | null
  phone: string | null
}
