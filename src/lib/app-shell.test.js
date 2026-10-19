import { test, expect } from "bun:test";

globalThis.window = {
  document: {},
  location: { search: "" },
  matchMedia: () => ({ matches: false }),
};
Object.defineProperty(globalThis, "navigator", {
  value: { userAgent: "Desktop browser" },
  configurable: true,
});
const { detectInApp } = await import("./app-shell.ts");

test("Android browsers hide Stripe even with app=0", () => {
  navigator.userAgent = "Mozilla/5.0 (Linux; Android 14) Chrome/130";
  window.location.search = "?app=0";
  expect(detectInApp()).toBe(true);
});

test("window.isNativeApp hides Stripe even with app=0", () => {
  navigator.userAgent = "Desktop browser";
  window.isNativeApp = true;
  window.location.search = "?app=0";
  expect(detectInApp()).toBe(true);
});

test("ordinary non-Android browsers retain Stripe", () => {
  navigator.userAgent = "Desktop browser";
  window.isNativeApp = false;
  window.location.search = "";
  expect(detectInApp()).toBe(false);
});