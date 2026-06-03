/* eslint-disable @typescript-eslint/no-explicit-any -- generic deep-merge helper */
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "./routing";
import en from "../messages/en.json";

// Deep-merge a locale's messages over English so any not-yet-translated key
// gracefully falls back to English (lets us translate progressively).
function deepMerge<T>(base: T, override: Partial<T>): T {
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...base };
  for (const key of Object.keys(override ?? {})) {
    const b = (base as any)?.[key];
    const o = (override as any)[key];
    out[key] =
      b && o && typeof b === "object" && typeof o === "object" && !Array.isArray(b)
        ? deepMerge(b, o)
        : o;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const messages =
    locale === "en"
      ? en
      : deepMerge(en, (await import(`../messages/${locale}.json`)).default);
  return { locale, messages };
});
