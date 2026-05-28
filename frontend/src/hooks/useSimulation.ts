import { useState, useCallback } from 'react';
import type { SimulationPayload, SimulationResponse } from '../types/simulation';

const BASE_URL = 'https://app-revsim-backend-gvc7fffpcjehbdgd.koreacentral-01.azurewebsites.net/api/v1';

interface SimulationState {
  data: SimulationResponse | null;
  loading: boolean;
  error: string | null;
}

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    data: null,
    loading: false,
    error: null,
  });

  const runSimulation = useCallback(async (payload: SimulationPayload) => {
    setState({ data: null, loading: true, error: null });
    try {
      const res = await fetch(`${BASE_URL}/performances/simulated`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        const message =
          err.details?.[0]?.message ?? err.error ?? 'Unknown error';
        setState({ data: null, loading: false, error: message });
        return;
      }

      const data: SimulationResponse = await res.json();
      setState({ data, loading: false, error: null });
    } catch {
      setState({
        data: null,
        loading: false,
        error: 'Network error. Is the server running?',
      });
    }
  }, []);

  return { ...state, runSimulation };
}
