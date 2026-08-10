# CN-1 — read-only observation evidence

この文書は、CN-1 の read-only observation evidence を記録する。

```text
Status: PARTIAL / HOLD
Mutation: 0
CN-1: OPEN / NOT CONFIRMED
Acceptance: NOT RUN
```

## 1. Session scope

2026-08-10 に接続済み SharePoint read-only surface から、対象 Site の identity を再確認した。

```text
/sites/severe-support-isogo
  display name: 強度行動障害支援 - 磯子活動ホーム
  result: CONFIRMED

/sites/severe-support-honmoku
  display name: 強度行動障害支援 - 本牧活動ホーム
  result: CONFIRMED
```

この確認は Site identity の再確認であり、CN-1 の column metadata confirmation ではない。

## 2. Column metadata observation

今回利用可能な接続済み SharePoint read surface を確認したが、SharePoint List の column schema / Internal Name を列挙する read action は提供されていなかった。

したがって、次の4 Lists について Internal Name は今回のセッションでは観測していない。

| Site | List | Internal Name observation |
|---|---|---|
| isogo | SupportPlans | UNOBSERVED |
| isogo | AssessmentSnapshots | UNOBSERVED |
| honmoku | SupportPlans | UNOBSERVED |
| honmoku | AssessmentSnapshots | UNOBSERVED |

## 3. Non-claims

```text
No Internal Name values were inferred.
No Display Name -> Internal Name conversion was performed.
No column metadata was marked CONFIRMED.
No tenant mutation was performed.
No SharePoint adapter/schema mapping implementation was started.
```

## 4. Required continuation

CN-1 を進めるには、実 tenant の List field metadata を返せる read-only method が必要である。

候補:

```text
Microsoft Graph columns read
SharePoint REST fields read
PnP PowerShell Get-PnPField 等の read-only enumeration
SharePoint 管理/UI evidence that exposes exact Internal Name
```

次回観測では、対象4 Lists の column metadata を取得し、packet の MATCH / MISMATCH / MISSING / UNOBSERVED / AMBIGUOUS 分類で比較する。

## 5. Stop state

```text
CN-1 observation: PARTIAL
Site identity: CONFIRMED 2 / 2
List Internal Names: UNOBSERVED 4 / 4
CN-1: OPEN
SharePoint adapter / schema mapping: HOLD
Implementation Start: HOLD
Deploy / real data: NO-GO
Mutation: 0
```
