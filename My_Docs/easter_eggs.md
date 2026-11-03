# Easter Eggs & Void Gimmicks

Everything hidden or atmospheric on the site, how to trigger it, and where it lives.

## Quick reference

| Trigger | Effect | Code |
| --- | --- | --- |
| Press `` ` `` (backtick) | Opens/closes the void terminal | `VoidTerminal.tsx` |
| Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) | Opens the void terminal | `VoidTerminal.tsx` |
| 30s without input | Idle decay: scanlines, text corruption | `IdleDecay.tsx`, `useVoidSignals.ts` |
| Open browser devtools console | ASCII banner and hints | `consoleEasterEgg.ts` |
| Click the "Light Mode" button in the nav | Glitchy "only darkness here" error | `Navigation.tsx` |
| Click the void portal in the hero | Spawns mini pulses | `VoidEyeball.tsx` |

## Void terminal

Open with `` ` `` or the Konami code. Close with `` ` ``, `Esc`, or `exit`.

- Backtick is ignored while typing in any other input/textarea, so forms are unaffected. Inside the terminal's own prompt it closes the terminal.
- Konami only registers when you are not typing in a field.
- Up/Down arrows at the prompt cycle through command history.
- Slides down from the top, 46vh high (max 420px). It is always available, even when animations are disabled.

### Commands

| Command | What it does |
| --- | --- |
| `help` | Lists commands |
| `ls [projects\|art\|sections]` | Lists project ids, artwork ids, or nav sections (default: sections) |
| `goto <section>` / `cd <section>` | Smooth-scrolls to a section (matches nav id or label, e.g. `goto art-gallery`) |
| `play <project>` | Scrolls to the project and opens its live URL after a short delay; falls back to showing the GitHub link. Fuzzy: `play fisheyevo` finds Fish Evo |
| `whoami` | Name, title and tagline |
| `contact` | Prints email and scrolls to the contact section |
| `sudo hire idiovoidi` | Fake sudo prompt, then opens a `mailto:` to the contact email |
| `sudo <anything else>` | "you are not in the sudoers file. this incident will be reported to the void." |
| `eye` | "the eye is watching." |
| `rm` | "rm: the void does not forget" |
| `clear` | Clears output |
| `exit` / `quit` | Closes the terminal |

`eye` and `rm` are deliberately not listed in `help`.

Adding a command: add a `case` to the `switch` in `run()` in `VoidTerminal.tsx` (and to the `help` text unless it's meant to be secret).

## Idle decay

After 30 seconds with no mouse move, scroll, key, pointer or touch input, the page starts to rot:

- A CRT scanline overlay fades in over about 20s and slowly rolls.
- Visible text (headings, paragraphs, links, buttons, spans, labels) is randomly replaced with glyphs such as `▓▒░█#@%`. Corruption ramps from a couple of text nodes to many over roughly 60s, and some nodes heal at random so it flickers instead of just rotting.
- `h1`–`h3` get a red/cyan chromatic tear.

Any input snaps everything back and restores the original text.

Notes:
- Elements inside `[data-void-ignore]` are never scrambled (the terminal uses this). Add the attribute to anything that must stay readable.
- Disabled when the performance toggle has animations off, or the user prefers reduced motion. The terminal still works.
- The timeout is `IDLE_AFTER_MS` in `useVoidSignals.ts`; the overlay styles are under "Site-wide void gimmicks" in `globals.css`.

## Light mode button

The nav has a deliberately faint "☀️ Light Mode" button (the label is `CursedText`, stacking corrupted diacritics that spike periodically). Clicking it shows a red glitching modal for 3 seconds: "ERROR: THERE IS ONLY DARKNESS HERE!" There is no light mode.

## Void portal (hero)

The large swirling void behind the hero text follows the mouse with a jittery spring. It is clickable and keyboard accessible (`Enter`/`Space`, label "Pulse the void portal"); each activation spawns a mini pulse (up to 5 at a time).

## Console message

`printConsoleEasterEgg()` runs once from `main.tsx`. Opening devtools shows an ASCII "idiovoidi" banner, the contact email, and a hint about `` ` `` and `sudo hire idiovoidi`.

## Ambient glitch effects

Not hidden, but part of the same theme:

- `GlitchText`: random 400ms glitches on a timer (used on the Art Gallery title).
- `CursedText`: corrupted combining-mark text (nav light mode label).
- `CRTEffect`: CRT background for the Videos section.

## Internals: the void store

`src/utils/voidStore.ts` is a tiny shared store feeding the gimmicks:

- `cursorX` / `cursorY`: motion values, updated on pointer move without React renders.
- `idle` flag: set by `useVoidSignals` after `IDLE_AFTER_MS`.
- `mode`: `default`, `glitch` (cursor over `projects` or `three-d`) or `warm` (over `commercial`). Currently only tracked; no component renders anything from it yet, so it's a hook for a future custom cursor.
- `TERMINAL_TOGGLE_EVENT` (`void:terminal-toggle`): dispatch on `window` to toggle the terminal from anywhere, e.g. a footer link. Nothing dispatches it yet.

`VoidLayer` (mounted in `App.tsx`) wires it together: it runs `useVoidSignals` and renders `IdleDecay` (effects on only) plus `VoidTerminal` (always).
