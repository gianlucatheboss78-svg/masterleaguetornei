// Detects Android browsers, native wrappers, and installed apps.
// Browser-safe module: no server code, no Node APIs.

import { useEffect, useLayoutEffect, useState } from "react";

const canUseDOM = typeof window !== "undefined" && typeof window.document !== "undefined";
const useIsoLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

export function detectInApp(): boolean {
  if (!canUseDOM) return false;

  const ua = navigator.userAgent || "";
  if (ua.includes("Android") || (window as Window & { isNativeApp?: boolean }).isNativeApp) return true;

  // Testing escape hatch: ?app=1 forces "inside the app", ?app=0 forces "browser".
  try {
    const forced = new URLSearchParams(window.location.search).get("app");
    if (forced === "1") return true;
    if (forced === "0") return false;
  } catch {
    /* ignore */
  }

  // Bubblewrap / Chrome Trusted Web Activities add a "twa" token to the user agent.
  if (/\btwa\b|twa[./]/i.test(ua)) return true;
  // Android WebView announces itself with "; wv)".
  if (/; wv\)/i.test(ua)) return true;

  // Installed apps (TWA or home-screen shortcut) open in standalone display mode.
  try {
    if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  } catch {
    /* ignore */
  }
  if ((navigator as { standalone?: boolean }).standalone === true) return true;

  return false;
}

/** False during server rendering, then detects Android, native wrappers, and installed apps. */
export function useInApp(): boolean {
  const [inApp, setInApp] = useState(false);
  useIsoLayoutEffect(() => {
    setInApp(detectInApp());
  }, []);
  return inApp;
}
