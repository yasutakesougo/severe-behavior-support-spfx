import * as React from "react";
import type {
  ILifecycleCreateTestHarnessProps,
  LifecycleCreateTestHarnessUiInput,
} from "./ILifecycleCreateTestHarnessProps";
import * as strings from "LifecycleCreateTestHarnessWebPartStrings";

/**
 * Isolated B2 harness UI.
 * No onInit/render POST. Validate is GET-only + non-consuming GO inspection.
 * Execute is explicit, one-shot per mounted UI instance, and delegated to the host runner.
 */
export default function LifecycleCreateTestHarness(
  props: ILifecycleCreateTestHarnessProps,
): React.ReactElement<ILifecycleCreateTestHarnessProps> {
  const [packetJson, setPacketJson] = React.useState("");
  const [provenanceJson, setProvenanceJson] = React.useState("");
  const [expectedMainSha, setExpectedMainSha] = React.useState("");
  const [resultText, setResultText] = React.useState(strings.ResultIdle);
  const [executeArmed, setExecuteArmed] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  const currentInput = (): LifecycleCreateTestHarnessUiInput => ({
    packetJson,
    provenanceJson,
    expectedMainSha,
  });

  const onValidateOnly = async (): Promise<void> => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      setResultText(await props.onValidate(currentInput()));
    } finally {
      setBusy(false);
    }
  };

  const onExecute = async (): Promise<void> => {
    if (!executeArmed || busy) {
      setResultText(strings.ResultExecuteDisabled);
      return;
    }

    // UI one-shot is consumed before awaiting. Durable receipt anti-replay is enforced
    // separately by the host localStorage consume store, so reload cannot restore a
    // consumed Human receipt after a real attempt.
    setExecuteArmed(false);
    setBusy(true);
    try {
      setResultText(await props.onExecute(currentInput()));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section data-automation-id="lifecycle-create-test-harness">
      <h2>{strings.Title}</h2>
      <p>{strings.Description}</p>

      <dl>
        <dt>{strings.RuntimeHostLabel}</dt>
        <dd>{props.webAbsoluteUrl}</dd>
        <dd>{props.runtimeSiteIdentity}</dd>

        <dt>{strings.LockedTargetLabel}</dt>
        <dd>{props.lockedSiteIdentity}</dd>
        <dd>{props.lockedListGuid}</dd>

        <dt>{strings.AuthoritativeMainShaLabel}</dt>
        <dd>{props.authoritativeMainSha}</dd>

        <dt>{strings.FrozenSyntheticIdentityLabel}</dt>
        <dd>{props.frozenLifecycleEventId}</dd>
        <dd>{props.frozenLifecycleIdempotencyKey}</dd>
        <dd>{props.frozenLifecyclePayloadFingerprint}</dd>
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
          rows={10}
          spellCheck={false}
        />
      </label>

      <label>
        {strings.ProvenanceLabel}
        <textarea
          value={provenanceJson}
          onChange={(event) => setProvenanceJson(event.target.value)}
          rows={5}
          spellCheck={false}
        />
      </label>

      <div>
        <button type="button" onClick={onValidateOnly} disabled={busy}>
          {strings.ValidateButton}
        </button>
        <button type="button" onClick={onExecute} disabled={!executeArmed || busy}>
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
