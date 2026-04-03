import React, { useCallback } from 'react';
import { formatSliderLabel } from '../utils/format';
import type { SimulationPayload } from '../types/simulation';

/* ── Types ──────────────────────────────────────────────── */
export interface ControlValues {
  conversion: number; // -50 … +50  → API: /100
  dealSize:   number; // -50 … +100 → API: /100
  cycle:      number; // -20 … +20  → API: as-is
}

interface Props {
  values:   ControlValues;
  onChange: (next: ControlValues) => void;
  onRun:    (payload: SimulationPayload) => void;
  onReset:  () => void;
  loading:  boolean;
}

const DEFAULT: ControlValues = { conversion: 0, dealSize: 0, cycle: 0 };

/* ── Slider track fill ──────────────────────────────────── */
function sliderStyle(value: number, min: number, max: number): React.CSSProperties {
  const pct = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, #6366f1 ${pct}%, var(--slider-unfilled) ${pct}%)`,
  };
}

/* ── Control row ────────────────────────────────────────── */
interface RowProps {
  label:  string;
  value:  number;
  min:    number;
  max:    number;
  unit:   string;
  hint:   string;
  onChange: (v: number) => void;
}

function ControlRow({ label, value, min, max, unit, hint, onChange }: RowProps) {
  const badge = formatSliderLabel(value, unit);
  const color =
    value > 0 ? 'text-indigo-600 dark:text-indigo-400' :
    value < 0 ? 'text-rose-500 dark:text-rose-400' :
                'text-slate-400 dark:text-slate-500';

  const clamp = useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max]);

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v)) onChange(clamp(v));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className={`text-sm font-semibold tabular-nums ${color}`}>{badge}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={1}
        style={sliderStyle(value, min, max)}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleText}
          className="w-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 text-sm font-medium text-slate-800 dark:text-slate-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all"
        />
        <span className="text-xs text-slate-400 dark:text-slate-500">{hint}</span>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function SimulationControls({ values, onChange, onRun, onReset, loading }: Props) {
  const isDirty =
    values.conversion !== DEFAULT.conversion ||
    values.dealSize   !== DEFAULT.dealSize   ||
    values.cycle      !== DEFAULT.cycle;

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-5 space-y-5">
      {/* Header */}
      <p className="text-[10px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
        Simulation Controls
      </p>

      {/* Sliders */}
      <div className="space-y-5">
        <ControlRow
          label="Conversion Rate"
          value={values.conversion} min={-50} max={50}
          unit="%" hint="% Change"
          onChange={(v) => onChange({ ...values, conversion: v })}
        />
        <div className="border-t border-slate-100 dark:border-slate-700/50" />
        <ControlRow
          label="Avg. Deal Size"
          value={values.dealSize} min={-50} max={100}
          unit="%" hint="% Change"
          onChange={(v) => onChange({ ...values, dealSize: v })}
        />
        <div className="border-t border-slate-100 dark:border-slate-700/50" />
        <ControlRow
          label="Sales Cycle"
          value={values.cycle} min={-20} max={20}
          unit=" days" hint="Days Shift"
          onChange={(v) => onChange({ ...values, cycle: v })}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {/* Reset */}
        <button
          onClick={onReset}
          disabled={!isDirty || loading}
          title="Reset to baseline"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>

        {/* Run Simulation */}
        <button
          onClick={() => onRun({
            conversionChange: values.conversion / 100,
            dealSizeChange:   values.dealSize   / 100,
            cycleChange:      values.cycle,
          })}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900 hover:bg-indigo-700 active:scale-[0.97] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Running…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Run Simulation
            </>
          )}
        </button>
      </div>
    </div>
  );
}
