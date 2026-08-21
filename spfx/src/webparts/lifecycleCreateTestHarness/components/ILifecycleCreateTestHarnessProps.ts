export interface ILifecycleCreateTestHarnessProps {
  description: string;
  siteIdentity: string;
  listGuid: string;
  webAbsoluteUrl: string;
  userDisplayName: string;
  codeBasisSha: string;
  onExecute: (artifact: unknown, packet: unknown) => Promise<string>;
}
