import * as React from "react";
import type { ILifecycleCreateTestHarnessProps } from "./ILifecycleCreateTestHarnessProps";
import * as strings from "LifecycleCreateTestHarnessWebPartStrings";

/**
 * Presentation-only harness shell.
 * No onInit/render POST. Execute is explicit and disabled until GO materials are present.
 * Does not mint TrustedReceiptProvenanceEvidence.
 */
export default function LifecycleCreateTestHarness(
  props: ILifecycleCreateTestHarnessProps,
): React.ReactElement<ILifecycleCreateTestHarnessProps> {
  const [packetJson, setPacketJson] = React.useState("");
  const [provenanceJson, setProvenanceJson] = React.useState("");
  const [expectedMainSha, setExpectedMainSha] = React.useState("");
  const [resultText, setResultText] = React.useState(strings.ResultIdle);
  const [executeArmed, setExecuteArmed] = React.useState(true);

  const onValidateOnly = (): void => {
    setResultText(strings.ResultValidateOnly);
  };

  const onExecute = (): void => {
    if (!executeArmed) {
      setResultText(strings.ResultExecuteDisabled);
      return;
    }
    // Composition / POST wiring is invoked only from an explicit Execute path in a
    // future authorized run. This UI does not auto-POST and does not mint provenance.
    setExecuteArmed(false);
    setResultText(
      [
        strings.ResultExecuteArmedConsumed,
        `siteIdentity=${props.siteIdentity}`,
        `listGuid=${props.listGuid}`,
        `packetChars=${packetJson.trim().length}`,
        `provenanceChars=${provenanceJson.trim().length}`,
        `expectedMainShaChars=${expectedMainSha.trim().length}`,
      ].join(" | "),
    );
  };

  return (
    <section data-automation-id="lifecycle-create-test-harness">
      <h2>{strings.Title}</h2>
      <p>{strings.Description}</p>
      <dl>
        <dt>{strings.PhysicalTargetLabel}</dt>
        <dd>
          <div>{props.webAbsoluteUrl}</div>
          <div>{props.siteIdentity}</div>
          <div>{props.listGuid}</div>
        </dd>
      </dl>
      <label>
        {strings.ExpectedMainShaLabel}
        <input
          value={expectedMainSha}
          onChange={(event) => setExpectedMainSha(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <label>
        {strings.PacketLabel}
        <textarea
          value={packetJson}
          onChange={(event) => setPacketJson(event.target.value)}
          rows={8}
          spellCheck={false}
        />
      </label>
      <label>
        {strings.ProvenanceLabel}
        <textarea
          value={provenanceJson}
          onChange={(event) => setProvenanceJson(event.target.value)}
          rows={4}
          spellCheck={false}
        />
      </label>
      <div>
        <button type="button" onClick={onValidateOnly}>
          {strings.ValidateButton}
        </button>
        <button type="button" onClick={onExecute} disabled={!executeArmed}>
          {strings.ExecuteButton}
        </button>
      </div>
      <pre data-automation-id="lifecycle-create-test-harness-result">{resultText}</pre>
      <p>
        {strings.OperatorLabel}: {props.userDisplayName}
      </p>
    </section>
  );
}
