define([], function () {
  return {
    PropertyPaneDescription: "Lifecycle CREATE test harness (isolated)",
    BasicGroupName: "基本",
    DescriptionFieldLabel: "説明",
    Title: "Lifecycle CREATE test harness",
    Description:
      "Isolated test-only surface. SignedReceiptArtifact + frozen packet required. No automatic POST.",
    PhysicalTargetLabel: "Current physical target",
    ExpectedMainShaLabel: "expected main SHA",
    PacketLabel: "HumanGoRequestPacket (JSON)",
    ProvenanceLabel: "SignedReceiptArtifact (JSON)",
    ValidateButton: "Validate (no POST)",
    ExecuteButton: "Execute (explicit)",
    ResultIdle: "Idle — render/onInit did not POST.",
    ResultValidateOnly: "Validate-only — no POST issued.",
    ResultExecuteDisabled: "Execute disabled after receipt-scoped attempt.",
    ResultExecuteArmedConsumed:
      "Execute armed once in UI. POST remains gated by composition + Human GO; no automatic retry.",
    OperatorLabel: "Operator display name",
  };
});
