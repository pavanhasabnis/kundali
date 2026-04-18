/**
 * Content library types for Marathi/English kundli predictions.
 * All snippets sourced from BPHS, Jataka Parijata, Saravali classical canon.
 */

export interface BilingualSnippet {
  mr: string;
  en: string;
}

export type HouseIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type PlanetId =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type RashiIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
