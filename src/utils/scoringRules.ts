import { LearningStatus } from '../types';

/**
 * Deterministic scoring rule evaluation for rural primary school learners.
 * Rule 1: < 50%  -> 'Needs support'
 * Rule 2: 50% - 70% -> 'Developing'
 * Rule 3: > 70%  -> 'On track'
 */
export function calculateLearningStatus(averageScore: number): LearningStatus {
  if (averageScore < 50) {
    return 'Needs support';
  }
  if (averageScore <= 70) {
    return 'Developing';
  }
  return 'On track';
}

/**
 * Checks if a student has two or more consecutive recent scores below 50%.
 */
export function hasConsecutiveLowScores(scores: number[], threshold = 50): boolean {
  if (scores.length < 2) return false;
  // Consider last two assessments
  const lastTwo = scores.slice(-2);
  return lastTwo.every(s => s < threshold);
}

/**
 * Calculates percentage from raw score and maxScore
 */
export function calculatePercentage(score: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  return Math.round((score / maxScore) * 100);
}
