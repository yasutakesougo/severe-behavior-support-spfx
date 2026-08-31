import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HumanReviewView } from "./HumanReviewView";
import {
  HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE,
  HUMAN_REVIEW_MALFORMED_FIXTURE,
  humanReviewResultForSyntheticVersion,
} from "./human-review-fixture";

function render(result: ReturnType<typeof humanReviewResultForSyntheticVersion>): string {
  return renderToStaticMarkup(<HumanReviewView result={result} />);
}

describe("HumanReviewView", () => {
  it("renders exact V2 identity, facts, procedure versions, and human interpretation boundary", () => {
    const html = render(humanReviewResultForSyntheticVersion(2));

    expect(html).toContain("UserId: user-a");
    expect(html).toContain("planId: synthetic-plan-001");
    expect(html).toContain("計画版 2");
    expect(html).toContain("3件");
    expect(html.match(/data-human-review-record-id=/g)).toHaveLength(3);
    expect(html).toContain("synthetic-procedure-p2-v1");
    expect(html).toContain("一部変更して実施");
    expect(html).toContain("評価・承認・変更要否の判断は人が行います");
    expect(html).not.toContain("失敗");
  });

  it("renders zero records as a factual empty state without synthesizing NOT_PERFORMED", () => {
    const html = render(humanReviewResultForSyntheticVersion(1));

    expect(html).toContain("この計画版・対象期間に一致する実施記録はありません。");
    expect(html).toContain("0件");
    expect(html).not.toContain("実施できなかった");
    expect(html).not.toContain("data-human-review-record-id=");
  });

  it("renders parent mismatch and malformed states fail closed", () => {
    const mismatch = renderToStaticMarkup(
      <HumanReviewView result={HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE} />,
    );
    const malformed = renderToStaticMarkup(
      <HumanReviewView result={HUMAN_REVIEW_MALFORMED_FIXTURE} />,
    );

    expect(mismatch).toContain('data-human-review-status="CONTEXT_MISMATCH"');
    expect(mismatch).toContain("別の資料への置換は行いません");
    expect(malformed).toContain('data-human-review-status="MALFORMED_INPUT"');
    expect(malformed).toContain("見直し資料を安全に表示できません");
  });
});
