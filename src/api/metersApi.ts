import { get, del } from '@/api/apiClient';
import type { MetersResponse } from '@/entities/meter/model/meter.types';

export function getMeters(
  params: { limit: number; offset: number },
  signal?: AbortSignal
) {
  return get<MetersResponse>('meters/', params, signal);
}

export function deleteMeter(id: string, signal?: AbortSignal) {
  return del(`meters/${id}/`, signal);
}
