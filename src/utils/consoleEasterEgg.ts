import { personalInfo } from "../data/personal";

const BANNER = String.raw`
 _     _ _                  _     _ _
(_) __| (_) _____   _____ (_) __| (_)
| |/ _' | |/ _ \ \ / / _ \| |/ _' | |
| | (_| | | (_) \ V / (_) | | (_| | |
|_|\__,_|_|\___/ \_/ \___/|_|\__,_|_|
`;

/** Printed once at startup for anyone who opens devtools. */
export function printConsoleEasterEgg() {
  console.log(
    `%c${BANNER}`,
    "color:#a78bfa;font-family:monospace;font-weight:bold",
  );
  console.log(
    `%cyou're looking in the right place. email me: ${personalInfo.email}`,
    "color:#67e8f9;font-size:14px;font-family:monospace",
  );
  console.log(
    "%cpsst: press ` for a terminal. try 'sudo hire idiovoidi'.",
    "color:#f9a8d4;font-family:monospace",
  );
}
