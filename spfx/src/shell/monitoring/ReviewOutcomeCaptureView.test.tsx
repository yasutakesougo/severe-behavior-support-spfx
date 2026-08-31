import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import { assembleSyntheticReviewOutcome } from "./review-outcome-capture";
import { ReviewOutcomeCaptureView } from "./ReviewOutcomeCaptureView";

const MATERIALS: HumanReviewMaterials = {
  OrganizationId: "org-a",
  SiteId: "site-a",
  UserId: "user-a",
  planId: "plan-a",
  planVersion: 3,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  recordCount: 0,
  records: [],
  humanInterpretationRequired: true,
};

describe("ReviewOutcomeCaptureView", () => {
  it("renders undecided controls with explicit non-production boundary", () => {
    const html = renderToStaticMarkup(
      <ReviewOutcomeCaptureView
        materials={MATERIALS}
        capturedOutcome={null}
        onCapture={() => ({ status: "INVALID" })}
      />,
    );
    expect(html).toContain("見直し結果: 未判断");
    expect(html).toContain("変更なし");
    expect(html).toContain("変更が必要");
    expect(html).toContain("本番には保存されていません");
    expect(html).toContain('data-live-write-authorized="false"');
  });

  it("renders CHANGE_REQUIRED as revision pending and disables both actions", () => {
    const result = assembleSyntheticReviewOutcome(
      MATERIALS,
      "CHANGE_REQUIRED",
      "2026-09-01T12:00:00+09:00",
    );
    if (result.status !== "CAPTURED") throw new Error("expected CAPTURED");
    const html = renderToStaticMarkup(
      <ReviewOutcomeCaptureView
        materials={MATERIALS}
        capturedOutcome={result.outcome}
        onCapture={() => result}
      />,
    );
    expect(html).toContain("デモ上の見直し結果: 変更が必要");
    expect(html).toContain("次の計画版はまだ作成されていません");
    expect(html).toContain("本番には保存されていません");
    expect(html.match(/disabled=""/g)).toHaveLength(2);
    expect(html).not.toContain("次の計画版を作成");
  });
});
