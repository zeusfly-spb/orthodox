export interface Operator {
  id: number;
  name: string;
}

export interface FixOperatorPayload {
  name: string;
  description: string;
  email: string;
  phone: string;
  legal_name: string;
  opf: string;
  inn: string;
  ogrn: string;
  ogrn_date: string;
  kpp: string;
  okpo: string;
  legal_address: string;
  real_address: string;
  postal_address: string;
}
