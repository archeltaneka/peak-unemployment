import { useEffect, useRef, useState } from "react";
import { fetchDashboard, latestRequest } from "../lib/api";
import type { DashboardFilters, DashboardResponse } from "../types/dashboard";
export function useDashboard(filters: DashboardFilters) {
  const [data, setData] = useState<DashboardResponse>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const requests = useRef(latestRequest<DashboardResponse>());
  useEffect(() => {
    const request = requests.current;
    setLoading(true);
    setError("");
    void request.run(
      (signal) => fetchDashboard(filters, signal),
      (value) => {
        setData(value);
        setLoading(false);
      },
      (err) => {
        setError(
          err instanceof Error ? err.message : "Unable to load dashboard.",
        );
        setLoading(false);
      },
    );
    return () => request.cancel();
  }, [filters, attempt]);
  return { data, error, loading, retry: () => setAttempt((n) => n + 1) };
}
