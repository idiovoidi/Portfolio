import { useEffect } from "react";
import {
  cursorX,
  cursorY,
  sectionMode,
  setVoidState,
} from "../utils/voidStore";

export const IDLE_AFTER_MS = 30_000;

/**
 * Feeds the shared void store: cursor position, which section the cursor is
 * over, and the 30s idle flag.
 */
export function useVoidSignals(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      setVoidState({ idle: false, mode: "default" });
      return;
    }

    let frame = 0;
    let lastX = 0;
    let lastY = 0;
    let idleTimer: number | undefined;

    const wake = () => {
      setVoidState({ idle: false });
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(
        () => setVoidState({ idle: true }),
        IDLE_AFTER_MS,
      );
    };

    const tick = () => {
      frame = 0;
      const el = document.elementFromPoint(lastX, lastY);
      const section = el?.closest("section[id]");
      setVoidState({ mode: sectionMode(section?.id) });
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!frame) frame = window.requestAnimationFrame(tick);
      wake();
    };

    const events = ["keydown", "pointerdown", "wheel", "touchstart"] as const;
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    for (const name of events) window.addEventListener(name, wake);
    wake();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", wake);
      for (const name of events) window.removeEventListener(name, wake);
      window.clearTimeout(idleTimer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);
}
