import React, { useEffect, useState } from "react";

interface CursedTextProps {
  text: string;
  className?: string;
}

// Combining diacritics that stack above / below / through the base glyph
const MARKS_UP = "̍̎̄̅̿̑̆̐͒͗͑̇̈̊͂̓̈́͊͋͌̃̂̌͐̀́̋̏̒̓̔̽̉ͣͤͥͦͧͨͩͪͫͬͭͮͯ̾͛͆̚";
const MARKS_MID = "̴̵̶̡̢̧̨̛̀́̕͘͏̸̷͜͟͢͝͞͠͡҉";
const MARKS_DOWN = "̖̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎͓͔͕͖͙͚̣ͅ";
const SYMBOLS = "█▓▒░▌▐╬╫☠⚠¿?#%&@$";

// Corruption levels: low enough between spikes that the text stays readable
const CALM = 0.5;
const SPIKE = 1.5;

const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
const pickN = (s: string, n: number) =>
  Array.from({ length: n }, () => pick(s)).join("");

function curse(text: string, intensity: number): string {
  return Array.from(text)
    .map((ch) => {
      if (ch === " ") return ch;
      // occasionally swap a character for a corrupted block
      const base = Math.random() < intensity * 0.08 ? pick(SYMBOLS) : ch;
      return (
        base +
        pickN(MARKS_UP, Math.round(Math.random() * 3 * intensity)) +
        pickN(MARKS_MID, Math.round(Math.random() * intensity)) +
        pickN(MARKS_DOWN, Math.round(Math.random() * 3 * intensity))
      );
    })
    .join("");
}

const CursedText: React.FC<CursedTextProps> = ({ text, className = "" }) => {
  const [display, setDisplay] = useState(() => curse(text, CALM));

  useEffect(() => {
    // Re-roll the corruption at irregular intervals, with occasional violent spikes
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const spike = Math.random() > 0.8;
      setDisplay(curse(text, spike ? SPIKE : CALM));
      timeout = setTimeout(tick, spike ? 90 : 150 + Math.random() * 600);
    };
    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <span
      className={`cursed-text inline-block relative overflow-visible ${className}`}
      aria-label={text}
      style={{ fontFamily: "var(--font-glitch)" }}
    >
      <span aria-hidden="true">{display}</span>
    </span>
  );
};

export { CursedText };
export default CursedText;
