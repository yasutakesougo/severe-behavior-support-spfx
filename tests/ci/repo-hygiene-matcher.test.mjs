import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";

import {
  BASELINE_BUNDLE_PATHS,
  BLOCKED_PATTERNS,
  evaluateBlockedPath,
  matchesPolicyPattern,
} from "../../scripts/ci/repo-hygiene-baseline.mjs";
import {
  EMPTY_TREE_SHA,
  MAX_RESULTING_BLOB_BYTES,
  buildDiffArgs,
  parseLsTreeZ,
  parseNameStatusZ,
  renderPath,
} from "../../scripts/ci/repo-hygiene-guard.mjs";

function nulTokens(...tokens) {
  return Buffer.from(`${tokens.join("\0")}\0`, "utf8");
}

test("generic blocked patterns match repository-relative POSIX paths", () => {
  assert.equal(evaluateBlockedPath("foo/bar/app.sppkg").blocked, true);
  assert.equal(evaluateBlockedPath("app.sppkg").blocked, true);
  assert.equal(evaluateBlockedPath("tmp/result.json").blocked, true);
  assert.equal(evaluateBlockedPath("output/report.txt").blocked, true);
  assert.equal(evaluateBlockedPath("foo/node_modules/pkg/index.js").blocked, true);
  assert.equal(evaluateBlockedPath("spfx/smoke/x/smoke-production.css").blocked, true);
});

test("root anchoring, exact-directory scope, and case sensitivity are preserved", () => {
  assert.equal(evaluateBlockedPath("nested/tmp/result.json").blocked, false);
  assert.equal(evaluateBlockedPath("foo/app.sppkg.txt").blocked, false);
  assert.equal(evaluateBlockedPath("build/pkg.sppkg").blocked, true);
  assert.equal(evaluateBlockedPath("build/pkg.SPPKG").blocked, false);
  assert.equal(evaluateBlockedPath("spfx/src/sbs-domain/sub/new.bundle.js").blocked, false);
});

test("frozen 10-path sbs-domain bundle baseline is literal and non-expanding", () => {
  assert.equal(Object.isFrozen(BASELINE_BUNDLE_PATHS), true);
  assert.equal(BASELINE_BUNDLE_PATHS.length, 10);
  assert.equal(new Set(BASELINE_BUNDLE_PATHS).size, 10);
  assert.throws(
    () => BASELINE_BUNDLE_PATHS.push("spfx/src/sbs-domain/new.bundle.js"),
    TypeError,
  );

  for (const path of BASELINE_BUNDLE_PATHS) {
    const result = evaluateBlockedPath(path);
    assert.equal(result.blocked, false, path);
    assert.equal(result.classification, "BASELINE_BUNDLE_ALLOWED", path);
  }

  assert.deepEqual(evaluateBlockedPath("spfx/src/sbs-domain/new.bundle.js"), {
    blocked: true,
    classification: "NON_BASELINE_SBS_DOMAIN_BUNDLE",
    pattern: "spfx/src/sbs-domain/*.bundle.js",
  });
  assert.deepEqual(evaluateBlockedPath("spfx/src/sbs-domain/new.bundle.d.ts"), {
    blocked: true,
    classification: "NON_BASELINE_SBS_DOMAIN_BUNDLE",
    pattern: "spfx/src/sbs-domain/*.bundle.d.ts",
  });
});

test("configured matcher has no bare-basename policy entries", () => {
  for (const pattern of BLOCKED_PATTERNS) {
    assert.equal(pattern.includes("/"), true, pattern);
  }
  assert.throws(() => matchesPolicyPattern("foo.txt", "*.txt"), /bare-basename/u);
});

test("name-status parser preserves TAB and LF inside path tokens", () => {
  const tabPath = "dir/tab\tname.txt";
  const lfPath = "dir/line\nname.txt";
  const parsed = parseNameStatusZ(nulTokens("A", tabPath, "M", lfPath));

  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].resultingPath, tabPath);
  assert.equal(parsed[1].resultingPath, lfPath);
});

test("name-status parser consumes R100 and C100 as old + resulting path pairs", () => {
  const parsed = parseNameStatusZ(
    nulTokens(
      "R100",
      "old/path.txt",
      "new/path.txt",
      "C100",
      "source/path.txt",
      "copy/path.txt",
    ),
  );

  assert.deepEqual(parsed[0], {
    status: "R100",
    kind: "R",
    oldPath: "old/path.txt",
    resultingPath: "new/path.txt",
    deletedPath: null,
  });
  assert.deepEqual(parsed[1], {
    status: "C100",
    kind: "C",
    oldPath: "source/path.txt",
    resultingPath: "copy/path.txt",
    deletedPath: null,
  });
});

