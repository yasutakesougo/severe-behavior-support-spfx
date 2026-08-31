import * as React from "react";
import * as ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { act } from "react-dom/test-utils";
import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import { assembleSyntheticCapturedReview } from "./review-outcome-capture";
import { ReviewOutcomeCaptureView } from "./ReviewOutcomeCaptureView";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // Jest jsdom may omit TextEncoder; SHA-256 uses it. SPFx/browser have it.
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
  recordCount: 0,
  records: [],
  humanInterpretationRequired: true,
};

describe("ReviewOutcomeCaptureView", () => {
  it("renders an optional note with the exact helper and explicit non-production boundary", () => {
    const html = renderToStaticMarkup(
      <ReviewOutcomeCaptureView
        materials={MATERIALS}
        capturedReview={null}
        onCapture={() => ({ status: "INVALID" })}
      />,
    );
    expect(html).toContain("見直し結果: 未判断");
    expect(html).toContain("見直しの補足メモ（任意）");
    expect(html).toContain("見直し結果に添える短い補足です。次の計画内容ではありません。");
    expect(html).toContain("0 / 255");
    expect(html).toContain("変更なし");
    expect(html).toContain("変更が必要");
    expect(html).toContain("本番には保存されていません");
    expect(html).toContain('data-live-write-authorized="false"');
  });

  it("renders CHANGE_REQUIRED + memo readback and disables decision and note controls", () => {
    const result = assembleSyntheticCapturedReview(
      MATERIALS,
      "CHANGE_REQUIRED",
      "確認を継続",
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
    expect(html).toContain("デモ上の見直し結果: 変更が必要");
    expect(html).toContain("次の計画版はまだ作成されていません");
    expect(html).toContain("補足メモ: 確認を継続");
    expect(html).toContain('data-review-outcome-note-readback="true"');
    expect(html).toContain("本番には保存されていません");
    expect(html.match(/disabled=""/g)).toHaveLength(3);
    expect(html).not.toContain("次の計画版を作成");
  });

  it("resets uncommitted memo and error when the exact review context changes", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const onCapture = jest.fn(() => ({ status: "INVALID" as const }));

    act(() => {
      ReactDOM.render(
        <ReviewOutcomeCaptureView
          materials={MATERIALS}
          capturedReview={null}
          onCapture={onCapture}
        />,
        container,
      );
    });

    const textarea = container.querySelector<HTMLTextAreaElement>(
      '[data-review-outcome-note-input="true"]',
    );
    if (!textarea) throw new Error("expected note textarea");
    act(() => {
      textarea.value = "Aの未確定メモ";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => {
      container.querySelector<HTMLButtonElement>('[data-review-outcome-action="NO_CHANGE"]')?.click();
    });
    expect(container.textContent).toContain("見直し結果を安全に記録できません");

    act(() => {
      ReactDOM.render(
        <ReviewOutcomeCaptureView
          materials={{ ...MATERIALS, UserId: "user-b" }}
          capturedReview={null}
          onCapture={onCapture}
        />,
        container,
      );
    });

    const resetTextarea = container.querySelector<HTMLTextAreaElement>(
      '[data-review-outcome-note-input="true"]',
    );
    expect(resetTextarea?.value).toBe("");
    expect(container.textContent).toContain("0 / 255");
    expect(container.textContent).not.toContain("見直し結果を安全に記録できません");

    act(() => ReactDOM.unmountComponentAtNode(container));
    container.remove();
  });
});
