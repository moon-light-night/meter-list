import { get } from '@/api/apiClient';
import type { AreasResponse } from '@/entities/area/model/area.types';

export function getAreasByIds(ids: string[]) {
  return get<AreasResponse>('areas/', { id__in: ids });
}
