import { createApiClient } from './system';
import type { Country } from '@/types/country';

export const countryApi = createApiClient<Country>('countries');