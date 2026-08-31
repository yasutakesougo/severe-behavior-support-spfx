import * as React from "react";
import * as ReactDOM from "react-dom";
import { HumanReviewView } from "../../src/shell/monitoring/HumanReviewView";
import {
  HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE,
  HUMAN_REVIEW_MALFORMED_FIXTURE,
  humanReviewResultForSyntheticVersion,
} from "../../src/shell/monitoring/human-review-fixture";

function selectedResult() {
  const testCase = new URLSearchParams(window.location.search).get("case") ?? "v2";
  if (testCase === "v1") return humanReviewResultForSyntheticVersion(1);
  if (testCase === "v3") return humanReviewResultForSyntheticVersion(3);
  if (testCase === "mismatch") return HUMAN_REVIEW_CONTEXT_MISMATCH_FIXTURE;
  if (testCase === "malformed") return HUMAN_REVIEW_MALFORMED_FIXTURE;
  return humanReviewResultForSyntheticVersion(2);
}

const root = document.getElementById("root");
if (!root) throw new Error("human review smoke root missing");

ReactDOM.render(<HumanReviewView result={selectedResult()} personLabel="Aさん" />, root);
