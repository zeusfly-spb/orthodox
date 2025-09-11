import type { Customer } from '@/types/customer';
import type { Tour } from '@/types/tour';

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
