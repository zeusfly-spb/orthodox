import { createApiClient } from './generic'
import type { Entity } from '@/types/entity.ts'

export const entityApi = createApiClient<Entity>('entities')
