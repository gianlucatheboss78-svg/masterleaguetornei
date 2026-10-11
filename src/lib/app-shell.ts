// Detects whether the app is running inside the installable Android package
// (Trusted Web Activity / WebView / installed PWA) instead of a normal browser tab.
// Browser-safe module: no server code, no Node APIs.

import { useEffect, useLayoutEffect, useState } from "react";

const canUseDOM = typeof window !== "undefined" && typeof window.document !== "undefined";
const useIsoLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

export function detectInApp(): boolean {
  if (!canUseDOM) return false;

  // Testing escape hatch: ?app=1 forces "inside the app", ?app=0 forces "browser".
  try {
    const forced = new URLSearchParams(window.location.search).get("app");
    if (forced === "1") return true;
    if (forced === "0") return false;
  } catch {
    /* ignore */
  }

  const ua = navigator.userAgent || "";
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

/** False while server-rendering and on the very first paint, then true only inside the installed app. */
export function useInApp(): boolean {
  const [inApp, setInApp] = useState(false);
  useIsoLayoutEffect(() => {
    setInApp(detectInApp());
  }, []);
  return inApp;
}
