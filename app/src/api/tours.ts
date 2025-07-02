import { createApiClient } from './generic'
import type { Tour } from '@/types/tour'

export const tourApi = createApiClient<Tour>('tours')
