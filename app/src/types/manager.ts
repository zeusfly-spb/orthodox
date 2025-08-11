export interface fetchManagers {
  id: number
  email: string
  name: string
  full_name: string | null
  phone: string | null
  roles: Array<{
    name: string
    guard_name: string
  }>
}