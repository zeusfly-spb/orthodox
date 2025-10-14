import type { Service } from './service';

export interface TourDayImage {
  id: number;
  title: string | null;
  description: string | null;
  filename: string;
  original_name: string;
  mime_type: string;
  path: string;
  disk: string;
  size: number;
  width: number;
  height: number;
  imageable_type: string;
  imageable_id: number;
  gallery: string;
  sort_order: number;
  is_featured: boolean;
  metadata: {
    exif: any[];
  };
  created_at: string;
  updated_at: string;
}

export interface DayItem {
  title: string;
  description: string;
  photos?: string[];
  images?: TourDayImage[];
}

export interface TourNote {
  title: string;
  content: string;
}

export interface TourPoint {
  id: string | number;
  title?: string | null;
  description?: string | null;
  address?: string | null;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  time: string;
  order_column: number;
  entity?: {
    id: number;
    title?: string;
    description?: string | null;
    location?: {
      type: string;
      coordinates: [number, number];
    };
  };
}

export interface Tour {
  id: number | string;
  title: string;
  route: string;
  price: number;
  duration: number;
  seats: number;
  customers_count: number;
  description: string;
  notes: TourNote[];
  is_active: boolean;
  date: string;
  date_end: string;
  days: DayItem[];
  services: Service[];
  entities: any[];
  points?: TourPoint[];
  ownerable_id: number;
  ownerable_type: string;
  created_at: string;
  updated_at: string;
  time: string;
  comfort: number | null;
  difficulty: number | null;
  countries: any[];
  cities: any[];
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
  parameters?: any;
  bookings?: any[];
}
