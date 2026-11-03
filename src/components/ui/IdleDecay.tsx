import type React from "react";
import { useEffect } from "react";
import { useVoidState } from "../../utils/voidStore";

const GLYPHS = "▓▒░█#@%&?/\\|<>01┤╫≈";
const SCRAMBLE_TAGS = "h1, h2, h3, h4, p, li, a, button, span, label";

function scramble(text: string, amount: number) {
  let out = "";
  for (const ch of text) {
    out +=
      ch !== " " && Math.random() < amount
        ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        : ch;
  }
  return out;
}

/**
 * After 30s without input the page slowly decays: CRT scanlines creep in and
 * on-screen text corrupts. Any input snaps it back (the idle flag is cleared
 * by useVoidSignals, which this reacts to).
 */
export const IdleDecay: React.FC = () => {
  const { idle } = useVoidState();

  useEffect(() => {
    if (!idle) return;
    document.documentElement.setAttribute("data-void-decay", "");

    // node -> [original, what we wrote]; React may rewrite a node under us
    const originals = new Map<Text, [string, string]>();
    const started = performance.now();

    const corrupt = () => {
      // Ramp from a couple of nodes to a lot over ~60s
      const progress = Math.min((performance.now() - started) / 60_000, 1);
      const nodesPerTick = 1 + Math.floor(progress * 7);
      const amount = 0.08 + progress * 0.35;

      const candidates: Text[] = [];
      for (const el of document.querySelectorAll(SCRAMBLE_TAGS)) {
        if (el.closest("[data-void-ignore]")) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        for (const node of el.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            const t = node as Text;
            if ((t.nodeValue ?? "").trim().length > 3) candidates.push(t);
          }
        }
      }

      for (let i = 0; i < nodesPerTick && candidates.length; i++) {
        const node = candidates.splice(
          Math.floor(Math.random() * candidates.length),
          1,
        )[0];
        const original = originals.get(node)?.[0] ?? node.nodeValue ?? "";
        const garbled = scramble(original, amount);
        originals.set(node, [original, garbled]);
        node.nodeValue = garbled;
      }

      // Let some nodes heal so the page flickers rather than just rotting
      for (const [node, [original, garbled]] of originals) {
        if (Math.random() < 0.12) {
          if (node.nodeValue === garbled) node.nodeValue = original;
          originals.delete(node);
        }
      }
    };

    const timer = window.setInterval(corrupt, 450);

    return () => {
      window.clearInterval(timer);
      document.documentElement.removeAttribute("data-void-decay");
      for (const [node, [original, garbled]] of originals) {
        if (node.isConnected && node.nodeValue === garbled) {
          node.nodeValue = original;
        }
      }
      originals.clear();
    };
  }, [idle]);

  return (
    <div
      aria-hidden="true"
      className="void-decay-scanlines"
      data-active={idle ? "true" : "false"}
    />
  );
};

export default IdleDecay;
