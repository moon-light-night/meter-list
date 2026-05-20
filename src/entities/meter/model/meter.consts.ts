export const EMPTY_VALUE = '—' as const;

export const METER_TYPE_CODE = {
  HOT_WATER_AREA: 'HotWaterAreaMeter',
  COLD_WATER_AREA: 'ColdWaterAreaMeter',
  HEAT_AREA: 'HeatAreaMeter',
  ELECTRICITY_AREA: 'ElectricityAreaMeter',
} as const;

export const METER_TYPE_LABEL = {
  HOT_WATER: 'ГВС',
  COLD_WATER: 'ХВС',
  HEAT: 'ТПЛ',
  ELECTRICITY: 'ЭЛДТ',
} as const;

export type MeterTypeCode =
  (typeof METER_TYPE_CODE)[keyof typeof METER_TYPE_CODE];

export type MeterTypeLabel =
  (typeof METER_TYPE_LABEL)[keyof typeof METER_TYPE_LABEL];

export type MeterTypeViewLabel = MeterTypeLabel | typeof EMPTY_VALUE;

export const METER_TYPE_LABEL_BY_CODE = {
  [METER_TYPE_CODE.HOT_WATER_AREA]: METER_TYPE_LABEL.HOT_WATER,
  [METER_TYPE_CODE.COLD_WATER_AREA]: METER_TYPE_LABEL.COLD_WATER,
  [METER_TYPE_CODE.HEAT_AREA]: METER_TYPE_LABEL.HEAT,
  [METER_TYPE_CODE.ELECTRICITY_AREA]: METER_TYPE_LABEL.ELECTRICITY,
} satisfies Record<MeterTypeCode, MeterTypeLabel>;

export const METER_TYPE_CODES = Object.values(
  METER_TYPE_CODE
) as readonly MeterTypeCode[];

export const BOOLEAN_LABEL = {
  TRUE: 'Да',
  FALSE: 'Нет',
} as const;

export const ADDRESS_TEXT = {
  LOADING: 'Загрузка адреса...',
  EMPTY: EMPTY_VALUE,
} as const;

export const DELETE_METER_MODAL_TEXT = {
  TITLE: 'Удалить счетчик?',
  CANCEL: 'Отмена',
  DELETE: 'Удалить',
  DELETING: 'Удаление...',
  TYPE_LABEL: 'Тип: ',
  ID_LABEL: 'ID: ',
} as const;
