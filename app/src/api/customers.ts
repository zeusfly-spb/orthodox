import { createApiClient } from './generic';
import type { Customer } from '@/types/customer';

export const customerApi = createApiClient<Customer>('customers');
