import * as React from "react";
import * as ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { renderToStaticMarkup } from "react-dom/server";
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

const MATERIALS_B: HumanReviewMaterials = {
  ...MATERIALS,
  UserId: "user-b",
  planVersion: 4,
};

describe("ReviewOutcomeCaptureView", () => {
  it("renders optional memo controls with the non-production boundary", () => {
    const html = renderToStaticMarkup(
      <ReviewOutcomeCaptureView
        materials={MATERIALS}
        capturedReview={null}
        onCapture={() => ({ status: "INVALID" })}
      />,
    );
    expect(html).toContain("見直し結果: 未判断");
    expect(html).toContain("見直しの補足メモ（任意）");
    expect(html).toContain("次の計画内容ではありません");
    expect(html).toContain("0 / 255");
    expect(html).toContain("本番には保存されていません");
    expect(html).toContain('data-live-write-authorized="false"');
  });

  it(
    "renders CHANGE_REQUIRED memo readback and disables textarea plus both actions",
    () => {
      const result = assembleSyntheticCapturedReview(
        MATERIALS,
        "CHANGE_REQUIRED",
        "次回見直しで再確認",
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
      expect(html).toContain("補足メモ: 次回見直しで再確認");
      expect(html).toContain("次の計画版はまだ作成されていません");
      expect(html).toContain("本番には保存されていません");
      expect(html.match(/disabled=""/g)).toHaveLength(3);
      expect(html).not.toContain("次の計画版を作成");
    },
  );

  it("resets uncommitted memo and error when the exact review context changes", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const invalidCapture = jest.fn(() => ({ status: "INVALID" as const }));

    try {
      act(() => {
        ReactDOM.render(
          <ReviewOutcomeCaptureView
            materials={MATERIALS}
            capturedReview={null}
            onCapture={invalidCapture}
          />,
          container,
        );
      });

      const textarea = container.querySelector(
        '[data-review-outcome-note-input="true"]',
      ) as HTMLTextAreaElement;
      act(() => {
        Simulate.change(textarea, { target: { value: "Aの未確定メモ" } });
      });
      expect(textarea.value).toBe("Aの未確定メモ");

      const action = container.querySelector(
        '[data-review-outcome-action="NO_CHANGE"]',
      ) as HTMLButtonElement;
      act(() => {
        Simulate.click(action);
      });
      expect(container.querySelector('[role="alert"]')).toBeTruthy();

      act(() => {
        ReactDOM.render(
          <ReviewOutcomeCaptureView
            materials={MATERIALS_B}
            capturedReview={null}
            onCapture={invalidCapture}
          />,
          container,
        );
      });

      const nextTextarea = container.querySelector(
        '[data-review-outcome-note-input="true"]',
      ) as HTMLTextAreaElement;
      expect(nextTextarea.value).toBe("");
      expect(
        container.querySelector('[data-review-outcome-note-count="true"]')?.textContent,
      ).toContain("0 / 255");
      expect(container.querySelector('[role="alert"]')).toBeNull();
    } finally {
      act(() => {
        ReactDOM.unmountComponentAtNode(container);
      });
      document.body.removeChild(container);
    }
  });
});
