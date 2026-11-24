// "The Folded World" — entry for
// u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb.
//
// A tiny, dependency-free Node 22 program. It holds the single sentence
// that explains the modern internet to a time traveler from 1800, checks
// it against the competition gate (1 to 200 Unicode code points, one
// line, never blank), then writes it to entry.txt inside the harness
// output directory and re-reads the file to prove the bytes survived
// the round trip.
//
// The sentence builds only from things a person from 1800 already
// knows — a post office, a library, a shop, a letter — folded into a
// single image: one glowing box that holds them all, where every letter
// arrives the moment it is written.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// The sentence, exactly as it will be judged: the post office, the
// library, and every shop in the world, folded into one glowing box.
const LINE =
  "Imagine the post office, the library, and every shop in the world folded into one glowing box, where every letter arrives the moment it is written.";

const GATE_MIN = 1;
const GATE_MAX = 200;

/** Enforce the gate: one line, length counted in code points, not blank. */
function assertValid(line: string): number {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("sentence must stay on a single line");
  }
  const count = Array.from(line).length;
  if (count < GATE_MIN || count > GATE_MAX) {
    throw new Error(
      `sentence must be ${GATE_MIN}-${GATE_MAX} characters, got ${count}`,
    );
  }
  if (line.trim() === "") {
    throw new Error("sentence must not be blank");
  }
  return count;
}

function run(): void {
  const count = assertValid(LINE);

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = resolve(dir, "entry.txt");

  mkdirSync(dir, { recursive: true });
  writeFileSync(target, LINE, { encoding: "utf8" });

  const reread = readFileSync(target, "utf8");
  if (reread !== LINE) {
    throw new Error("verification failed: file content differs from the sentence");
  }

  console.log(`wrote ${target} (${count} characters)`);
  console.log(LINE);
}

run();
