import { recordsFromValues } from "./csv";
import type { SourceRecord } from "./schemas";
export interface DataSource {
  read(): Promise<SourceRecord[]>;
}
export interface SheetConfig {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
  GOOGLE_SHEET_RANGE: string;
}
const encode = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
const json64 = (value: unknown) =>
  encode(new TextEncoder().encode(JSON.stringify(value)));
export class SheetsSource implements DataSource {
  private token: { value: string; expires: number } | null = null;
  constructor(
    private config: SheetConfig,
    private fetcher: typeof fetch = fetch,
  ) {}
  private async accessToken(): Promise<string> {
    if (this.token && this.token.expires > Date.now()) return this.token.value;
    const now = Math.floor(Date.now() / 1000);
    const body =
      json64({ alg: "RS256", typ: "JWT" }) +
      "." +
      json64({
        iss: this.config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      });
    const pem = this.config.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
      .replace(/-----[^-]+-----/g, "")
      .replace(/\s/g, "");
    const key = await crypto.subtle.importKey(
      "pkcs8",
      Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      key,
      new TextEncoder().encode(body),
    );
    const response = await this.fetcher("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: body + "." + encode(new Uint8Array(signature)),
      }).toString(),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Source unavailable");
    const data = (await response.json()) as {
      access_token?: unknown;
      expires_in?: unknown;
    };
    if (
      typeof data.access_token !== "string" ||
      typeof data.expires_in !== "number"
    )
      throw new Error("Invalid token response");
    this.token = {
      value: data.access_token,
      expires:
        Date.now() + Math.max(0, Math.min(data.expires_in, 3600) - 60) * 1000,
    };
    return this.token.value;
  }
  async read(): Promise<SourceRecord[]> {
    const token = await this.accessToken();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(this.config.GOOGLE_SHEET_ID)}/values/${encodeURIComponent(this.config.GOOGLE_SHEET_RANGE)}?valueRenderOption=FORMATTED_VALUE`;
    const response = await this.fetcher(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      if (response.status === 401) this.token = null;
      throw new Error("Source unavailable");
    }
    const text = await response.text();
    if (text.length > 5_000_000) throw new Error("Source too large");
    const data = JSON.parse(text) as { values?: unknown };
    return recordsFromValues(data.values);
  }
}
