import { Customer } from '@/types/customer'
import { Tour } from '@/types/tour'

export interface Booking {
  id: number | string
  description: string
  status: string
  participants_count: number
  tour: Tour
  customer: Customer
  ownerable_id?: number
  ownerable_type?: string
  created_at: string
  updated_at: string
}
