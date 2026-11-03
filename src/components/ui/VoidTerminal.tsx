import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { artworks } from "../../data/artworks";
import { navLinks } from "../../data/navigation";
import { personalInfo } from "../../data/personal";
import { projects } from "../../data/projects";
import { TERMINAL_TOGGLE_EVENT } from "../../utils/voidStore";

interface Line {
  id: number;
  kind: "in" | "out" | "err";
  text: string;
}

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const BANNER = [
  "idiovoidi void shell v0.1",
  "type 'help' for commands. ` or esc to close.",
];

const isTyping = (el: EventTarget | null) => {
  const t = el as HTMLElement | null;
  if (!t?.tagName) return false;
  return (
    t.tagName === "INPUT" ||
    t.tagName === "TEXTAREA" ||
    t.tagName === "SELECT" ||
    t.isContentEditable
  );
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return false;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 80,
    behavior: "smooth",
  });
  return true;
};

/** Fuzzy project lookup: "fisheyevo" and "fish-evo" both find Fish Evo. */
const findProject = (query: string) => {
  const q = norm(query);
  if (!q) return undefined;
  return (
    projects.find((p) => norm(p.id) === q || norm(p.title) === q) ??
    projects.find((p) => norm(p.id).includes(q) || norm(p.title).includes(q)) ??
    // fisheyevo -> fishevo: drop single letters that aren't in the target
    projects.find((p) => isSubsequence(norm(p.id), q))
  );
};

function isSubsequence(target: string, query: string) {
  if (target.length < 4 || query.length < target.length) return false;
  let i = 0;
  for (const ch of query) if (ch === target[i]) i++;
  return i === target.length;
}

