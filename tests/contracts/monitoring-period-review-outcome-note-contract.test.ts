import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import {
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
  MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION,
  normalizeMonitoringPeriodReviewOutcomeNote,
  toMonitoringPeriodReviewOutcomeNoteDto,
  validateMonitoringPeriodReviewOutcomeNoteDto,
} from "../../src/domain/monitoring-period-review-outcome-note";

describe("MonitoringPeriodReviewOutcomeNote contract", () => {
  it("locks schema identity, bounded memo size, and LIVE WRITE false", () => {
    assert.equal(
      MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_ID,
      "severe-behavior-support.monitoring-period-review.outcome-note",
    );
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_SCHEMA_VERSION, "1.0.0");
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH, 255);
    assert.equal(MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_LIVE_WRITE_AUTHORIZED, false);
  });

  it("round-trips the narrow DTO and rejects schema drift", () => {
    const result = normalizeMonitoringPeriodReviewOutcomeNote("outcome-001", "確認を継続");
    assert.equal(result.status, "VALID");
    if (result.status !== "VALID") throw new Error("expected VALID");
    const dto = toMonitoringPeriodReviewOutcomeNoteDto(result.note);
    assert.equal(validateMonitoringPeriodReviewOutcomeNoteDto(dto), true);
    assert.equal(
      validateMonitoringPeriodReviewOutcomeNoteDto({ ...dto, dtoVersion: "2.0.0" }),
      false,
    );
  });

  it("regenerates the checked-in narrow SPFx bridge byte-for-byte", () => {
    const repoRoot = process.cwd();
    const esbuildBin = path.join(
      repoRoot,
      "node_modules",
      "esbuild",
      "bin",
      "esbuild",
    );
    const tempDir = mkdtempSync(
      path.join(tmpdir(), "review-outcome-note-bridge-"),
    );
    const generatedPath = path.join(
      tempDir,
      "monitoring-period-review-outcome-note.bundle.js",
    );

    try {
      execFileSync(
        process.execPath,
        [
          esbuildBin,
          "src/domain/monitoring-period-review-outcome-note-spfx-entry.ts",
          "--bundle",
          "--format=cjs",
          "--target=es2015",
          "--platform=neutral",
          `--outfile=${generatedPath}`,
        ],
        { cwd: repoRoot, stdio: "pipe" },
      );

      const generated = readFileSync(generatedPath);
      const committed = readFileSync(
        path.join(
          repoRoot,
          "spfx/src/sbs-domain/monitoring-period-review-outcome-note.bundle.js",
        ),
      );
      if (!generated.equals(committed)) {
        console.error(`GENERATED_BUNDLE_BASE64=${generated.toString("base64")}`);
      }
      assert.deepEqual(
        committed,
        generated,
        "checked-in note bridge must equal canonical regeneration",
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
