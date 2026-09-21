import { useEffect, useState } from "react";

const KEY = "mlt.pro.v1";
export const FREE_TOURNAMENT_LIMIT = 3;
export const PRO_PRICE = "9,99 €";

const listeners = new Set<() => void>();

export function isPro(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function setPro(value: boolean) {
  window.localStorage.setItem(KEY, value ? "1" : "0");
  listeners.forEach((l) => l());
}

export function usePro() {
  const [pro, setState] = useState(false);
  useEffect(() => {
    const sync = () => setState(isPro());
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);
  return pro;
}
