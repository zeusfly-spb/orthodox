import { createApiClient } from './generic';
import type { Partner } from '@/types/partner';

export const partnerApi = createApiClient<Partner>('partners');
