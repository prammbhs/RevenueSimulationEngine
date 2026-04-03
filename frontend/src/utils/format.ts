/** Format a raw number as USD, e.g. 1438000 → "$1.44M" */
export const formatUSD = (value: number): string => {
  const millions = value / 1_000_000;
  return `$${millions.toFixed(2)}M`;
};

/** Format as Thousands, e.g. 143800 → "$143.8K" */
export const formatUSD_K = (value: number): string => {
  const k = value / 1_000;
  return `$${k.toLocaleString(undefined, { maximumFractionDigits: 1 })}K`;
};

/** Format a slider value with sign and unit */
export const formatSliderLabel = (value: number, unit: string): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}${unit}`;
};

/** Y-axis tick formatter for Recharts in Millions */
export const formatYAxisTick = (value: number): string => {
  if (value === 0) return '0';
  const millions = value / 1_000_000;
  return `$${millions.toFixed(1)}M`;
};

/** Build auto-generated summary sentence using USD */
export const buildSummary = (
  baseTotal: number,
  scenTotal: number,
  absChange: number,
  pctChange: number,
): string => {
  if (Math.abs(absChange) < 1) {
    return `The current parameters match the baseline. Projected revenue remains steady at ${formatUSD(baseTotal)}.`;
  }
  const dir  = absChange >= 0 ? 'increases' : 'decreases';
  const noun = absChange >= 0 ? 'gain' : 'drop';
  return `Projected revenue ${dir} to ${formatUSD(scenTotal)} from ${formatUSD(baseTotal)}, a ${noun} of ${formatUSD(Math.abs(absChange))} (${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%).`;
};
