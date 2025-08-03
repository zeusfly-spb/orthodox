export interface Customer {
  id?: number | string
  firstname: string
  lastname: string
  patronymic?: string | null
  email?: string
  phone?: string
  passport_series?: string | null
  passport_number?: string | null
  passport_issue_date?: string | null
  passport_unit_name?: string | null
  passport_unit_code?: string | null
  passport_birth_date?: string | null
  passport_birth_place?: string | null
  passport_address?: string | null
  gender?: string | null
  snils?: string | null
  created_at?: string
  updated_at?: string
}
