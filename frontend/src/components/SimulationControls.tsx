import React, { useCallback } from 'react';
import type { SimulationPayload } from '../types/simulation';

export interface ControlValues {
  conversion: number; 
  dealSize:   number; 
  cycle:      number; 
}

interface Props {
  values:   ControlValues;
  onChange: (next: ControlValues) => void;
  onRun:    (payload: SimulationPayload) => void;
  onReset:  () => void;
  loading:  boolean;
}

function sliderStyle(value: number, min: number, max: number): React.CSSProperties {
  const pct = ((value - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, #6366f1 ${pct}%, var(--slider-unfilled) ${pct}%)`,
  };
}

interface RowProps {
  label:  string;
  value:  number;
  min:    number;
  max:    number;
  unit:   string;
  onChange: (v: number) => void;
}

function ControlRow({ label, value, min, max, unit, onChange }: RowProps) {
  const clamp = useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max]);

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v)) onChange(clamp(v));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{label}</span>
        <span className="text-[11px] font-bold text-indigo-500 uppercase">
          {value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            step={1}
            style={sliderStyle(value, min, max)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          />
        </div>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleText}
          className="w-14 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}

export default function SimulationControls({ values, onChange, onRun, onReset, loading }: Props) {
  const isDirty = values.conversion !== 23 || values.dealSize !== 0 || values.cycle !== 0;

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-6 space-y-6 animate-fade-in">
      <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
        Simulation Controls
      </p>

      <div className="space-y-6">
        <ControlRow
          label="Conversion Rate"
          value={values.conversion} min={-50} max={50}
          unit="%" onChange={(v) => onChange({ ...values, conversion: v })}
        />
        <ControlRow
          label="Avg. Deal Size"
          value={values.dealSize} min={-50} max={100}
          unit="%" onChange={(v) => onChange({ ...values, dealSize: v })}
        />
        <ControlRow
          label="Sales Cycle"
          value={values.cycle} min={-20} max={20}
          unit=" days" onChange={(v) => onChange({ ...values, cycle: v })}
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex gap-2">
          <button
            onClick={onReset}
            disabled={!isDirty || loading}
            className="flex-1 py-3 px-4 rounded-xl border border-rose-200/50 dark:border-rose-900/30 text-xs font-black text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all disabled:opacity-30 disabled:border-slate-200 dark:disabled:border-slate-800 disabled:text-slate-400 outline-none uppercase tracking-widest"
          >
            RESET TO DEFAULT (+23%)
          </button>
        </div>

        {/* Run Simulation */}
        <button
          onClick={() => onRun({
            conversionChange: values.conversion / 100,
            dealSizeChange:   values.dealSize   / 100,
            cycleChange:      values.cycle,
          })}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer outline-none"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
