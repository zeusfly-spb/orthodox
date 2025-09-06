export interface Partner {
  id: number | string;
  name: string;
  type: string;
  email: string;
  phone: string;
  description: string;
  json_attributes: string[];
  is_active: boolean;
  requisite: string[];
  accounts: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
