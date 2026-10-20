import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "FieldStaffReadOnlyPilotWebPartStrings";
import FieldStaffReadOnlyPilot, {
  type FieldStaffReadOnlyPilotStrings,
} from "./components/FieldStaffReadOnlyPilot";

export interface IFieldStaffReadOnlyPilotWebPartProps {
  description: string;
}

/**
 * Synthetic-only FIELD_STAFF read-only pilot.
 * No SPHttpClient, tenant read, write, or deploy capability is wired here.
 */
export default class FieldStaffReadOnlyPilotWebPart extends BaseClientSideWebPart<IFieldStaffReadOnlyPilotWebPartProps> {
  public render(): void {
    const pilotStrings: FieldStaffReadOnlyPilotStrings = {
      pilotTitle: strings.PilotTitle,
      syntheticBanner: strings.SyntheticBanner,
      loadingLabel: strings.LoadingLabel,
      emptyLabel: strings.EmptyLabel,
      forbiddenLabel: strings.ForbiddenLabel,
      fetchFailedLabel: strings.FetchFailedLabel,
      recordHeading: strings.RecordHeading,
      personLabel: strings.PersonLabel,
      planLabel: strings.PlanLabel,
      procedureLabel: strings.ProcedureLabel,
      performedAtLabel: strings.PerformedAtLabel,
      recordedAtLabel: strings.RecordedAtLabel,
      resultLabel: strings.ResultLabel,
      resultValues: {
        PERFORMED_AS_PLANNED: strings.ResultPerformedAsPlanned,
        PERFORMED_WITH_ADAPTATION: strings.ResultPerformedWithAdaptation,
        NOT_PERFORMED: strings.ResultNotPerformed,
      },
    };

    const element: React.ReactElement = React.createElement(FieldStaffReadOnlyPilot, {
      strings: pilotStrings,
    });

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
          header: {
            description: strings.PropertyPaneDescription,
          },
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
