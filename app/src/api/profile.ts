import { createApiClient } from './generic'
import type { OperatorProfile } from '@/types/profile'

export const profileApi = createApiClient<OperatorProfile>('operator')
