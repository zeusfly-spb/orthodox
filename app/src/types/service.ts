
export interface Service {
  id?: number | string;
  title: string;
  description: string;
  is_active: boolean;
  price: number;
  type?: string;
  entity_id?: number | string;
}
