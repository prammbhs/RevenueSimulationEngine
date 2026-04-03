import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Calendar, LayoutDashboard, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function SunIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );
}

export default function Navbar() {
  const { isDark, toggleDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
      isActive
        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;

  const mobileNavCls = ({ isActive }: { isActive: boolean }) =>
    `w-full text-left px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer flex items-center gap-3 ${
      isActive
        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1a1d27]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 px-4 sm:px-6 py-3.5 flex-shrink-0 transition-colors duration-200">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">

        {/* ── Logo + Title ─────────────────────────────── */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 flex-shrink-0 transition-transform hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
              Revenue Simulation Engine
            </h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              What-If modeling for sales growth
            </p>
          </div>
        </div>

        {/* ── Right side controls ──────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-1.5 mr-3">
            <NavLink to="/" end className={navCls}>
              <LayoutDashboard size={14} />
              Dashboard
            </NavLink>
            <NavLink to="/deals" className={navCls}>
              <Database size={14} />
              Deals
            </NavLink>
          </nav>

          {/* Q3 badge — desktop only */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 bg-white dark:bg-slate-800/50 shadow-sm">
            <Calendar size={14} className="text-indigo-500" />
            Q3 FY2024
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700/60 mx-1 hidden sm:block" />

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-90 transition-all cursor-pointer shadow-sm"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 active:scale-90 transition-all cursor-pointer shadow-sm"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col gap-2 animate-fade-in">
          <NavLink to="/" end className={mobileNavCls} onClick={() => setMenuOpen(false)}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/deals" className={mobileNavCls} onClick={() => setMenuOpen(false)}>
            <Database size={18} />
            Deals Database
          </NavLink>
        </div>
      )}
    </header>
  );
}
