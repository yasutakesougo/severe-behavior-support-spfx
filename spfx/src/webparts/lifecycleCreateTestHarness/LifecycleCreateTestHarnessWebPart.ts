import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { SPHttpClient } from "@microsoft/sp-http";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "LifecycleCreateTestHarnessWebPartStrings";
import LifecycleCreateTestHarness from "./components/LifecycleCreateTestHarness";
import { ILifecycleCreateTestHarnessProps } from "./components/ILifecycleCreateTestHarnessProps";
import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
  type ProcedureRecordLifecycleEventSpHttpClient,
} from "../../adapters/procedure-record-lifecycle-event/sphttpclient-list-transport";
import {
  B2_HARNESS_AUTHORITY_MAIN_SHA,
  B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY,
  executeLifecycleCreateTestHarnessRun,
  validateLifecycleCreateTestHarnessRun,
  type LifecycleCreateTestHarnessActionInput,
} from "../../adapters/procedure-record-lifecycle-event/test-only-harness-runner";
import {
  createLocalStorageTrustedReceiptConsumeStore,
  type TrustedReceiptConsumeStore,
} from "../../adapters/procedure-record-lifecycle-event/test-only-receipt-consume-registry";

export interface ILifecycleCreateTestHarnessWebPartProps {
  description: string;
}

/**
 * Isolated B2 test-only harness host.
 * hiddenFromToolbox. No onInit/render POST. Does not mint trusted receipts.
 * ScaffoldShellWebPart remains untouched.
 */
export default class LifecycleCreateTestHarnessWebPart extends BaseClientSideWebPart<ILifecycleCreateTestHarnessWebPartProps> {
  private consumeStore: TrustedReceiptConsumeStore | undefined;

  protected async onInit(): Promise<void> {
    await super.onInit();
    try {
      this.consumeStore = createLocalStorageTrustedReceiptConsumeStore(window.localStorage);
    } catch {
      this.consumeStore = undefined;
    }
  }

  public render(): void {
    const runtimeSiteIdentity = this.deriveRuntimeSiteIdentity();
    const element: React.ReactElement<ILifecycleCreateTestHarnessProps> = React.createElement(
      LifecycleCreateTestHarness,
      {
        description: this.properties.description,
        webAbsoluteUrl: this.context.pageContext.web.absoluteUrl,
        runtimeSiteIdentity: runtimeSiteIdentity ?? strings.RuntimeHostUnavailable,
        lockedSiteIdentity: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
        lockedListGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
        authoritativeMainSha: B2_HARNESS_AUTHORITY_MAIN_SHA,
        frozenLifecycleEventId: B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY.LifecycleEventId,
        frozenLifecycleIdempotencyKey:
          B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY.LifecycleIdempotencyKey,
        frozenLifecyclePayloadFingerprint:
          B2_TEST_ONLY_SYNTHETIC_CANCEL_IDENTITY.LifecyclePayloadFingerprint,
        userDisplayName: this.context.pageContext.user.displayName,
        onValidate: async (input) => this.runHarnessAction("VALIDATE", input),
        onExecute: async (input) => this.runHarnessAction("EXECUTE", input),
      },
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  private deriveRuntimeSiteIdentity(): string | undefined {
    try {
      const webUrl = new URL(this.context.pageContext.web.absoluteUrl);
      const host = webUrl.hostname.toLowerCase();
      const siteId = this.context.pageContext.site.id.toString().toLowerCase();
      const webId = this.context.pageContext.web.id.toString().toLowerCase();
      if (!host || !siteId || !webId) {
        return undefined;
      }
      return `${host},${siteId},${webId}`;
    } catch {
      return undefined;
    }
  }

  private async runHarnessAction(
    action: "VALIDATE" | "EXECUTE",
    input: Readonly<{
      packetJson: string;
      provenanceJson: string;
      expectedMainSha: string;
    }>,
  ): Promise<string> {
    if (!this.consumeStore) {
      return "BLOCKED: durable receipt consume store unavailable; POST=0";
    }

    const runtimeSiteIdentity = this.deriveRuntimeSiteIdentity();
    if (!runtimeSiteIdentity) {
      return "BLOCKED: runtime page site identity unavailable; POST=0";
    }

    const runnerInput: LifecycleCreateTestHarnessActionInput = {
      ...input,
      runtimeSiteIdentity,
      webAbsoluteUrl: this.context.pageContext.web.absoluteUrl,
      consumeStore: this.consumeStore,
      spHttpClient: this.context.spHttpClient as unknown as ProcedureRecordLifecycleEventSpHttpClient,
      configuration: SPHttpClient.configurations.v1,
    };

    try {
      const result =
        action === "VALIDATE"
          ? await validateLifecycleCreateTestHarnessRun(runnerInput)
          : await executeLifecycleCreateTestHarnessRun(runnerInput);
      return [
        `${result.stage}:${result.ok ? "PASS" : "BLOCKED"}`,
        `reason=${result.reason}`,
        `appendCalled=${String(result.appendCalled)}`,
        result.saveState ? `saveState=${result.saveState}` : undefined,
      ]
        .filter((part): part is string => part !== undefined)
        .join(" | ");
    } catch {
      return `${action}:BLOCKED | reason=unexpected_fail_closed | POST retry=0`;
    }
  }
}
