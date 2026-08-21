import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "@microsoft/sp-http";

import * as strings from "LifecycleCreateTestHarnessWebPartStrings";
import LifecycleCreateTestHarness from "./components/LifecycleCreateTestHarness";
import { ILifecycleCreateTestHarnessProps } from "./components/ILifecycleCreateTestHarnessProps";
import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
} from "../../adapters/procedure-record-lifecycle-event/sphttpclient-list-transport";
import { composeTestOnlyHarnessCancellationPersistence } from "../../adapters/procedure-record-lifecycle-event/test-only-harness-composition";
import { createLocalStorageTrustedReceiptConsumeStore } from "../../adapters/procedure-record-lifecycle-event/test-only-receipt-consume-registry";
import { physicalSiteIdentity } from "../../adapters/procedure-record-lifecycle-event/test-only-live-create-gate";
import {
  getB2HarnessCodeBasisSha,
  verifySignedReceiptArtifact,
} from "../../adapters/procedure-record-lifecycle-event/test-only-live-create-gate";

export interface ILifecycleCreateTestHarnessWebPartProps {
  description: string;
}

/**
 * Isolated B2 test-only harness host.
 * hiddenFromToolbox. No onInit/render POST. Does not mint trusted receipts.
 * ScaffoldShellWebPart remains untouched.
 */
export default class LifecycleCreateTestHarnessWebPart extends BaseClientSideWebPart<ILifecycleCreateTestHarnessWebPartProps> {
  private readonly consumeStore = createLocalStorageTrustedReceiptConsumeStore(window.localStorage);

  public render(): void {
    const element: React.ReactElement<ILifecycleCreateTestHarnessProps> = React.createElement(
      LifecycleCreateTestHarness,
      {
        description: this.properties.description,
        siteIdentity: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
        listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
        webAbsoluteUrl: this.context.pageContext.web.absoluteUrl,
        userDisplayName: this.context.pageContext.user.displayName,
        codeBasisSha: getB2HarnessCodeBasisSha(),
        onExecute: (artifact, packet) => this.execute(artifact, packet),
      },
    );
    ReactDom.render(element, this.domElement);
  }

  private async execute(artifact: unknown, packet: unknown): Promise<string> {
    const host = {
      siteIdentity: physicalSiteIdentity({
        hostname: new URL(this.context.pageContext.web.absoluteUrl).hostname,
        siteId: String(this.context.pageContext.site.id),
        webId: String(this.context.pageContext.web.id),
      }),
      listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
      authoritativeMainSha: getB2HarnessCodeBasisSha(),
    };
    const verified = await verifySignedReceiptArtifact(artifact);
    if (!verified.receipt) return "save_failed";
    const composed = await composeTestOnlyHarnessCancellationPersistence({
      receipt: verified.receipt,
      packet,
      runtimeHost: host,
      consumeStore: this.consumeStore,
      spHttpClient: this.context.spHttpClient,
      configuration: SPHttpClient.configurations.v1,
      webAbsoluteUrl: this.context.pageContext.web.absoluteUrl,
    });
    if (!composed.ok) return "save_failed";
    const result = await composed.persistencePort.submitCancellation({
      semanticsInput: {
        operation: "CANCEL",
        targetRecordId: composed.packet.lifecycleEventId,
        originalRecord: {
          OrganizationId: "synthetic-org-001",
          SiteId: "SITE-ISG",
          UserId: "synthetic-user-001",
          TimeZone: "Asia/Tokyo",
          RecordId: composed.packet.lifecycleEventId,
          IdempotencyKey: "synthetic-record-001",
          PayloadFingerprint: composed.packet.lifecyclePayloadFingerprint,
          Procedure: {
            ProcedureId: "synthetic-procedure",
            ProcedureVersion: "1",
            ApprovalState: "APPROVED",
          },
          LocalDate: "2026-08-21",
          planId: "synthetic-plan",
          planVersion: 1,
          result: "PERFORMED_AS_PLANNED",
          performedAt: "2026-08-21T09:00:00.000Z",
          recordedAt: "2026-08-21T09:00:00.000Z",
          recordedBy: "synthetic-user-001",
        },
        reason: "synthetic test-only cancellation",
        boundRecordIds: [composed.packet.lifecycleEventId],
        lifecycleEvents: [],
        corrections: [],
        authorization: {
          status: "FOUND",
          value: {
            Subject: "synthetic",
            UserId: "synthetic-user-001",
            OrganizationId: "synthetic-org-001",
            SiteContext: {
              Memberships: [{ SiteId: "SITE-ISG", Roles: ["SERVICE_MANAGER"] }],
              SelectedSiteId: "SITE-ISG",
            },
          },
        },
      },
      recordedAtIso: new Date().toISOString(),
    });
    return result.saveState;
  }

  protected onInit(): Promise<void> {
    // Read-only init only. No SharePoint POST / LIVE CREATE.
    return super.onInit();
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
}
