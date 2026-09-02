import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import { assembleSyntheticCapturedReview } from "./review-outcome-capture";
import { ReviewOutcomeCaptureView } from "./ReviewOutcomeCaptureView";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

const MATERIALS: HumanReviewMaterials = {
  OrganizationId: "org-a",
  SiteId: "site-a",
  UserId: "user-a",
  planId: "plan-a",
  planVersion: 3,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  recordCount: 1,
  records: [
    {
      RecordId: "record-a",
      ProcedureId: "procedure-1",
      ProcedureVersion: "v1",
      result: "PERFORMED_AS_PLANNED",
      performedAt: "2026-08-10T10:00:00+09:00",
      recordedAt: "2026-08-10T10:05:00+09:00",
    },
  ],
  humanInterpretationRequired: true,
};

describe("ReviewOutcomeCaptureView SBS-MGMT-LOOP-A MVP closure", () => {
  it("keeps CHANGE_REQUIRED readback minimal without forcing a separate review", () => {
    const result = assembleSyntheticCapturedReview(
      MATERIALS,
      "CHANGE_REQUIRED",
      "支援方法の再検討が必要",
      "",
      "2026-09-01T12:00:00+09:00",
    );
    if (result.status !== "CAPTURED") throw new Error("expected CAPTURED");

    const html = renderToStaticMarkup(
      <ReviewOutcomeCaptureView
        materials={MATERIALS}
        capturedReview={result.captured}
        onCapture={() => result}
      />,
    );

    expect(html).toContain('data-next-support-summary="true"');
    expect(html).toContain('data-current-review-epoch-bound="true"');
    expect(html).toContain('data-next-support-step="true"');
    expect(html).toContain('data-next-support-cue="true"');
    expect(html).toContain("次にすること");
    expect(html).toContain("支援内容を見直す");
    expect(html).toContain("この場で決められなければ、追加で検討します。");
    expect(html).toContain("判断理由: 支援方法の再検討が必要");
    expect(html).toContain("根拠 1件 · 計画版 3 · 対象期間 2026-08-01〜2026-08-31");
    expect(html).not.toContain("次回の支援検討");
    expect(html).not.toContain("次の計画版はまだ作成されていません");
    expect(html).not.toContain("計画はこの画面では変更されません。");
    expect(html).not.toContain("今回「変更が必要」と判断した理由と見直し資料を確認し");
    expect(html).not.toContain('data-review-outcome-reason-input="true"');
    expect(html).not.toContain('data-review-outcome-action="NO_CHANGE"');
    expect(html).not.toContain('data-review-outcome-action="CHANGE_REQUIRED"');
    expect((html.match(/本番には保存されていません/g) ?? [])).toHaveLength(1);
    expect(html).not.toContain("record-a");
  });

  it("keeps NO_CHANGE continuation explicit without repeated explanatory copy", () => {
    const result = assembleSyntheticCapturedReview(
      MATERIALS,
      "NO_CHANGE",
      "",
      "",
      "2026-09-01T12:00:00+09:00",
    );
    if (result.status !== "CAPTURED") throw new Error("expected CAPTURED");

    const html = renderToStaticMarkup(
      <ReviewOutcomeCaptureView
        materials={MATERIALS}
        capturedReview={result.captured}
        onCapture={() => result}
      />,
    );

    expect(html).toContain("デモ上の見直し結果: 変更なし");
    expect(html).toContain("次にすること");
    expect(html).toContain("次回のモニタリングへ");
    expect(html).toContain("根拠 1件 · 計画版 3 · 対象期間 2026-08-01〜2026-08-31");
    expect(html).not.toContain(
      "今回の見直し資料と支援記録を、次回のモニタリングでも確認します。",
    );
    expect(html).not.toContain('data-review-outcome-reason-input="true"');
    expect(html).not.toContain('data-review-outcome-action="NO_CHANGE"');
    expect(html).not.toContain('data-review-outcome-action="CHANGE_REQUIRED"');
    expect((html.match(/本番には保存されていません/g) ?? [])).toHaveLength(1);
    expect(html).not.toContain("次の計画版を作成");
    expect(html).not.toContain("record-a");
  });
});
