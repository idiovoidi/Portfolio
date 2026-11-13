import { useEffect } from "react";

const HEADER_OFFSET = 80;
const SETTLE_MS = 6000;
const RETRY_MS = 150;

/**
 * Deep links like /#commercial land on the right section even though sections
 * are lazy-loaded and images shift the layout while the page settles.
 * Re-aligns to the hash target until the page stops moving or the visitor
 * scrolls, then gets out of the way. Also reacts to later hash changes.
 */
export const useHashScroll = () => {
  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;

    const cancel = () => {
      cancelled = true;
      window.clearTimeout(timer);
    };

    const align = (target: string, startedAt: number) => {
      if (cancelled) return;
      const el = document.getElementById(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const wanted = Math.max(0, top - HEADER_OFFSET);
        if (Math.abs(window.scrollY - wanted) > 2) {
          window.scrollTo({ top: wanted, behavior: "auto" });
        }
      }
      if (Date.now() - startedAt < SETTLE_MS) {
        timer = window.setTimeout(() => align(target, startedAt), RETRY_MS);
      }
    };

    const start = () => {
      cancel();
      const target = decodeURIComponent(window.location.hash.slice(1));
      if (!target) return;
      cancelled = false;
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      align(target, Date.now());
    };

    // Any manual scroll input hands control back to the visitor
    const userEvents = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    for (const type of userEvents) {
      window.addEventListener(type, cancel, { passive: true });
    }
    window.addEventListener("hashchange", start);
    start();

    return () => {
      cancel();
      window.removeEventListener("hashchange", start);
      for (const type of userEvents) window.removeEventListener(type, cancel);
    };
  }, []);
};
