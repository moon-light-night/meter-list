import { API_BASE_URL } from '@/config/consts';
import { buildQueryString } from '@/lib/buildQueryString';

interface RequestParams {
  limit?: number;
  offset?: number;
  id__in?: string[];
}

const buildUrl = (path: string) => {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');

  return `${normalizedBaseUrl}/${normalizedPath}`;
};

const request = async <T>(
  path: string,
  options: RequestInit = {},
  params?: RequestParams,
  signal?: AbortSignal
) => {
  const query = params
    ? buildQueryString(
        params as Record<
          string,
          string | number | boolean | string[] | undefined
        >
      )
    : '';

  const response = await fetch(`${buildUrl(path)}${query}`, {
    ...options,
    signal,
  });

  const text = await response.text();

  if (!response.ok) {
    const message = text || response.statusText || 'Ошибка сети';
    throw new Error(message);
  }

  try {
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error('Неверный ответ сервера');
  }
};

export const get = async <T>(
  path: string,
  params?: RequestParams,
  signal?: AbortSignal
) => {
  return request<T>(path, { method: 'GET' }, params, signal);
};

export const del = async (path: string, signal?: AbortSignal) => {
  return request<void>(path, { method: 'DELETE' }, undefined, signal);
};