export const VoidTerminal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const historyIdx = useRef(-1);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const konamiPos = useRef(0);

  const print = useCallback((kind: Line["kind"], ...texts: string[]) => {
    setLines((prev) => [
      ...prev,
      ...texts.map((text) => ({ id: nextId.current++, kind, text })),
    ]);
  }, []);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  // ` toggles, Konami opens, Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Backtick inside the terminal's own input closes it; any other
        // text field keeps its backtick.
        if (isTyping(e.target) && e.target !== inputRef.current) return;
        e.preventDefault();
        toggle();
        return;
      }
      if (e.key === "Escape") setOpen(false);

      if (isTyping(e.target)) return;
      const expected = KONAMI[konamiPos.current];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        konamiPos.current++;
        if (konamiPos.current === KONAMI.length) {
          konamiPos.current = 0;
          setOpen(true);
        }
      } else {
        konamiPos.current = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(TERMINAL_TOGGLE_EVENT, toggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(TERMINAL_TOGGLE_EVENT, toggle);
    };
  }, [toggle]);

  useEffect(() => {
    if (!open) return;
    if (lines.length === 0) print("out", ...BANNER);
    inputRef.current?.focus();
  }, [open, lines.length, print]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom whenever output changes
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmdline = raw.trim();
    print("in", `$ ${raw}`);
    if (!cmdline) return;
    history.current.push(cmdline);
    historyIdx.current = -1;

    const [cmd, ...args] = cmdline.split(/\s+/);
    const arg = args.join(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        print(
          "out",
          "  ls [projects|art|sections]   list things",
          "  goto <section>               scroll to a section",
          "  play <project>               go find a project (try: play fisheyevo)",
          "  whoami                       who",
          "  contact                      how to reach me",
          "  sudo hire idiovoidi          you know you want to",
          "  clear / exit                 tidy up",
        );
        break;

      case "ls": {
        const what = norm(arg) || "sections";
        if (what.startsWith("project")) {
          print(
            "out",
            ...projects.map((p) => `  ${p.id.padEnd(24)} ${p.category}`),
          );
        } else if (what === "art" || what === "artworks") {
          print("out", ...artworks.map((a) => `  ${a.id}`));
        } else if (what === "sections" || what === "." || what === "") {
          print("out", ...navLinks.map((n) => `  ${n.id}/`));
        } else {
          print("err", `ls: cannot access '${arg}': no such void`);
        }
        break;
      }

      case "goto":
      case "cd": {
        const target = arg.replace(/^\/|\/$/g, "");
        const link = navLinks.find(
          (n) => norm(n.id) === norm(target) || norm(n.label) === norm(target),
        );
        if (!target) print("err", `${cmd}: missing destination`);
        else if (link && scrollToId(link.id)) print("out", `-> ${link.id}`);
        else print("err", `${cmd}: ${target}: no such section`);
        break;
      }

      case "play": {
        if (!arg) {
          print("err", "play: which one? try 'ls projects'");
          break;
        }
        const project = findProject(arg);
        if (!project) {
          print("err", `play: '${arg}' not found. try 'ls projects'`);
          break;
        }
        print("out", `loading ${project.title}...`);
        if (!scrollToId(`project-${project.id}`)) scrollToId("projects");
        const url = project.liveUrl ?? project.githubUrl;
        if (project.liveUrl) {
          window.setTimeout(
            () => window.open(project.liveUrl, "_blank", "noopener"),
            700,
          );
          print("out", `launching ${project.liveUrl}`);
        } else if (url) {
          print("out", `no playable build yet. source: ${url}`);
        }
        break;
      }

      case "whoami":
        print(
          "out",
          `${personalInfo.name} — ${personalInfo.title}`,
          personalInfo.tagline,
        );
        break;

      case "contact":
        print("out", `email: ${personalInfo.email}`);
        scrollToId("contact");
        break;

      case "sudo":
        if (norm(arg) === "hireidiovoidi") {
          print(
            "out",
            "[sudo] password for recruiter: ********",
            "permission granted.",
            `compiling offer letter... opening mail to ${personalInfo.email}`,
          );
          window.setTimeout(() => {
            window.location.href = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
              "sudo hire idiovoidi",
            )}`;
          }, 900);
        } else if (!arg) {
          print("err", "usage: sudo <command>");
        } else {
          print(
            "err",
            `sudo: ${arg}: you are not in the sudoers file. this incident will be reported to the void.`,
          );
        }
        break;

      case "clear":
        setLines([]);
        break;

      case "exit":
      case "quit":
        setOpen(false);
        break;

      case "eye":
        print("out", "the eye is watching.");
        break;

      case "rm":
        print("err", "rm: the void does not forget");
        break;

      default:
        print("err", `${cmd}: command not found. try 'help'`);
    }
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation(); // keep page shortcuts out of the prompt
    if (e.key === "`") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (!h.length) return;
      const dir = e.key === "ArrowUp" ? -1 : 1;
      const cur = historyIdx.current === -1 ? h.length : historyIdx.current;
      const next = Math.min(Math.max(cur + dir, 0), h.length);
      historyIdx.current = next === h.length ? -1 : next;
      setInput(next === h.length ? "" : h[next]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="void-terminal"
          data-void-ignore
          role="dialog"
          aria-label="Void terminal"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => inputRef.current?.focus()}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "min(46vh, 420px)",
            zIndex: 9500,
            background: "rgba(5, 3, 13, 0.94)",
            borderBottom: "1px solid rgba(167, 139, 250, 0.5)",
            boxShadow: "0 8px 40px rgba(124, 58, 237, 0.35)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem",
            color: "#c4b5fd",
            display: "flex",
            flexDirection: "column",
            padding: "0.75rem 1rem",
            backdropFilter: "blur(6px)",
          }}
        >
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto" }}>
            {lines.map((l) => (
              <div
                key={l.id}
                style={{
                  whiteSpace: "pre-wrap",
                  color:
                    l.kind === "err"
                      ? "#f9a8d4"
                      : l.kind === "in"
                        ? "#67e8f9"
                        : undefined,
                }}
              >
                {l.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ color: "#67e8f9" }}>void@idiovoidi:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKey}
              aria-label="Terminal input"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f5f3ff",
                font: "inherit",
                caretColor: "#a78bfa",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoidTerminal;
