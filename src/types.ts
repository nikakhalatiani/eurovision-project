export type CountryItem = {
  id: string;
  content: string;
  music: string;
  isCorrect?: boolean;
  guess?: number;
};

type StoredCountryItemsOptions = {
  allowedItems?: CountryItem[];
  expectedLength?: number;
  allowSubsetOfFallback?: boolean;
  validateAgainstFallback?: boolean;
};

export const isCountryItem = (value: unknown): value is CountryItem => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.content === "string" &&
    typeof item.music === "string" &&
    (item.isCorrect === undefined || typeof item.isCorrect === "boolean") &&
    (item.guess === undefined || typeof item.guess === "number")
  );
};

export const isCountryItemArray = (value: unknown): value is CountryItem[] =>
  Array.isArray(value) && value.every(isCountryItem);

const hasSameCountryIds = (items: CountryItem[], fallback: CountryItem[]) => {
  const ids = new Set(items.map((item) => item.id));

  return (
    ids.size === items.length &&
    ids.size === fallback.length &&
    fallback.every((item) => ids.has(item.id))
  );
};

const hasUniqueAllowedCountryIds = (
  items: CountryItem[],
  allowedItems: CountryItem[]
) => {
  const ids = new Set(items.map((item) => item.id));
  const allowedIds = new Set(allowedItems.map((item) => item.id));

  return (
    ids.size === items.length && items.every((item) => allowedIds.has(item.id))
  );
};

export const readStoredCountryItems = (
  key: string,
  fallback: CountryItem[],
  options: StoredCountryItemsOptions = {}
): CountryItem[] => {
  const savedItems = localStorage.getItem(key);
  if (!savedItems) {
    return fallback;
  }

  try {
    const parsed: unknown = JSON.parse(savedItems);
    if (!isCountryItemArray(parsed)) {
      return fallback;
    }

    if (
      options.expectedLength !== undefined &&
      parsed.length !== options.expectedLength
    ) {
      return fallback;
    }

    const allowedItems = options.allowedItems ?? fallback;
    const hasValidIds = options.allowSubsetOfFallback
      ? hasUniqueAllowedCountryIds(parsed, allowedItems)
      : hasSameCountryIds(parsed, allowedItems);

    if (options.validateAgainstFallback && !hasValidIds) {
      return fallback;
    }

    return parsed;
  } catch {
    return fallback;
  }
};
