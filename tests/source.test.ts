import { describe, expect, it } from "vitest";
import { parseCsv, recordsFromValues } from "../worker/csv";
import { SheetsSource } from "../worker/sheets";
const headers = [
  "Company",
  "Role",
  "City",
  "Country",
  "Role Type",
  "Source",
  "Job URL",
  "Date Found",
  "Date Applied",
  "Tier",
  "Status",
  "Follow-up Date",
  "Days Since Applied",
  "Follow-up Flag",
  "Notes",
];
describe("source parsing", () => {
  it("parses quoted multiline values and escaped quotes", () => {
    const csv =
      headers.join(",") +
      '\n"Demo, Inc",Analyst,,Australia,,,,2026-10-01,2026-10-02,1,Applied,,,,"a\n""quote"""';
    const rows = parseCsv(csv);
    expect(rows[0].Company).toBe("Demo, Inc");
    expect(rows[0].Notes).toBe('a\n"quote"');
  });
  it("rejects missing or duplicate required headers", () => {
    expect(() => parseCsv("Company,Status\nA,Applied")).toThrow();
    expect(() =>
      recordsFromValues([[...headers.slice(0, -1), "Company"]]),
    ).toThrow();
  });
  it("allows empty data but not malformed rows", () => {
    expect(recordsFromValues([headers])).toEqual([]);
    expect(() => parseCsv(headers.join(",") + '\n"unterminated')).toThrow();
    expect(() => recordsFromValues([headers, Array(20).fill("x")])).toThrow();
  });
  it("pads trailing empty cells in Sheets rows", () =>
    expect(recordsFromValues([headers, ["Demo"]])[0].Notes).toBe(""));
});
it("signs a read-only JWT, exchanges it and reads a sheet", async () => {
  const key = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  const binary = new Uint8Array(
    await crypto.subtle.exportKey("pkcs8", key.privateKey),
  );
  const pem =
    "-----BEGIN PRIVATE KEY-----\n" +
    btoa(String.fromCharCode(...binary)) +
    "\n-----END PRIVATE KEY-----";
  let assertions = 0;
  const fetcher: typeof fetch = async (input, init) => {
    const url = String(input);
    if (url.includes("oauth2")) {
      const jwt = new URLSearchParams(String(init?.body)).get("assertion")!;
      const [header, payload, signature] = jwt.split(".");
      const decode = (s: string) =>
        Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
          c.charCodeAt(0),
        );
      expect(JSON.parse(new TextDecoder().decode(decode(payload))).scope).toBe(
        "https://www.googleapis.com/auth/spreadsheets.readonly",
      );
      expect(
        await crypto.subtle.verify(
          "RSASSA-PKCS1-v1_5",
          key.publicKey,
          decode(signature),
          new TextEncoder().encode(header + "." + payload),
        ),
      ).toBe(true);
      assertions++;
      return Response.json({ access_token: "test-token", expires_in: 3600 });
    }
    expect(new Headers(init?.headers).get("Authorization")).toBe(
      "Bearer test-token",
    );
    expect(url).toContain("valueRenderOption=FORMATTED_VALUE");
    return Response.json({ values: [headers, ["Demo"]] });
  };
  const source = new SheetsSource(
    {
      GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.com",
      GOOGLE_PRIVATE_KEY: pem,
      GOOGLE_SHEET_ID: "test-sheet",
      GOOGLE_SHEET_RANGE: "Applications!A:O",
    },
    fetcher,
  );
  expect((await source.read())[0].Company).toBe("Demo");
  await source.read();
  expect(assertions).toBe(1);
});
it("rejects malformed non-array source rows instead of silently dropping them", () =>
  expect(() => recordsFromValues([headers, "bad row"])).toThrow());
it("uses the native fetch receiver when no custom fetcher is injected", async () => {
  const key = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  const bytes = new Uint8Array(
    await crypto.subtle.exportKey("pkcs8", key.privateKey),
  );
  const pem =
    "-----BEGIN PRIVATE KEY-----\n" +
    btoa(String.fromCharCode(...bytes)) +
    "\n-----END PRIVATE KEY-----";
  const originalFetch = globalThis.fetch;
  try {
    // workerd rejects a platform fetch called with a class instance as `this`.
    globalThis.fetch = async function (
      this: unknown,
      input: RequestInfo | URL,
    ) {
      if (this !== undefined && this !== globalThis)
        throw new TypeError("Illegal invocation");
      return String(input).startsWith("https://oauth2.googleapis.com/")
        ? Response.json({ access_token: "test-token", expires_in: 3600 })
        : Response.json({ values: [headers, ["Demo"]] });
    } as typeof fetch;
    const source = new SheetsSource({
      GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.com",
      GOOGLE_PRIVATE_KEY: pem,
      GOOGLE_SHEET_ID: "test-sheet",
      GOOGLE_SHEET_RANGE: "Applications!A:O",
    });
    await expect(source.read()).resolves.toEqual([
      Object.fromEntries(
        headers.map((header, index) => [header, index === 0 ? "Demo" : ""]),
      ),
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
