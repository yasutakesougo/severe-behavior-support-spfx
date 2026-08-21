export type LifecycleCreateTestHarnessUiInput = Readonly<{
  packetJson: string;
  provenanceJson: string;
  expectedMainSha: string;
}>;

export interface ILifecycleCreateTestHarnessProps {
  description: string;
  webAbsoluteUrl: string;
  runtimeSiteIdentity: string;
  lockedSiteIdentity: string;
  lockedListGuid: string;
  authoritativeMainSha: string;
  frozenLifecycleEventId: string;
  frozenLifecycleIdempotencyKey: string;
  frozenLifecyclePayloadFingerprint: string;
  userDisplayName: string;
  onValidate(input: LifecycleCreateTestHarnessUiInput): Promise<string>;
  onExecute(input: LifecycleCreateTestHarnessUiInput): Promise<string>;
}
