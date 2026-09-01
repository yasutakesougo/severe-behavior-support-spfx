import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { format } from "prettier";
import {
  MONITORING_PERIOD_REVIEW_DECISION_REASON_LIVE_WRITE_AUTHORIZED,
  MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID,
  MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION,
  normalizeMonitoringPeriodReviewDecisionReason,
  toMonitoringPeriodReviewDecisionReasonDto,
  validateMonitoringPeriodReviewDecisionReasonDto,
} from "../../src/domain/monitoring-period-review-decision-reason";

describe("MonitoringPeriodReviewDecisionReason contract", () => {
  it("locks schema identity and LIVE WRITE false", () => {
    assert.equal(
      MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_ID,
      "severe-behavior-support.monitoring-period-review.decision-reason",
    );
    assert.equal(MONITORING_PERIOD_REVIEW_DECISION_REASON_SCHEMA_VERSION, "1.0.0");
    assert.equal(
      MONITORING_PERIOD_REVIEW_DECISION_REASON_LIVE_WRITE_AUTHORIZED,
      false,
    );
  });

  it("round-trips the narrow DTO and rejects schema drift", () => {
    const result = normalizeMonitoringPeriodReviewDecisionReason(
      "outcome-001",
      "変更が必要な理由",
    );
    assert.equal(result.status, "VALID");
    if (result.status !== "VALID") throw new Error("expected VALID");
    const dto = toMonitoringPeriodReviewDecisionReasonDto(result.reason);
    assert.equal(validateMonitoringPeriodReviewDecisionReasonDto(dto), true);
    assert.equal(
      validateMonitoringPeriodReviewDecisionReasonDto({
        ...dto,
        dtoVersion: "2.0.0",
      }),
      false,
    );
  });

  it("regenerates the checked-in narrow SPFx bridge byte-for-byte", async () => {
    const repoRoot = process.cwd();
    const require = createRequire(import.meta.url);
    const esbuildBin = require.resolve("esbuild/bin/esbuild");
    const tempDir = mkdtempSync(
      path.join(tmpdir(), "review-decision-reason-bridge-"),
    );
    const generatedPath = path.join(
      tempDir,
      "monitoring-period-review-decision-reason.bundle.js",
    );

    try {
      execFileSync(
        esbuildBin,
        [
          "src/domain/monitoring-period-review-decision-reason-spfx-entry.ts",
          "--bundle",
          "--format=cjs",
          "--target=es2015",
          "--platform=neutral",
          `--outfile=${generatedPath}`,
        ],
        { cwd: repoRoot, stdio: "pipe" },
      );

      const generated = Buffer.from(
        await format(readFileSync(generatedPath, "utf8"), {
          parser: "babel",
        }),
      );
      const committed = readFileSync(
        path.join(
          repoRoot,
          "spfx/src/sbs-domain/monitoring-period-review-decision-reason.bundle.js",
        ),
      );
      assert.deepEqual(
        committed,
        generated,
        "checked-in reason bridge must equal canonical esbuild + Prettier regeneration",
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
