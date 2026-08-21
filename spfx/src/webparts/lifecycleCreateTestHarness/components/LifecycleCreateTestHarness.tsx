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
  const [resultText, setResultText] = React.useState(strings.ResultIdle);
  const [executeArmed, setExecuteArmed] = React.useState(true);

  const onValidateOnly = (): void => {
    setResultText(strings.ResultValidateOnly);
  };

  const onExecute = async (): Promise<void> => {
    if (!executeArmed) {
      setResultText(strings.ResultExecuteDisabled);
      return;
    }
    setExecuteArmed(false);
    try {
      setResultText(
        await props.onExecute(
          JSON.parse(provenanceJson) as unknown,
          JSON.parse(packetJson) as unknown,
        ),
      );
    } catch {
      setResultText("save_failed");
    }
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
          <div>codeBasisSha={props.codeBasisSha || "unavailable"}</div>
        </dd>
      </dl>
      <label>
        {strings.PacketLabel} (signed artifact payload is authoritative)
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
