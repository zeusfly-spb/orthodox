import type { Entity } from './entity';
export interface Service {
  id?: number | string;
  title: string;
  description: string;
  is_active: boolean;
  entity?: Entity;
  price: number;
  type?: string;
  entity_id?: number | string;
}
