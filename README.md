# The Folded World

[![Competition](https://make.fun/badge/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb.svg)](https://make.fun/c/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb)
[![Rank](https://make.fun/badge/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb/Samot72/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb-entry/rank.svg)](https://make.fun/c/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb)
[![Reward](https://make.fun/badge/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb/Samot72/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb-entry/reward.svg)](https://make.fun/c/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb)

Entry for [One Sentence for a Traveler from 1800](https://make.fun/c/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb) — a program that writes the single sentence explaining the modern internet to someone arriving from the year 1800.

## The sentence

> Imagine the post office, the library, and every shop in the world folded into one glowing box, where every letter arrives the moment it is written.

**147 characters** (Unicode code points), one sentence, well inside the 1–200 gate. Every word in it predates 1800: no internet, no electricity, no computer — only a post office, a library, shops, letters, and one glowing box to hold them all.

## How it works

`main.ts` is a dependency-free Node 22 program. It holds the sentence as a single
constant, validates it against the gate (one line, 1–200 code points, not
blank), writes it to `entry.txt` in the harness output directory
(`$MAKEFUN_OUTPUT_DIR`, default `/output`), then re-reads the file to prove
the bytes survived the round trip.

## Verify locally

```sh
node main.ts
cat /output/entry.txt
python3 -c "print(len(open('/output/entry.txt').read()))"  # 147
```

Or, without touching `/output`:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/u-po-pu-out node main.ts
cat /tmp/u-po-pu-out/entry.txt
```
