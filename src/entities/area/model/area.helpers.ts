import type { Area } from './area.types';

type AreaLike =
  | Area
  | {
      house?: { address?: string | null } | null;
      str_number_full?: string | null;
    }
  | undefined;

export function formatAreaAddress(area: AreaLike) {
  if (!area || !area.house || !area.house.address) {
    return '—';
  }

  const room = area.str_number_full || '';
  const houseAddress = area.house.address || '';
  return room ? `${houseAddress}, ${room}` : houseAddress;
}
