import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { Kpis } from "../src/components/Kpis";
import { buildDashboard } from "../worker/analytics";

it("keeps small nonzero daily averages visible and explains the calendar denominators", () => {
  const values = buildDashboard(
    [],
    { dateBasis: "applied" },
    "2026-10-31",
  ).kpis;
  const html = renderToStaticMarkup(
    createElement(Kpis, {
      values: {
        ...values,
        submittedToday: 1,
        weeklyDailyAverage: 1 / 7,
        monthlyDailyAverage: 1 / 31,
      },
    }),
  );
  expect(html).toContain("Submitted today");
  expect(html).toContain("Daily average this week");
  expect(html).toContain("Daily average this month");
  expect(html).toContain("<strong>0.14</strong>");
  expect(html).toContain("<strong>0.03</strong>");
  expect(html).toContain("including today and zero-submission days");
  expect(html).toContain("Filters do not shorten this denominator");
});
