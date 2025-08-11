import type { User } from '@/types/user'
export interface OperatorProfile {
  id: number | string
  name: string
  type: string
  email: string
  phone: string
  description: string
  json_attributes: string[]
  is_active: boolean
  requisite: string[]
  accounts: string[]
  location: string[]
  managers: User[]
  created_at: string
  updated_at: string
  deleted_at: string
}
