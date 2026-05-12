export type CountryItem = {
  id: string;
  content: string;
  music: string;
  isCorrect?: boolean;
  guess?: number;
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

export const readStoredCountryItems = (
  key: string,
  fallback: CountryItem[]
): CountryItem[] => {
  const savedItems = localStorage.getItem(key);
  if (!savedItems) {
    return fallback;
  }

  try {
    const parsed: unknown = JSON.parse(savedItems);
    return isCountryItemArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};
