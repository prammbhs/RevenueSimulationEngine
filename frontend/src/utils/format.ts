/** Format a raw number as INR (Lakhs/Crores), e.g. 1700000 → "₹17L" */
export const formatINR = (value: number): string => {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  let res = '';

  if (abs >= 10_000_000) {
    res = `₹${(abs / 10_000_000).toFixed(2)}Cr`;
  } else if (abs >= 100_000) {
    // 17 lakhs example: 1,700,000 / 100,000 = 17
    res = `₹${(abs / 100_000).toFixed(1)}L`;
  } else if (abs >= 1_000) {
    res = `₹${(abs / 1_000).toFixed(1)}K`;
  } else {
    res = `₹${abs}`;
  }

  // Clean ".0" from things like 17.0L to make it 17L
  return sign + res.replace('.0', '');
};

/** Format as Thousands, or Lakhs/Crores if needed */
export const formatINR_K = (value: number): string => {
  return formatINR(value);
};

/** Format a slider value with sign and unit */
export const formatSliderLabel = (value: number, unit: string): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}${unit}`;
};

/** Y-axis tick formatter for Recharts using Lakhs/Crores */
export const formatYAxisTick = (value: number): string => {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  
  if (abs >= 10_000_000) {
    return `₹${Math.floor(abs / 10_000_000)}Cr`;
  }
  if (abs >= 100_000) {
    return `₹${Math.floor(abs / 100_000)}L`;
  }
  return `₹${Math.floor(abs / 1_000)}K`;
};

/** Build auto-generated summary sentence using INR (Lakhs/Crores) */
export const buildSummary = (
  baseTotal: number,
  scenTotal: number,
  absChange: number,
  pctChange: number,
): string => {
  if (Math.abs(absChange) < 1) {
    return `The current parameters match the baseline. Projected revenue remains steady at ${formatINR(baseTotal)}.`;
  }
  const dir  = absChange >= 0 ? 'increases' : 'decreases';
  const noun = absChange >= 0 ? 'gain' : 'drop';
  return `Projected revenue ${dir} to ${formatINR(scenTotal)} from ${formatINR(baseTotal)}, a ${noun} of ${formatINR(Math.abs(absChange))} (${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%).`;
};
