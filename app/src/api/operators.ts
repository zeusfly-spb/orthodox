import api from './httpClient';
import { createApiClient } from './generic';
import type { Operator, FixOperatorPayload } from '@/types/operator';

export const fetchOperators = async (): Promise<Operator[]> => {
  const { data } = await api.get<{ data: Operator[] }>('/operators');
  return data.data;
};

export const fetchOperator = async (): Promise<Operator[]> => {
  const { data } = await api.get<{ data: Operator[] }>(`/manage/operator`);
  return data.data;
};

export const fixOperatorById = async (
  id: number,
  data: FixOperatorPayload,
): Promise<Operator[]> => {
  const response = await api.patch<Operator[]>(`/manage/operator/${id}`, data);
  return response.data;
};

export const operatorApi = createApiClient('operator');
