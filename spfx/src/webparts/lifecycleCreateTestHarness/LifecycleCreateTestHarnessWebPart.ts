import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
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
} from "../../adapters/procedure-record-lifecycle-event/sphttpclient-list-transport";

export interface ILifecycleCreateTestHarnessWebPartProps {
  description: string;
}

/**
 * Isolated B2 test-only harness host.
 * hiddenFromToolbox. No onInit/render POST. Does not mint trusted receipts.
 * ScaffoldShellWebPart remains untouched.
 */
export default class LifecycleCreateTestHarnessWebPart extends BaseClientSideWebPart<ILifecycleCreateTestHarnessWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ILifecycleCreateTestHarnessProps> = React.createElement(
      LifecycleCreateTestHarness,
      {
        description: this.properties.description,
        siteIdentity: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY,
        listGuid: PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID,
        webAbsoluteUrl: this.context.pageContext.web.absoluteUrl,
        userDisplayName: this.context.pageContext.user.displayName,
      },
    );
    ReactDom.render(element, this.domElement);
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