test(
  "DELETE has no resulting path and therefore cannot trigger resulting-path policy by itself",
  () => {
    const [change] = parseNameStatusZ(nulTokens("D", "tmp/old-result.json"));
    assert.equal(change.kind, "D");
    assert.equal(change.resultingPath, null);
    assert.equal(change.deletedPath, "tmp/old-result.json");
  },
);

test("malformed or truncated NUL streams fail closed", () => {
  assert.throws(
    () => parseNameStatusZ(Buffer.from("A\0path-without-final-nul", "utf8")),
    /TRUNCATED_NUL_STREAM/u,
  );
  assert.throws(
    () => parseNameStatusZ(nulTokens("R100", "only-old-path")),
    /MALFORMED_RENAME_COPY_STATUS/u,
  );
});

test("invalid UTF-8 path bytes fail closed", () => {
  const input = Buffer.concat([Buffer.from("A\0", "ascii"), Buffer.from([0xff, 0x00])]);
  assert.throws(() => parseNameStatusZ(input), /INVALID_UTF8_PATH/u);
});

test("ls-tree parser accepts one exact blob record", () => {
  const sha = "a".repeat(40);
  const path = "dir/tab\tname.txt";
  const parsed = parseLsTreeZ(nulTokens(`100644 blob ${sha}\t${path}`));
  assert.equal(parsed.type, "blob");
  assert.equal(parsed.sha, sha);
  assert.equal(parsed.path, path);
  assert.equal(parsed.pathBytes.equals(Buffer.from(path, "utf8")), true);
});

test("ls-tree parser rejects zero, multiple, malformed, and non-blob records", () => {
  assert.throws(() => parseLsTreeZ(Buffer.alloc(0)), /LS_TREE_ZERO_RECORDS/u);
  assert.throws(
    () =>
      parseLsTreeZ(
        nulTokens(
          `100644 blob ${"a".repeat(40)}\ta.txt`,
          `100644 blob ${"b".repeat(40)}\tb.txt`,
        ),
      ),
    /LS_TREE_MULTIPLE_RECORDS/u,
  );
  assert.throws(
    () => parseLsTreeZ(nulTokens("not-ls-tree")),
    /LS_TREE_MALFORMED_RECORD/u,
  );

  const treeRecord = parseLsTreeZ(nulTokens(`040000 tree ${"c".repeat(40)}\tdir`));
  assert.equal(treeRecord.type, "tree");
});

test("PR diff is three-dot and push diff is always exact two-point", () => {
  const baseSha = "1".repeat(40);
  const headSha = "2".repeat(40);
  const beforeSha = "3".repeat(40);
  const afterSha = "4".repeat(40);

  const prArgs = buildDiffArgs({ eventName: "pull_request_target", baseSha, headSha });
  assert.deepEqual(prArgs.slice(-1), [`${baseSha}...${headSha}`]);

  const pushArgs = buildDiffArgs({ eventName: "push", beforeSha, afterSha });
  assert.deepEqual(pushArgs.slice(-2), [beforeSha, afterSha]);
  assert.equal(pushArgs.some((arg) => arg.includes("...")), false);
});

test("non-fast-forward push fixture still uses before -> after two-point transition", () => {
  const beforeSha = "5".repeat(40);
  const afterSha = "6".repeat(40);
  const args = buildDiffArgs({ eventName: "push", beforeSha, afterSha });
  assert.deepEqual(args.slice(-2), [beforeSha, afterSha]);
});

test("ZERO_SHA push uses the locked Git empty tree", () => {
  const afterSha = "7".repeat(40);
  const args = buildDiffArgs({ eventName: "push", beforeSha: "0".repeat(40), afterSha });
  assert.deepEqual(args.slice(-2), [EMPTY_TREE_SHA, afterSha]);
});

test("path logging is deterministic JSON escaping and cannot create extra physical lines", () => {
  const rendered = renderPath("evil\nPASS\tFAIL\rGUARD_ERROR");
  assert.equal(rendered, '"evil\\nPASS\\tFAIL\\rGUARD_ERROR"');
  assert.equal(rendered.includes("\n"), false);
  assert.equal(rendered.includes("\r"), false);
});

test("large-blob limit is exactly 2 MiB", () => {
  assert.equal(MAX_RESULTING_BLOB_BYTES, 2 * 1024 * 1024);
});
