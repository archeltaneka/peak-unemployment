import { useEffect, useRef, useState } from "react";
import { latestRequest } from "../lib/api";
import type { ExplorerResponse } from "../types/dashboard";
export function useExplorer() {
  const [data, setData] = useState<ExplorerResponse>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const requests = useRef(latestRequest<ExplorerResponse>());
  useEffect(() => {
    const request = requests.current;
    setLoading(true);
    setError("");
    void request.run(
      async (signal) => {
        const response = await fetch("/api/explorer", { signal });
        if (!response.ok)
          throw new Error(
            "Application records are unavailable. Please try again shortly.",
          );
        return response.json() as Promise<ExplorerResponse>;
      },
      (value) => {
        setData(value);
        setLoading(false);
      },
      (err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load application records.",
        );
        setLoading(false);
      },
    );
    return () => request.cancel();
  }, [attempt]);
  return { data, error, loading, retry: () => setAttempt((n) => n + 1) };
}
