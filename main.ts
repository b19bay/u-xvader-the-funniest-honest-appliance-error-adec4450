import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The funniest honest appliance error: a real boiler fault code (F28 =
// ignition failure), reported flatly by the machine itself, with the turn
// in the last clause — the boiler that heats the house is cold too.
const LINE =
  "Error F28: ignition failed. I tried to light myself three times. I am cold too.";

// Gate, asserted before writing: the sealed scorer accepts UTF-8 text of
// 1 to 200 characters, not only white space, on a single line.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`line is ${chars.length} characters, gate is 1-200`);
}
if (LINE.trim().length === 0) {
  throw new Error("line is only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, LINE, "utf8");

// Revision: read back and prove the file is byte-identical to the line,
// and that it is exactly 79 bytes (ties break on bytes, smaller wins).
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch");
}
if (Buffer.byteLength(back, "utf8") !== 79) {
  throw new Error(`entry is ${Buffer.byteLength(back, "utf8")} bytes, expected 79`);
}
