/** Pilot registry — Scope §10: exactly one Issue at a time. */
export const PILOTS = {
  552: {
    issue: 552,
    pr: 563,
    evidencePaths: ["docs/architecture/sbs-mgmt-loop-a-implementation-evidence.md"],
    supplementaryPr: 563,
  },
};

export function getPilot(issueNumber) {
  const pilot = PILOTS[issueNumber];
  if (!pilot) {
    return null;
  }
  return pilot;
}
