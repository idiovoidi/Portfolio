import { motionValue } from "framer-motion";
import { useSyncExternalStore } from "react";

/**
 * Shared "void" signals for the site-wide gimmicks (cursor, watcher eye,
 * idle decay, terminal). High-frequency values are motion values so they never
 * trigger React renders; low-frequency state goes through the tiny store below.
 */

export type VoidMode = "default" | "glitch" | "warm";

interface VoidState {
  idle: boolean;
  mode: VoidMode;
}

export const cursorX = motionValue(-200);
export const cursorY = motionValue(-200);

let state: VoidState = { idle: false, mode: "default" };
const listeners = new Set<() => void>();

export const setVoidState = (patch: Partial<VoidState>) => {
  const next = { ...state, ...patch };
  const same = next.idle === state.idle && next.mode === state.mode;
  if (same) return;
  state = next;
  for (const listener of listeners) listener();
};

export const getVoidState = () => state;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const useVoidState = () =>
  useSyncExternalStore(subscribe, getVoidState, getVoidState);

/** Sections that change how the cursor behaves. */
export const sectionMode = (sectionId: string | null | undefined): VoidMode => {
  if (sectionId === "projects" || sectionId === "three-d") return "glitch";
  if (sectionId === "commercial") return "warm";
  return "default";
};

/** Open the terminal from anywhere (e.g. a footer link). */
export const TERMINAL_TOGGLE_EVENT = "void:terminal-toggle";
