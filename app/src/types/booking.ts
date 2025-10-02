
import type { Tour } from '@/types/tour';
import type { BookingStatuses, PaymentStatuses } from './statuses/statuses';
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
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  participants_count: number;
  tour: Tour;
  customers: Array<Customer>;
  created_at: string;
}

export interface Tourist {
  passport_series: any;
  passport_number: any;
  passport_issue_date: any;
  passport_unit_name: any;
  passport_unit_code: any;
  passport_birth_date: any;
  passport_birth_place: any;
  passport_address: any;
  gender: any;
  snils: any;
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
  tour_id: number ;
  id: number | string;
  desciption: string;
  created_at?: string;
  status: BookingStatuses;
  payment_status:PaymentStatuses
  customers: Customer;
  tour?: Tour;
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

