import type { CountryItem } from "./types";

const country = (
  id: string,
  content: string,
  musicFile = content.replace(/\s+/g, "")
): CountryItem => ({
  id,
  content,
  music: `./music2/${musicFile}.mp3`,
});

export const firstSemiFinal2026: CountryItem[] = [
  country("MD", "Moldova"),
  country("SE", "Sweden"),
  country("HR", "Croatia"),
  country("GR", "Greece"),
  country("PT", "Portugal"),
  country("GE", "Georgia"),
  country("FI", "Finland"),
  country("ME", "Montenegro"),
  country("EE", "Estonia"),
  country("IL", "Israel"),
  country("BE", "Belgium"),
  country("LT", "Lithuania"),
  country("SM", "San Marino", "SanMarino"),
  country("PL", "Poland"),
  country("RS", "Serbia"),
];

export const secondSemiFinal2026: CountryItem[] = [
  country("BG", "Bulgaria"),
  country("AZ", "Azerbaijan"),
  country("RO", "Romania"),
  country("LU", "Luxembourg"),
  country("CZ", "Czechia", "CzechRepublic"),
  country("AM", "Armenia"),
  country("CH", "Switzerland"),
  country("CY", "Cyprus", "Cyprus1"),
  country("LV", "Latvia"),
  country("DK", "Denmark"),
  country("AU", "Australia"),
  country("UA", "Ukraine"),
  country("AL", "Albania"),
  country("MT", "Malta"),
  country("NO", "Norway"),
];

export const automaticFinalists2026: CountryItem[] = [
  country("AT", "Austria"),
  country("FR", "France"),
  country("DE", "Germany"),
  country("IT", "Italy"),
  country("GB", "United Kingdom", "UnitedKingdom"),
];

export const allParticipants2026: CountryItem[] = [
  ...firstSemiFinal2026,
  ...secondSemiFinal2026,
  ...automaticFinalists2026,
];

export const firstSemiFinalQualifiers2026: CountryItem[] = [
  country("GR", "Greece"),
  country("FI", "Finland"),
  country("BE", "Belgium"),
  country("SE", "Sweden"),
  country("MD", "Moldova"),
  country("IL", "Israel"),
  country("RS", "Serbia"),
  country("HR", "Croatia"),
  country("LT", "Lithuania"),
  country("PL", "Poland"),
];
export const secondSemiFinalQualifiers2026: CountryItem[] = [];
export const grandFinalParticipants2026: CountryItem[] = [
  ...automaticFinalists2026,
  ...firstSemiFinalQualifiers2026,
  ...secondSemiFinalQualifiers2026,
];
export const finalResults2026: CountryItem[] = [];
