import type { Service } from './service';
export interface Tour {
  id: number | string;
  title: string;
  route: string;
  price: number;
  duration: number;
  seats: number;
  customers_count: number;
  description: string;
  is_active: boolean;
  dates: string[];
  days: string[];
  services: Service[];
  ownerable_id: number;
  ownerable_type: string;
  created_at: string;
  updated_at: string;
  tourStatus?: {
    id: number;
    slug: string;
    title: string;
  };
  tourType?: {
    id: number;
    slug: string;
    title: string;
  };
  tourCategory?: {
    id: number;
    slug: string;
    title: string;
  };
  tourTransport?: {
    id: number;
    slug: string;
    title: string;
  };
}
