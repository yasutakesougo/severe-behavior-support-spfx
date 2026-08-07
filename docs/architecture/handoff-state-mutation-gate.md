# Handoff state mutation gate

```text
Decision-HO-1: Accepted (#17)
Decision-HO-EDGE-1: Accepted
GOV-AUD-02: Accepted
Handoff transition: MERGED (#90)
Handoff role policy: MERGED (#91)
HandoffState type / validator: Existing (#27)
Implementation start: GO for narrow pure state mutation only
```

対象は `HandoffState` の純粋変換と contract tests に限定する。

SharePoint、Entra ID、repository write、AuditEvent emission、UI、real data、deploy は対象外とする。
