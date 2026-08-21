define([], function () {
  return {
    PropertyPaneDescription: "Lifecycle CREATE test harness (isolated)",
    BasicGroupName: "基本",
    DescriptionFieldLabel: "説明",
    Title: "Lifecycle CREATE test harness",
    Description:
      "Isolated test-only surface. Validate is GET-only. Execute requires HumanGoRequestPacket + TrustedReceiptProvenanceEvidence and never retries POST automatically.",
    RuntimeHostLabel: "Actual runtime host (derived from pageContext)",
    LockedTargetLabel: "Locked historical test-only target",
    AuthoritativeMainShaLabel: "Authoritative implementation basis SHA",
    FrozenSyntheticIdentityLabel: "Frozen synthetic CANCEL identity",
    ExpectedMainShaLabel: "Confirm expected main SHA",
    PacketLabel: "HumanGoRequestPacket (JSON)",
    ProvenanceLabel: "TrustedReceiptProvenanceEvidence (JSON)",
    ValidateButton: "Validate (GET only / no consume)",
    ExecuteButton: "Execute (explicit one-shot)",
    ResultIdle: "Idle — render/onInit did not POST.",
    ResultExecuteDisabled: "Execute disabled after this mounted-instance attempt.",
    RuntimeHostUnavailable: "UNAVAILABLE",
    OperatorLabel: "Operator display name",
  };
});
