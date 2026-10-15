export const statuses = [
  "Discovered",
  "Preparing",
  "Applied",
  "Recruiter Screen",
  "Interview",
  "Technical",
  "Final",
  "Offer",
  "Rejected",
  "Unknown",
] as const;
export type Status = (typeof statuses)[number];
export type DateBasis = "applied" | "found";
export interface DashboardFilters {
  from?: string;
  to?: string;
  dateBasis: DateBasis;
  country?: string;
  roleType?: string;
  source?: string;
  tier?: string;
  status?: string;
}
export interface Group {
  label: string;
  count: number;
}
export interface Geography extends Group {
  iso: string | null;
  lat: number | null;
  lon: number | null;
}
export interface ActivityPoint {
  date: string;
  count: number;
  cumulative: number;
  average: number | null;
  partial: boolean;
}
export interface DashboardData {
  filters: DashboardFilters;
  options: Record<
    "country" | "roleType" | "source" | "tier" | "status",
    string[]
  >;
  kpis: {
    opportunities: number;
    submitted: number;
    active: number;
    interviews: number;
    offers: number;
    rejections: number;
  };
  activity: {
    daily: ActivityPoint[];
    weekly: ActivityPoint[];
    monthly: ActivityPoint[];
    start: string | null;
    end: string | null;
    truncated: boolean;
  };
  pipeline: Group[];
  geography: Geography[];
  roles: Group[];
  sources: Group[];
  tiers: Group[];
  followups: { due: number; overdue: number; upcoming: number };
  quality: { records: number; issues: Group[]; missingFilterDates: number };
}
export interface DashboardResponse extends DashboardData {
  mode: "demo" | "live";
  today: string;
  timezone: string;
  fetchedAt: string;
}
