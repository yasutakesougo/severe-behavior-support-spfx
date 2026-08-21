declare interface ILifecycleCreateTestHarnessWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  Title: string;
  Description: string;
  PhysicalTargetLabel: string;
  ExpectedMainShaLabel: string;
  PacketLabel: string;
  ProvenanceLabel: string;
  ValidateButton: string;
  ExecuteButton: string;
  ResultIdle: string;
  ResultValidateOnly: string;
  ResultExecuteDisabled: string;
  ResultExecuteArmedConsumed: string;
  OperatorLabel: string;
}

declare module "LifecycleCreateTestHarnessWebPartStrings" {
  const strings: ILifecycleCreateTestHarnessWebPartStrings;
  export = strings;
}
