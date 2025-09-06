export interface Entity {
  id: number | string;
  title: string;
  description: string;
  email: string;
  phone: string;
  json_attributes: string[];
  seats?: number;
  created_at: string;
  updated_at: string;
}
