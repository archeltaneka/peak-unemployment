import { expect, it } from "vitest";
import { latestRequest } from "../src/lib/api";
it("aborts prior requests and ignores stale completions even if fetch ignores abort", async () => {
  const controller = latestRequest<number>();
  const seen: number[] = [];
  let firstResolve!: (n: number) => void;
  let firstSignal!: AbortSignal;
  const first = controller.run(
    (signal) => {
      firstSignal = signal;
      return new Promise((resolve) => {
        firstResolve = resolve;
      });
    },
    (value) => seen.push(value),
    () => {},
  );
  await controller.run(
    async () => 2,
    (value) => seen.push(value),
    () => {},
  );
  firstResolve(1);
  await first;
  expect(firstSignal.aborted).toBe(true);
  expect(seen).toEqual([2]);
});
it("cancel prevents post-unmount updates", async () => {
  const controller = latestRequest<number>();
  let resolve!: (n: number) => void;
  const seen: number[] = [];
  const pending = controller.run(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
    (v) => seen.push(v),
    () => {},
  );
  controller.cancel();
  resolve(1);
  await pending;
  expect(seen).toEqual([]);
});
