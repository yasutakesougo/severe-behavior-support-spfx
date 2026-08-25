# Normal Operations Runbook

このRunbookは、平常時に現在の状態を確認し、異常を早期に認識するために使用する。

高度な監視システムの導入は`OPS-READINESS-V1`の必須条件ではない。

必要なのは、担当者が何を確認し、何を異常として扱い、次にどこへ連絡するかを判断できることである。

## 平常時に確認すること

```text
OPS-AC5
現在利用しているapplication versionを確認できる。

OPS-AC6
現在の稼働状態を確認できる。

OPS-AC7
Production / Pilot / Demoなど、現在の運用モードを識別できる。

OPS-AC8
定期的に確認すべき項目と方法が文書化されている。
```

少なくとも次を確認対象にする。

- application version
- target environment
- operating mode
- expected page / application availability
- save behavior when write is applicable
- current incident noticeの有無

## 異常として扱う状態

```text
OPS-NORMAL-DET1
save failureを異常として認識する。

OPS-NORMAL-DET2
save outcome unknownを異常として認識する。

OPS-NORMAL-DET3
unexpected authorization failureを異常として認識する。

OPS-NORMAL-DET4
expected page / application unavailableを異常として認識する。

OPS-NORMAL-DET5
expected versionとobserved versionの不一致を異常として認識する。

OPS-NORMAL-DET6
異常認識後の連絡・停止判断経路を確認できる。
```

`save outcome unknown`では、保存成功と推定して再入力しない。

結果が確認できるまで、重複記録の可能性を含む異常として扱う。

## 異常を認識した場合

1. 現在の画面と操作を止める。
2. 異常の種類を記録する。
3. `incident-and-safe-stop.md`を参照する。
4. 必要な連絡・停止判断経路へ進む。
5. 未確認のまま正常扱いへ戻さない。

このRunbookは、利用者データ、token、cookie、credentialをEvidenceへ転記することを要求しない。

## Evidence記録

```text
Evidence ID: OR-2
Basis:
  mainSha:
  applicationVersion:
  targetEnvironment:
  runbookRevision:
Observed operating mode:
Observed application availability: PASS / FAIL / UNKNOWN
Observed expected version match: PASS / FAIL / UNKNOWN
Detection path reviewed:
  save failure: PASS / FAIL / N/A
  save outcome unknown: PASS / FAIL / N/A
  authorization failure: PASS / FAIL / N/A
  page/application unavailable: PASS / FAIL
  version mismatch: PASS / FAIL
Incident escalation path confirmed: PASS / FAIL / UNKNOWN
Result: PASS / HOLD
Residual:
```

## PASS条件

平常時の確認項目を再現でき、異常状態とその後の行動を判断できる場合に`OR-2 PASS`とする。

必要な確認が`UNKNOWN`または`STALE`の場合は`HOLD`とする。
