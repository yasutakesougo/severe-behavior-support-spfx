/**
 * C-G browser smoke harness — synthetic fixture only.
 * Scope: PC/tablet horizontal-scroll and 200% equivalent viewport evidence.
 * No navigation destinations, auth judgment, adapter, or live I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AppShellChrome,
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  isShellSiteSelection,
  type ShellSiteSelection,
} from "../../src/shell/ux";

const C_G_WIDE_SYNTHETIC_TEXT = `C-G synthetic wide content ${"C-G-SYNTHETIC-LONG-TOKEN-".repeat(16)}`;

function parseSiteSelection(): ShellSiteSelection {
  const raw = new URLSearchParams(window.location.search).get("siteSelection") ?? "SITE-ISG";
  return isShellSiteSelection(raw) ? raw : "SITE-ISG";
}

ReactDOM.render(
  <div data-c-g="viewport-evidence">
    <AppShellChrome
      demoMode={SHELL_UX_DEFAULT_FIXTURE.demoMode}
      siteSelection={parseSiteSelection()}
      saveState="saved"
      viewMode="ready"
      correlationId="c-g-synth-corr"
      errorCode="C-G-SYNTH-E001"
      userDisplayName="C-G Synthetic Operator"
      partialRetrieval={SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE}
    >
      <section data-shell-ux="shell-body">
        <h2>C-G viewport smoke ready body</h2>
        <p data-c-g="wide-content">{C_G_WIDE_SYNTHETIC_TEXT}</p>
        <p>Horizontal overflow is measured from the rendered synthetic fixture.</p>
      </section>
    </AppShellChrome>
  </div>,
  document.getElementById("root"),
);
