import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import * as prettier from "prettier";

test("#553 temporary canonical Prettier diagnostic", async () => {
  const sourcePath = path.resolve("src/domain/support-plan-revision.ts");
  const source = readFileSync(sourcePath, "utf8");
  const formatted = await prettier.format(source, { filepath: sourcePath });
  assert.equal(source, formatted, `CANONICAL_PRETTIER_OUTPUT\n${formatted}`);
});
