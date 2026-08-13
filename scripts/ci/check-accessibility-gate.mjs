#!/usr/bin/env node
/**
 * CI entry for DADS-06 Accessibility Gate.
 */
import { formatGateReport, runAccessibilityGate } from "../a11y/accessibility-gate.mjs";

const result = runAccessibilityGate();
console.log(formatGateReport(result));
process.exit(result.ok ? 0 : 1);
