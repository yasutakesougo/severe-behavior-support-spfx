import * as React from "react";
import * as ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { act, Simulate } from "react-dom/test-utils";
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

function materialsWithRecord(recordId: string): HumanReviewMaterials {
  return {
    ...MATERIALS,
    recordCount: 1,
    records: [
      {
        RecordId: recordId,
        ProcedureId: "procedure-1",
        ProcedureVersion: "v1",
        result: "PERFORMED_AS_PLANNED",
        performedAt: "2026-08-10T10:00:00+09:00",
        recordedAt: "2026-08-10T10:05:00+09:00",
      },
    ],
  };
}

function enterText(textarea: HTMLTextAreaElement, value: string): void {
  textarea.value = value;
  Simulate.change(textarea);
}

describe("ReviewOutcomeCaptureView", () => {
  it("F1 renders decisionReason as the only staff-facing writable text input", () => {
    const html = renderToStaticMarkup(
      <ReviewOutcomeCaptureView
        materials={MATERIALS}
        capturedReview={null}
        onCapture={() => ({ status: "INVALID" })}
      />,
    );
    expect(html).toContain("見直し結果: 未判断");
    expect(html).toContain("判断理由");
    expect(html).toContain(
      "見直し結果を選んだ理由です。「変更が必要」の場合は入力してください。",
    );
    expect(html).toContain("変更なし");
    expect(html).toContain("変更が必要");
    expect(html).toContain("本番には保存されていません");
    expect(html).toContain('data-live-write-authorized="false"');
    expect(html).toContain('data-review-outcome-reason-input="true"');
    expect(html).not.toContain('data-review-outcome-note-input="true"');
    expect(html).not.toContain("見直しの補足メモ（任意）");
    expect(html).not.toContain("0 / 255");
    expect(html.match(/<textarea/g)).toHaveLength(1);
  });

  it("preserves non-null legacy/session note readback without restoring a writable note input", () => {
    const result = assembleSyntheticCapturedReview(
      MATERIALS,
      "CHANGE_REQUIRED",
      "支援方法の再検討が必要",
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
    expect(html).toContain("判断理由: 支援方法の再検討が必要");
    expect(html).toContain("補足メモ: 確認を継続");
    expect(html).toContain('data-review-outcome-reason-readback="true"');
    expect(html).toContain('data-review-outcome-note-readback="true"');
    expect(html).not.toContain('data-review-outcome-note-input="true"');
    expect(html).toContain("本番には保存されていません");
    expect(html.match(/disabled=""/g)).toHaveLength(3);
    expect(html).not.toContain("次の計画版を作成");
  });

  it("F2 blocks CHANGE_REQUIRED with blank reason before calling capture", () => {
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

    act(() => {
      container
        .querySelector<HTMLButtonElement>('[data-review-outcome-action="CHANGE_REQUIRED"]')
        ?.click();
    });

    expect(onCapture).not.toHaveBeenCalled();
    expect(container.textContent).toContain(
      "「変更が必要」を記録する場合は、判断理由を入力してください。",
    );

    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });

  it("F5 passes an empty note draft through the existing capture contract", () => {
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

    act(() => {
      container
        .querySelector<HTMLButtonElement>('[data-review-outcome-action="NO_CHANGE"]')
        ?.click();
    });

    expect(onCapture).toHaveBeenCalledWith("NO_CHANGE", "", "");
    expect(container.querySelector('[data-review-outcome-note-input="true"]')).toBeNull();

    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });

  it("resets uncommitted reason and error when the exact review context changes", () => {
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

    const reason = container.querySelector<HTMLTextAreaElement>(
      '[data-review-outcome-reason-input="true"]',
    );
    if (!reason) throw new Error("expected reason textarea");
    expect(container.querySelector('[data-review-outcome-note-input="true"]')).toBeNull();
    act(() => enterText(reason, "Aの判断理由"));
    act(() => {
      container
        .querySelector<HTMLButtonElement>('[data-review-outcome-action="NO_CHANGE"]')
        ?.click();
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

    expect(
      container.querySelector<HTMLTextAreaElement>('[data-review-outcome-reason-input="true"]')
        ?.value,
    ).toBe("");
    expect(container.querySelector('[data-review-outcome-note-input="true"]')).toBeNull();
    expect(container.textContent).not.toContain("見直し結果を安全に記録できません");

    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });

  it("R11 resets uncommitted reason and error when evidence changes under same base context", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const materialsA = materialsWithRecord("record-a");
    const materialsB = materialsWithRecord("record-b");
    const onCapture = jest.fn(() => ({ status: "INVALID" as const }));

    act(() => {
      ReactDOM.render(
        <ReviewOutcomeCaptureView
          materials={materialsA}
          capturedReview={null}
          onCapture={onCapture}
        />,
        container,
      );
    });
    const reason = container.querySelector<HTMLTextAreaElement>(
      '[data-review-outcome-reason-input="true"]',
    );
    if (!reason) throw new Error("expected reason textarea");
    act(() => enterText(reason, "snapshot A reason"));
    act(() => {
      container
        .querySelector<HTMLButtonElement>('[data-review-outcome-action="NO_CHANGE"]')
        ?.click();
    });
    expect(container.textContent).toContain("見直し結果を安全に記録できません");

    act(() => {
      ReactDOM.render(
        <ReviewOutcomeCaptureView
          materials={materialsB}
          capturedReview={null}
          onCapture={onCapture}
        />,
        container,
      );
    });

    expect(
      container.querySelector<HTMLTextAreaElement>('[data-review-outcome-reason-input="true"]')
        ?.value,
    ).toBe("");
    expect(container.querySelector('[data-review-outcome-note-input="true"]')).toBeNull();
    expect(container.textContent).not.toContain("見直し結果を安全に記録できません");

    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });

  it("R12 clears captured-epoch reason buffer before next evidence snapshot", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const materialsA = materialsWithRecord("record-a");
    const materialsB = materialsWithRecord("record-b");
    const capturedA = assembleSyntheticCapturedReview(
      materialsA,
      "CHANGE_REQUIRED",
      "snapshot A reason",
      "snapshot A memo",
      "2026-09-01T12:00:00+09:00",
    );
    if (capturedA.status !== "CAPTURED") throw new Error("expected captured A");
    const onCapture = jest.fn(() => capturedA);

    act(() => {
      ReactDOM.render(
        <ReviewOutcomeCaptureView
          materials={materialsA}
          capturedReview={null}
          onCapture={onCapture}
        />,
        container,
      );
    });
    const reason = container.querySelector<HTMLTextAreaElement>(
      '[data-review-outcome-reason-input="true"]',
    );
    if (!reason) throw new Error("expected reason textarea");
    act(() => enterText(reason, "snapshot A reason"));
    act(() => {
      container
        .querySelector<HTMLButtonElement>('[data-review-outcome-action="CHANGE_REQUIRED"]')
        ?.click();
    });

    act(() => {
      ReactDOM.render(
        <ReviewOutcomeCaptureView
          materials={materialsA}
          capturedReview={capturedA.captured}
          onCapture={onCapture}
        />,
        container,
      );
    });
    expect(container.textContent).toContain("判断理由: snapshot A reason");
    expect(container.textContent).toContain("補足メモ: snapshot A memo");
    expect(
      container.querySelector<HTMLTextAreaElement>('[data-review-outcome-reason-input="true"]')
        ?.disabled,
    ).toBe(true);
    expect(container.querySelector('[data-review-outcome-note-input="true"]')).toBeNull();

    act(() => {
      ReactDOM.render(
        <ReviewOutcomeCaptureView
          materials={materialsB}
          capturedReview={null}
          onCapture={onCapture}
        />,
        container,
      );
    });

    const resetReason = container.querySelector<HTMLTextAreaElement>(
      '[data-review-outcome-reason-input="true"]',
    );
    expect(resetReason?.value).toBe("");
    expect(resetReason?.disabled).toBe(false);
    expect(container.querySelector('[data-review-outcome-note-input="true"]')).toBeNull();
    expect(container.textContent).toContain("見直し結果: 未判断");
    expect(container.textContent).not.toContain("判断理由: snapshot A reason");
    expect(container.textContent).not.toContain("補足メモ: snapshot A memo");

    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });
});