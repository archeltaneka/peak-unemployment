import type { DashboardFilters, DashboardResponse } from "../types/dashboard";
import { dateRangeError } from "./filterValidation";
export function latestRequest<T>() {
  let version = 0,
    controller: AbortController | undefined;
  return {
    cancel() {
      version++;
      controller?.abort();
    },
    async run(
      load: (signal: AbortSignal) => Promise<T>,
      success: (value: T) => void,
      failure: (error: unknown) => void,
    ) {
      const current = ++version;
      controller?.abort();
      controller = new AbortController();
      try {
        const value = await load(controller.signal);
        if (current === version) success(value);
      } catch (error) {
        if (current === version) failure(error);
      }
    },
  };
}
export async function fetchDashboard(
  filters: DashboardFilters,
  signal: AbortSignal,
): Promise<DashboardResponse> {
  const validationError = dateRangeError(filters);
  if (validationError) throw new Error(validationError);
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const response = await fetch("/api/dashboard?" + query, { signal });
  if (!response.ok)
    throw new Error(
      response.status === 400
        ? "Check your date range and filters, then try again."
        : "The data source is unavailable. Please try again shortly.",
    );
  return response.json() as Promise<DashboardResponse>;
}
