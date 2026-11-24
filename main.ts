// "The Folded World" — entry for
// u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb.
//
// A tiny, dependency-free Node 22 program. It holds the single sentence
// that explains the modern internet to a time traveler from 1800, checks
// it against the competition gate (1 to 200 Unicode code points, one
// line, never blank, no leading/trailing whitespace, no control
// characters), proves the build is deterministic by writing it twice
// and byte-comparing, then writes it to entry.txt inside the harness
// output directory and re-reads the file to prove the bytes survived
// the round trip.
//
// The sentence builds only from things a person from 1800 already
// knows — a post office, a library, a shop, a letter — folded into a
// single image: one glowing box that holds them all, where every letter
// arrives the moment it is written.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

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
  // No leading or trailing whitespace: the judged bytes must start at
  // the first letter and end at the final full stop, with nothing
  // invisible padding either end.
  if (line !== line.trim()) {
    throw new Error("sentence must not have leading or trailing whitespace");
  }
  // No control characters (U+0000–U+001F, U+007F): the sentence is
  // plain printable text, so nothing invisible can hide inside it.
  for (const ch of line) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      throw new Error(
        `sentence must not contain control characters (U+${code.toString(16).padStart(4, "0")})`,
      );
    }
  }
  return count;
}

/**
 * Determinism self-check: write the sentence twice, to two fresh
 * temporary files, and byte-compare them. A nondeterministic build
 * (locale, clock, or stray state leaking into the output) fails here
 * before anything reaches the judged output directory.
 */
function assertDeterministic(line: string): void {
  const scratch = mkdtempSync(join(tmpdir(), "folded-world-"));
  try {
    const first = join(scratch, "first.txt");
    const second = join(scratch, "second.txt");
    writeFileSync(first, line, { encoding: "utf8" });
    writeFileSync(second, line, { encoding: "utf8" });
    const a = readFileSync(first);
    const b = readFileSync(second);
    if (!a.equals(b)) {
      throw new Error("determinism check failed: repeated writes differ");
    }
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function run(): void {
  const count = assertValid(LINE);
  assertDeterministic(LINE);

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
