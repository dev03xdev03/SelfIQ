import ergebnisProfileData from '../daten/ergebnisProfile.json';

// Konstanten
const QUESTIONS_PER_DIMENSION = 5;
const SCORE_RANGE = { min: -3, max: 3 };
const MIN_POSSIBLE = SCORE_RANGE.min * QUESTIONS_PER_DIMENSION;
const MAX_POSSIBLE = SCORE_RANGE.max * QUESTIONS_PER_DIMENSION;

const DIMENSIONS = [
  'extraversion',
  'agreeableness',
  'conscientiousness',
  'neuroticism',
  'openness',
] as const;

export type Dimension = (typeof DIMENSIONS)[number];
export type Range = 'veryLow' | 'low' | 'medium' | 'high' | 'veryHigh';

/**
 * Berechnet den Prozentsatz für einen Score basierend auf Min/Max-Werten
 */
export const calculatePercentage = (
  score: number,
  minPossible: number = MIN_POSSIBLE,
  maxPossible: number = MAX_POSSIBLE,
): number => {
  const normalized =
    ((score - minPossible) / (maxPossible - minPossible)) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized)));
};

/**
 * Bestimmt die Scoring-Range basierend auf dem Prozentsatz
 */
export const determineRange = (percentage: number): Range => {
  if (percentage <= 20) return 'veryLow';
  if (percentage <= 40) return 'low';
  if (percentage <= 60) return 'medium';
  if (percentage <= 80) return 'high';
  return 'veryHigh';
};

/**
 * Holt das Ergebnisprofil für eine bestimmte Dimension und einen Score
 */
export const getResultProfile = (dimension: Dimension, percentage: number) => {
  const range = determineRange(percentage);
  const dimensionData = ergebnisProfileData.dimensions[dimension];

  if (!dimensionData) {
    console.error(`Dimension ${dimension} nicht gefunden`);
    return null;
  }

  const profile = dimensionData.profiles[range];

  return {
    dimension: dimensionData.name,
    dimensionDescription: dimensionData.description,
    percentage,
    range,
    ...profile,
  };
};

/**
 * Berechnet Ergebnisse für alle Dimensionen basierend auf Scores
 */
export const calculateAllProfiles = (scores: Record<string, number>) => {
  const profiles: any[] = [];

  DIMENSIONS.forEach((dimension) => {
    const score = scores[dimension] || 0;
    const percentage = calculatePercentage(score, MIN_POSSIBLE, MAX_POSSIBLE);
    const profile = getResultProfile(dimension, percentage);

    if (profile) {
      profiles.push({
        dimensionKey: dimension,
        score,
        ...profile,
      });
    }
  });

  // Sortiere nach Percentage (höchste zuerst)
  profiles.sort((a, b) => b.percentage - a.percentage);

  return {
    profiles,
    dominantTrait: profiles[0], // Das stärkste Merkmal
    secondaryTrait: profiles[1], // Das zweitstärkste Merkmal
  };
};

/**
 * Generiert eine Zusammenfassung über alle Dimensionen
 */
export const generateSummary = (scores: { [key: string]: number }) => {
  const results = calculateAllProfiles(scores);

  const summary = {
    primaryPersonality: results.dominantTrait,
    secondaryPersonality: results.secondaryTrait,
    allDimensions: results.profiles,
    overallDescription: `Du bist primär ${results.dominantTrait.title.toLowerCase()} mit starken Zügen ${results.secondaryTrait.title
      .toLowerCase()
      .replace('der ', 'des ')
      .replace('die ', 'der ')}.`,
    combinedStrengths: [
      ...results.dominantTrait.strengths.slice(0, 3),
      ...results.secondaryTrait.strengths.slice(0, 2),
    ],
    combinedKeywords: [
      ...results.dominantTrait.keywords.slice(0, 3),
      ...results.secondaryTrait.keywords.slice(0, 2),
    ],
  };

  return summary;
};

/**
 * Export für TypeScript-Typen
 */
export interface ProfileResult {
  dimension: string;
  dimensionDescription: string;
  percentage: number;
  range: 'veryLow' | 'low' | 'medium' | 'high' | 'veryHigh';
  title: string;
  shortDescription: string;
  detailedDescription: string;
  strengths: string[];
  challenges: string[];
  professionalSuitability: string;
  keywords: string[];
  developmentTips: string[];
}

export interface TestSummary {
  primaryPersonality: ProfileResult;
  secondaryPersonality: ProfileResult;
  allDimensions: ProfileResult[];
  overallDescription: string;
  combinedStrengths: string[];
  combinedKeywords: string[];
}
