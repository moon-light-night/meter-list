export function buildQueryString(
  params: Record<string, string | number | boolean | string[] | undefined>
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      const uniqueValues = [...new Set(value)];
      uniqueValues.forEach((item) => searchParams.append(key, item));
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
