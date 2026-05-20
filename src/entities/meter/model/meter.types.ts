export interface MeterAreaInfo {
  id: string;
}

export interface Meter {
  id: string;
  _type: readonly string[];
  area?: MeterAreaInfo | null;
  is_automatic: boolean | null;
  communication: string;
  description?: string | null;
  serial_number: string;
  installation_date?: string | null;
  brand_name: string | null;
  model_name: string | null;
  initial_values: readonly number[] | null;
}

export interface MetersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Meter[];
}
