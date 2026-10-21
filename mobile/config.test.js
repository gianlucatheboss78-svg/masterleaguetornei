import { test, expect } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import capacitor from "../capacitor.config.ts";
import mobile from "../vite.mobile.config.ts";

test("Capacitor copies the dist directory requested for Android", () => {
  expect(capacitor.webDir).toBe("dist");
  expect(mobile.build.outDir).toBe(resolve("dist"));
});

test("the mobile SPA has a resolvable HTML browser entry", () => {
  const html = readFileSync(resolve(mobile.root, "index.html"), "utf8");
  const entry = html.match(/<script type="module" src="([^"]+)"/);
  expect(entry?.[1]).toBe("/entry.tsx");
  expect(existsSync(resolve(mobile.root, "." + entry?.[1]))).toBe(true);
  expect(existsSync(resolve("src/mobile.tsx"))).toBe(true);
});

test("mobile packaging does not replace the web build command or Android identity", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  expect(pkg.scripts.build).toBe("vite build");
  expect(pkg.scripts["build:mobile"]).toBe("vite build --config vite.mobile.config.ts --mode mobile");
  expect(capacitor).not.toHaveProperty("appId");
  expect(capacitor).not.toHaveProperty("android");
});