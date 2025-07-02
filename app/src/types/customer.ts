export interface Customer {
  id: number | string
  name: string
  firstname: string
  lastname: string
  patronymic?: string
  email: string
  phone: string
  ownerable_id?: number
  ownerable_type?: string
  created_at: string
  updated_at: string
}
