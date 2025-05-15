// Target number of ready-to-rent motorcycles for efficiency calculation
export const MOTO_EFFICIENCY_TARGET = 30;

// Time thresholds (in hours)
export const TIME_THRESHOLDS = {
  WARNING: 24, // Warning after 24 hours in yard
  CRITICAL: 48  // Critical alert after 48 hours
};

// Efficiency rating thresholds (percentages)
export const EFFICIENCY_RATINGS = {
  POOR: 50,
  AVERAGE: 75,
  GOOD: 90
};