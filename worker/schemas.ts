import { statuses, type Status } from "../src/types/dashboard";
export type SourceRecord = Record<string, string>;
export const countries: Record<
  string,
  { iso: string; lat: number; lon: number }
> = {
  Australia: { iso: "AUS", lat: -25.3, lon: 133.8 },
  Canada: { iso: "CAN", lat: 56.1, lon: -106.3 },
  "United States": { iso: "USA", lat: 37.1, lon: -95.7 },
  "United Kingdom": { iso: "GBR", lat: 55.4, lon: -3.4 },
  Singapore: { iso: "SGP", lat: 1.35, lon: 103.8 },
  Germany: { iso: "DEU", lat: 51.2, lon: 10.5 },
  "New Zealand": { iso: "NZL", lat: -40.9, lon: 174.9 },
  Netherlands: { iso: "NLD", lat: 52.1, lon: 5.3 },
  India: { iso: "IND", lat: 20.6, lon: 79 },
  France: { iso: "FRA", lat: 46.2, lon: 2.2 },
};
export const taxonomies = {
  country: [...Object.keys(countries), "Unknown"],
  roleType: [
    "Data Analyst",
    "Data Scientist",
    "Analytics Engineer",
    "Data Engineer",
    "Product Analyst",
    "Business Analyst",
    "Machine Learning Engineer",
    "ML Engineer",
    "AI Engineer",
    "Other",
    "Not specified",
    "Unknown",
  ],
  source: [
    "LinkedIn",
    "Indeed",
    "SEEK",
    "Company Website",
    "Referral",
    "Recruiter",
    "University",
    "Other",
    "Unknown",
  ],
  tier: ["A", "B", "C", "Unknown"],
  status: [...statuses],
};
export const activeStatuses: readonly Status[] = [
  "Applied",
  "Recruiter Screen",
  "Interview",
  "Technical",
  "Final",
];
export function normalizeTier(value: string | undefined): string {
  return (
    /^(?:tier\s+)?([abc])$/i.exec(value?.trim() ?? "")?.[1].toUpperCase() ??
    "Unknown"
  );
}
export function reviewed(
  value: string | undefined,
  choices: readonly string[],
): string {
  return (
    choices.find((c) => c.toLowerCase() === value?.trim().toLowerCase()) ??
    "Unknown"
  );
}
export interface NormalizedRecord {
  country: string;
  roleType: string;
  source: string;
  tier: string;
  status: Status;
  found: string | null;
  applied: string | null;
  followup: string | null;
  submitted: boolean;
  issues: string[];
}
