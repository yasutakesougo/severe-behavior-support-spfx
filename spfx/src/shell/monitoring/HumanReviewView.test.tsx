import * as React from "react";
import * as ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { act } from "react-dom/test-utils";
import { HumanReviewView, type HumanReviewProcedureLabelContext } from "./HumanReviewView";
import {
  HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE,
  HUMAN_REVIEW_MALFORMED_FIXTURE,
  humanReviewResultForSyntheticVersion,
} from "./human-review-fixture";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "../users/support-plan-fixture";

const PROCEDURE_LABEL_CONTEXT: HumanReviewProcedureLabelContext = {
  userId: DEMO_UX_SUPPORT_PLAN_FIXTURE.userId,
  planId: DEMO_UX_SUPPORT_PLAN_FIXTURE.planId,
  currentVersion: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion,
  currentProcedures: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures,
};

function render(
  result: ReturnType<typeof humanReviewResultForSyntheticVersion>,
  procedureLabelContext: HumanReviewProcedureLabelContext = PROCEDURE_LABEL_CONTEXT,
): string {
  return renderToStaticMarkup(
    <HumanReviewView
      result={result}
      personLabel="Aさん"
      procedureLabelContext={procedureLabelContext}
    />,
  );
}

describe("HumanReviewView", () => {
  it("renders human-friendly identity before technical identity while preserving exact facts", () => {
    const html = render(humanReviewResultForSyntheticVersion(2));

    expect(html).toContain("Aさん");
    expect(html).toContain('data-human-review-person-identity="true"');
    expect(html).toContain('data-human-review-role-cue="materials"');
    expect(html).toContain("個別の事実資料");
    expect(html.indexOf("Aさん")).toBeLessThan(html.indexOf("UserId user-a"));
    expect(html.indexOf("Aさん")).toBeLessThan(html.indexOf("計画版 2"));
    expect(html).toContain("UserId user-a");
    expect(html).toContain("planId synthetic-plan-001");
    expect(html).toContain('data-human-review-technical-detail="true"');
    expect(html).toContain("計画版 2");
    expect(html).toContain("3件");
    expect(html.match(/data-human-review-record-id=/g)).toHaveLength(3);
    expect(html).toContain("synthetic-procedure-p2-v1");
    expect(html).toContain("一部変更して実施");
    expect(html).toContain("評価・承認・変更要否の判断は人が行います");
    expect(html).not.toContain("失敗");
    expect(html).not.toContain("版管理");
  });

  it("renders an evidenced sceneLabel before canonical technical identity for one exact current match", () => {
    const html = render(humanReviewResultForSyntheticVersion(3));
    const sceneLabel = DEMO_UX_SUPPORT_PLAN_FIXTURE.currentProcedures[0].sceneLabel;

    expect(html).toContain(sceneLabel);
    expect(html).toContain('data-human-review-scene-label="true"');
    expect(html.indexOf(sceneLabel)).toBeLessThan(html.indexOf("synthetic-procedure-p3"));
    expect(html).toContain("synthetic-procedure-p3-v1");
  });

  it("fails closed to canonical technical identity for historical or mismatched source context", () => {
    const historicalHtml = render(humanReviewResultForSyntheticVersion(2));
    expect(historicalHtml).not.toContain('data-human-review-scene-label="true"');
    expect(historicalHtml).toContain("synthetic-procedure-p2");
    expect(historicalHtml).toContain("synthetic-procedure-p2-v1");

    const wrongUserContext: HumanReviewProcedureLabelContext = {
      ...PROCEDURE_LABEL_CONTEXT,
      userId: "user-b",
    };
    const wrongUserHtml = render(humanReviewResultForSyntheticVersion(3), wrongUserContext);
    expect(wrongUserHtml).not.toContain('data-human-review-scene-label="true"');
    expect(wrongUserHtml).toContain("synthetic-procedure-p3");
  });

  it("does not show a sceneLabel when the exact procedure match is ambiguous", () => {
    const duplicatedContext: HumanReviewProcedureLabelContext = {
      ...PROCEDURE_LABEL_CONTEXT,
      currentProcedures: [
        ...PROCEDURE_LABEL_CONTEXT.currentProcedures,
        ...PROCEDURE_LABEL_CONTEXT.currentProcedures,
      ],
    };
    const html = render(humanReviewResultForSyntheticVersion(3), duplicatedContext);

    expect(html).not.toContain('data-human-review-scene-label="true"');
    expect(html).toContain("synthetic-procedure-p3");
  });

  it("renders zero records as factual absence without synthesizing NOT_PERFORMED", () => {
    const html = render(humanReviewResultForSyntheticVersion(1));

    expect(html).toContain("この計画版・対象期間に一致する実施記録はありません。");
    expect(html).toContain("0件であることは、「実施できなかった」という結果を意味しません。");
    expect(html).toContain("0件");
    expect(html).not.toContain("data-human-review-record-id=");
  });

  it("exposes a stable in-page review-materials anchor", () => {
    const html = render(humanReviewResultForSyntheticVersion(2));
    expect(html).toContain('id="human-review-materials"');
  });

  it("renders parent mismatch and malformed states fail closed", () => {
    const mismatch = renderToStaticMarkup(
      <HumanReviewView result={HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE} personLabel="Aさん" />,
    );
    const malformed = renderToStaticMarkup(
      <HumanReviewView result={HUMAN_REVIEW_MALFORMED_FIXTURE} personLabel="Aさん" />,
    );

    expect(mismatch).toContain('data-human-review-status="CONTEXT_MISMATCH"');
    expect(mismatch).toContain("別の資料への置換は行いません");
    expect(malformed).toContain('data-human-review-status="MALFORMED_INPUT"');
    expect(malformed).toContain("見直し資料を安全に表示できません");
  });

  it("remounts the capture view so a context switch clears the memo on the first B render", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const baseResult = humanReviewResultForSyntheticVersion(3);
    if (baseResult.status !== "RESOLVED") throw new Error("expected resolved review materials");

    const resultForUser = (
      userId: string,
    ): ReturnType<typeof humanReviewResultForSyntheticVersion> => ({
      status: "RESOLVED" as const,
      value: { ...baseResult.value, UserId: userId },
    });
    const onCapture = jest.fn(() => ({ status: "INVALID" as const }));
    const firstBRenderNote = jest.fn<void, [string]>();

    const ContextSwitchHarness: React.FC = () => {
      const [userId, setUserId] = React.useState("user-a");
      const result = resultForUser(userId);

      React.useLayoutEffect(() => {
        if (userId !== "user-b") return;
        const textarea = container.querySelector<HTMLTextAreaElement>(
          '[data-review-outcome-note-input="true"]',
        );
        firstBRenderNote(textarea?.value ?? "");
      }, [userId]);

      return (
        <>
          <button type="button" onClick={() => setUserId("user-b")} data-switch-context="true">
            Bさんへ切替
          </button>
          <HumanReviewView
            result={result}
            personLabel={userId === "user-a" ? "Aさん" : "Bさん"}
            capturedReview={null}
            onCaptureOutcome={onCapture}
          />
        </>
      );
    };

    act(() => {
      ReactDOM.render(<ContextSwitchHarness />, container);
    });

    const textarea = container.querySelector<HTMLTextAreaElement>(
      '[data-review-outcome-note-input="true"]',
    );
    if (!textarea) throw new Error("expected note textarea");
    act(() => {
      textarea.value = "Aの未確定メモ";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(textarea.value).toBe("Aの未確定メモ");

    act(() => {
      container.querySelector<HTMLButtonElement>('[data-switch-context="true"]')?.click();
    });

    expect(container.querySelector('[data-human-review-person-identity="true"]')?.textContent).toBe(
      "Bさん",
    );
    expect(firstBRenderNote).toHaveBeenCalledWith("");
    expect(
      container.querySelector<HTMLTextAreaElement>('[data-review-outcome-note-input="true"]')
        ?.value,
    ).toBe("");

    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });
});
