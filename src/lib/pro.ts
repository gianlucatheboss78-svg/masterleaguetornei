import { useEffect, useState } from "react";

const KEY = "mlt.pro.v1";
const OWNER_KEY = "mlt.owner.v1";
export const PRO_PRICE = "9,99 €";
export const PRO_TRIAL_DAYS = 6;

export const OWNER_EMAILS = ["gianlucatheboss78@gmail.com"];

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function isOwnerEmail(email: string): boolean {
  return OWNER_EMAILS.includes(email.trim().toLowerCase());
}

export function ownerEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(OWNER_KEY);
}

export function isOwner(): boolean {
  const e = ownerEmail();
  return !!e && isOwnerEmail(e);
}

export function signInOwner(email: string): boolean {
  if (!isOwnerEmail(email)) return false;
  window.localStorage.setItem(OWNER_KEY, email.trim().toLowerCase());
  notify();
  return true;
}

export function signOutOwner() {
  window.localStorage.removeItem(OWNER_KEY);
  notify();
}

export function isPro(): boolean {
  if (typeof window === "undefined") return false;
  if (isOwner()) return true;
  return window.localStorage.getItem(KEY) === "1";
}

export function setPro(value: boolean) {
  window.localStorage.setItem(KEY, value ? "1" : "0");
  notify();
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

export function useOwner() {
  const [owner, setState] = useState(false);
  useEffect(() => {
    const sync = () => setState(isOwner());
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);
  return owner;
}
