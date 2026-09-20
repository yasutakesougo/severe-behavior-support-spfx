/**
 * ADMIN-AUDIT-TASK-FIRST-V1 browser smoke entry.
 * Synthetic ADMIN_AUDIT presentation. No LIVE WRITE / auth / schema mutation.
 * Restore injection is query-string only — not IScaffoldShellProps.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "../../src/shell/ux/fixture";
import {
  parseShellPresentationRole,
  type ShellPresentationRole,
} from "../../src/shell/ux/presentation-role";
import ScaffoldShell from "../../src/webparts/scaffoldShellWebPart/components/ScaffoldShell";
import type { IScaffoldShellProps } from "../../src/webparts/scaffoldShellWebPart/components/IScaffoldShellProps";

const fixture = DEMO_1_FIELD_STAFF_FIXTURE;

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

const params = new URLSearchParams(window.location.search);
const roleParam = params.get("role");
const presentationRole: ShellPresentationRole =
  roleParam === null || roleParam === "" ? "ADMIN_AUDIT" : parseShellPresentationRole(roleParam);
const destination = params.get("destination") ?? undefined;
const objectParam = params.get("object");
const object = objectParam === null ? undefined : objectParam;

const smokeProps = {
  description: "Synthetic ADMIN_AUDIT Task-First smoke",
  isDarkTheme: false,
  environmentMessage: "Synthetic browser smoke",
  userDisplayName: "Synthetic ADMIN_AUDIT",
  demoMode: fixture.demoMode,
  siteSelection: fixture.siteSelection,
  saveState: "saved" as const,
  viewMode: fixture.viewMode,
  correlationId: fixture.correlationId,
  errorCode: fixture.errorCode,
  partialRetrieval: fixture.partialRetrieval,
  presentationRole,
  initialAdminAuditDestination: destination,
  initialAdminAuditObject: object,
} as IScaffoldShellProps;

ReactDOM.render(<ScaffoldShell {...smokeProps} />, root);
