import type { Service } from './service';

export interface DayItem {
  title: string;
  description: string;
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

export interface CalculationExpense {
  id?: string;
  expenseType: string;
  serviceName: string;
  serviceDetails: string;
  tourDays: string;
  quantity: number;
  payers: number;
  totalAmount: number;
  perPersonAmount: number;
}

export interface TourCalculations {
  limit: number;
  daysCount: number;
  expenses: CalculationExpense[];
  costPerPayer: number;
  markup: number;
  markupAmount: number;
  markupInRub: number;
  totalWithMarkup: number;
  vatRate: number;
  vatType: string;
  vatAmount: number;
  totalWithVat: number;
  pricePerPayer: number;
  totalCost: number;
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
  calculations?: TourCalculations;
  parameters: {
    tourStatus: number | null | string;
  };
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
