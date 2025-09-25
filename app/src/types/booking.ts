
import type { Tour } from '@/types/tour';
export interface Customer {
  id?: number | string;
  firstname: string;
  lastname: string;
  patronymic?: string | null;
  email?: string;
  phone?: string;
  payment_status: string;
  passport_series?: string | null;
  passport_number?: string | null;
  passport_issue_date?: string | null;
  passport_unit_name?: string | null;
  passport_unit_code?: string | null;
  passport_birth_date?: string | null;
  passport_birth_place?: string | null;
  passport_address?: string | null;
  gender?: string | null;
  snils?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: number | string;
  description: string;
  status: string;
  participants_count: number;
  tour: Tour;
  customer: Customer;
  ownerable_id?: number;
  ownerable_type?: string;
  created_at: string;
  updated_at: string;
}

export interface Tourist {
  id?: number | string;
  firstname: string;
  lastname: string;
  patronymic: string;
  email: string;
  phone: string;
  payment_status?: string;
}

export interface ContactPerson {
  id?: number | string;
  fullname: string;
  email: string;
  phone: string;
  comment: string;
}

export interface PaymentInfo {
  type: 'full' | 'partial';
  amount: number;
  full_payment_date?: string;
}

export interface BookingCounts {
  nights: number;
  freePlaces: number;
  people: number;
}

export interface BookingDates {
  start: string;
  finish: string;
}

export interface BookingState {
  id: number | string;
  title: string;
  tourId: number | string;
  manager: string;
  status: string;
  counts: BookingCounts;
  dates: BookingDates;
  customer: Customer;
  contactPersons: ContactPerson[];
  client: CustomerFromEditPage;
  tourists: Tourist[];
  payment: PaymentInfo;
  mainInfo: {
    tourPrice: number;
    date: string;
    time: string;
  };
}

export interface RoomType {
  type: string;
  name: string;
  capacity: number;
  available: number;
}

export interface AccommodationOption {
  [roomType: string]: number;
}

export interface CustomerFromEditPage {
  id: number | null;
  type: 'individual' | 'legal';
  name: string;
  comment?: string;
}

export interface StatusChildren {
  [key: string]: string;
}

export interface BookingParam {
  title: string;
  type: string;
  children: StatusChildren;
}

export interface BookingParamsResponse {
  data: BookingParam[];
}

// Типы для хранилища
export interface OrderStatus {
  [key: string]: string;
}

