/**
 * TypeScript Type Definitionen für Test-Daten
 */

// Basis-Typen
export interface TestAntwort {
  id: string;
  text: string;
  score: Record<string, number>;
}

export interface TestFrage {
  id: string;
  frage: string;
  antworten: TestAntwort[];
}

export interface TestDaten {
  testId: string;
  testName: string;
  kategorie: string;
  fragen: TestFrage[];
  bewertungsKategorien: string[];
}

// Ergebnis-Typen
export interface TestErgebnis {
  testId: string;
  testName: string;
  scores: Record<string, number>;
  prozent: number;
  antworten: Array<{ frageId: string; antwortId: string }>;
}

// Fortschritt-Typen
export interface TestFortschritt {
  testId: string;
  abgeschlosseneFragen: string[];
  letztesSpielDatum: string;
  aktuelleFrage: string;
  fortschritt: number; // 0-100
}
