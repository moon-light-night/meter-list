import {
  BOOLEAN_LABEL,
  EMPTY_VALUE,
  METER_TYPE_CODES,
  METER_TYPE_LABEL_BY_CODE,
  type MeterTypeCode,
  type MeterTypeViewLabel,
} from './meter.consts';
import type { Meter, MeterAreaInfo } from './meter.types';

const isMeterTypeCode = (value: string): value is MeterTypeCode =>
  METER_TYPE_CODES.includes(value as MeterTypeCode);

const isMeterAreaInfo = (area: Meter['area']): area is MeterAreaInfo =>
  Boolean(area && typeof area === 'object' && 'id' in area);

const isString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;

export const formatMeterType = (
  types: readonly string[] = []
): MeterTypeViewLabel => {
  const meterTypeCode = types.find(isMeterTypeCode);

  return meterTypeCode ? METER_TYPE_LABEL_BY_CODE[meterTypeCode] : EMPTY_VALUE;
};

export const formatAutomatic = (value: boolean | null | undefined): string => {
  if (value === true) {
    return BOOLEAN_LABEL.TRUE;
  }

  if (value === false) {
    return BOOLEAN_LABEL.FALSE;
  }

  return EMPTY_VALUE;
};

export const formatInitialValues = (
  values: readonly number[] | null | undefined
): string => {
  if (!values?.length) {
    return EMPTY_VALUE;
  }

  return values.join(', ');
};

export const formatDescription = (value: string | null | undefined): string => {
  const trimmedValue = value?.trim();

  return trimmedValue || EMPTY_VALUE;
};

export const getAreaId = (meter: Pick<Meter, 'area'>): string | undefined =>
  isMeterAreaInfo(meter.area) && isString(meter.area.id)
    ? meter.area.id
    : undefined;

export const getAreaIdsFromMeters = (meters: readonly Meter[]): string[] =>
  Array.from(new Set(meters.map(getAreaId).filter(isString)));
