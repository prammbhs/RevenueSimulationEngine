/** Format a raw number as Indian Lakhs, e.g. 1438000 → "₹14.38L" */
export const formatLakhs = (value: number): string => {
  const lakhs = value / 100_000;
  return `₹${lakhs.toFixed(2)}L`;
};

/** Format a slider value with sign and unit */
export const formatSliderLabel = (value: number, unit: string): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}${unit}`;
};

/** Y-axis tick formatter for Recharts */
export const formatYAxisTick = (value: number): string => {
  if (value === 0) return '0';
  const lakhs = value / 100_000;
  return `${lakhs.toFixed(0)}L`;
};

/** Build auto-generated summary sentence */
export const buildSummary = (
  baseTotal: number,
  scenTotal: number,
  absChange: number,
  pctChange: number,
): string => {
  if (Math.abs(absChange) < 1) {
    return `The current parameters match the baseline. Projected revenue remains steady at ${formatLakhs(baseTotal)}.`;
  }
  const dir = absChange >= 0 ? 'increases to' : 'decreases to';
  const noun = absChange >= 0 ? 'gain' : 'drop';
  return `Projected revenue ${dir} ${formatLakhs(scenTotal)} from ${formatLakhs(baseTotal)}, a ${noun} of ${formatLakhs(Math.abs(absChange))} (${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%).`;
};
