/** Pilot registry — Slice-A #552 + Slice-B Second Pilot #548. */
export const PILOTS = {
  552: {
    issue: 552,
    pr: 563,
    evidencePaths: ["docs/architecture/sbs-mgmt-loop-a-implementation-evidence.md"],
    sliceBindPaths: [
      "docs/architecture/asana-style-delegation-slice-a-implementation-start-readback-1.md",
    ],
    supplementaryPr: 563,
  },
  548: {
    issue: 548,
    pr: 548,
    evidencePaths: [
      "docs/architecture/review-to-plan-revision-relationship-implementation-evidence.md",
    ],
    sliceBindPaths: [
      "docs/architecture/asana-style-delegation-slice-b-second-pilot-selection-1.md",
    ],
    supplementaryPr: 548,
  },
};

export function getPilot(issueNumber) {
  const pilot = PILOTS[issueNumber];
  if (!pilot) {
    return null;
  }
  return pilot;
}
