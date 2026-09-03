# Understanding Test Matrix v1 — Version-management screens

```text
repository: yasutakesougo/severe-behavior-support-spfx
kind: reusable acceptance pattern / understanding test matrix
status: DEFINED / ADOPTED (Correction-1 applied)
version: Understanding Test Matrix v1
correction: Correction-1 — Test ID semantics frozen; PRE/POST and C2-4a/b are additive only
scope: 版管理を伴う職員向け画面（例: SBS-MGMT-LOOP-B）
authority granted: NONE
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Simulation Evidence != Actual Staff Value Evidence
```

## Correction-1（必須）

```text
改善内容（PRE/POST・C2-4a/b・C2-2 soft NO・C3 Severity 補足）は採用する。
ただし既存の合意済み Test ID semantics は変更しない。

C1-1〜C1-4
C2-1〜C2-3
C2-4（親）
C3-1〜C3-4
= FROZEN（合意済み probe 意味を維持）

C1-PRE / C1-POST
= grouping ラベルのみ（採点 ID の付け替え禁止）

C2-4a / C2-4b
= C2-4 の sub-ID として追加（C2-4 を置換しない）

後から Evidence を比較するとき、
同じ Test ID が別意味になってはならない。
```

## 1. Purpose

版管理画面の「理解できたか」を感想ではなく、再現可能な YES / PARTIAL / NO で採点する。

判定は最終理解だけでなく、理解に至る探索コストを含む。Severity は別軸とする。

```text
Judgement（理解）  ⊥  Severity（安全境界への接続）
```

本 Matrix は 5 Persona Simulation と Actual Staff Value Check（observer scoring）の共通語彙である。

## 2. Applicability

適用候補:

- 現行版の不変（Source Immutability）が業務上必須の画面
- Draft と本番保存 / 適用開始が分離される画面
- 版 N / N+1 の関係を職員が追う必要がある画面

非適用の例: docs-only、test-only、版関係を職員に提示しない内部変更。

各 Slice / PR で次を Evidence に残す。

```text
Understanding Test Matrix: APPLICABLE | NOT_APPLICABLE | UNKNOWN
Matrix version: Understanding Test Matrix v1
Correction: Correction-1
Target HEAD:
```

## 3. Axes（grouping）

```text
C1 Source Immutability
  C1-PRE  = C1-1 / C1-2   （操作前・予測理解）← grouping only
  C1-POST = C1-3 / C1-4   （操作後・結果確認）← grouping only

C2 Draft / Production Separation
  C2-1 / C2-2 / C2-3
  C2-4
    C2-4a Draft != 本番保存
    C2-4b Draft != 適用開始

C3 Version Relationship
  C3-1 / C3-2 / C3-3 / C3-4
```

## 4. Items（合意済み Test ID semantics）

Probe 文言は SBS-MGMT-LOOP-B 画面を例示に使う。他画面では同等の UI 要素へ対応づけて採点する（ID の意味は変えない）。

### C1 — Source Immutability

目的: 「変更内容の作成を始めても、現行の適用中版を直接変更しない」が理解できるか。

#### C1-PRE（grouping）— 押す前から現行版が守られると思えるか

| ID | 合意済み probe（意味・FROZEN） | YES | PARTIAL | NO |
|---|---|---|---|---|
| C1-1 | 「次の版の考え方」セクションを読む | 初見または最小限の通常読解で、次版の考え方として読める | 探索・再読後に読める | 最終的にセクションを見つけられない / 意味を取れない |
| C1-2 | 「変更内容の作成を始める」ボタンを認識する | 初見で次操作 CTA として認識できる | 読み直し・探索後に認識できる | 最終的に次操作 CTA を特定できない / 別操作と誤認 |

#### C1-POST（grouping）— 押した後、実際に現行版が残ったと理解できるか

| ID | 合意済み probe（意味・FROZEN） | YES | PARTIAL | NO |
|---|---|---|---|---|
| C1-3 | 「元の版: 3（変更しない）」を読む | 直後に、元版が変更されないと理解 | 照合・再読後に理解 | 最終的に元版が消えた / 上書きされたと理解 |
| C1-4 | 押下後、版 3 を残して Draft が別作成されたと理解する | 直後に「版3残置 + Draft 別作成」と理解 | 照合後に理解 | 最終的に版3が直接変わった / Draft が別物だと説明できない |

組み合わせ例:

```text
C1-2 = PARTIAL
C1-3 = YES
→ 操作後は安全だと分かるが、押す前の不安・探索が残る
→ 原則 P2 Finding（UI_FRICTION / WORDING）
```

### C2 — Draft / Production Separation

目的: Draft を作った ≠ 本番保存 ≠ 適用開始 が分離して理解できるか。

| ID | 合意済み probe（意味・FROZEN） | YES | PARTIAL | NO |
|---|---|---|---|---|
| C2-1 | 「変更内容の下書き: 版 4」を Draft 成果物として認識する | 初見で下書き成果物と分かる | 探索後に分かる | 最終的に本番版 / 適用版だと理解 |
| C2-2 | 「状態: 下書き / 本番未保存」の扱いを理解する（下記 NO 条件） | 不安なく / 最小読解で境界を正しく理解 | 「消えるのでは？」等の不安があっても、本番未保存であることは正しく理解（UI_FRICTION） | 下記 NO 条件 |
| C2-3 | 「本番には保存されていません」境界を理解する | 初見で本番未保存境界を理解 | 探索後に理解 | 最終的に本番へ保存されたと理解 |
| C2-4 | Draft 作成 ≠ 本番保存 ≠ 適用開始 を理解する（親 ID） | 両側（保存・適用）を初見で正しく分離 | 片側または両側を探索・推論後に正しく理解 | 最終的に本番保存済み / 適用開始済みと誤解 |

#### C2-4 sub-IDs（追加・置換ではない）

| Sub-ID | 意味 | YES | PARTIAL | NO |
|---|---|---|---|---|
| C2-4a | Draft ≠ 本番保存 | 「本番未保存」等を初見で正しく理解 | 探索後に理解 | 「すでに本番保存された」と理解 |
| C2-4b | Draft ≠ 適用開始 | 「まだ適用開始されていない」を初見で正しく理解 | 他表示からの推論後に理解 | 「適用開始された / 現場で使い始めている」と理解 |

C2-4 を採点するときは、可能な限り C2-4a / C2-4b も併記する。親 C2-4 だけに畳んで「C2 全体が弱い」と雑判定しない。

```text
例（今回型画面の典型）:
C2-4a = YES
C2-4b = PARTIAL
→ 「未適用の明示」だけが P2 候補。C2 全体を弱としない。
```

#### C2-2 NO 条件（Severity discipline 整合）

```text
「保存されないと消えるのでは？」と不安
→ PARTIAL / UI_FRICTION
   （本番未保存の理解自体は正しい可能性がある）

「すでに本番保存された」と理解
→ NO

「この下書きが現在の適用版になった」と理解
→ NO
```

### C3 — Version Relationship

目的: 元の版 N（変更しない）と新しい下書き N+1（別物）の関係を追えるか。

| ID | 合意済み probe（意味・FROZEN） | YES | PARTIAL | NO |
|---|---|---|---|---|
| C3-1 | 現行 3 → 次 4 の関係を追える | 初見で「現行3の次が4」と追える | 軽い混乱の後に追える | 最終的に現行と次の関係を説明できない |
| C3-2 | Draft 4 / 元 3 の対比を理解する | 初見で Draft4 と元3 を対比できる | 照合後に理解 | 最終的にどちらが Draft / 元か説明できない |
| C3-3 | 過去版一覧（版 1/2/3…）を追える | 初見で追える | 軽い混乱の後に追える | 最終的に過去版一覧の関係を説明できない |
| C3-4 | 「版 3 を残して版 4 Draft」と説明できる | 初見で正しく説明できる | 照合・再読後に説明できる | 最終的に正しく説明できない / 上書き・適用済みと説明 |

## 5. Judgement rules

```text
YES
= 初見または最小限の通常読解で正しく理解

PARTIAL
= 読み直し・探索・他表示との照合後に正しく理解

NO
= 最終的にも誤解
  または正しい説明ができない
```

「たぶん大丈夫」は YES にしない。探索・照合が必要なら PARTIAL。

## 6. Severity rules（別軸・既存 Test ID へ追記）

Severity は Judgement の別名ではない。安全境界への接続だけで付ける。

```text
YES
→ Finding なし、または軽微観測のみ

PARTIAL + 最終理解は正しい
→ 原則 P2

NO + 現行版上書き誤認
→ P1
  （主に C1-3 / C1-4 / C3-4）

NO + Draft = 適用開始
→ P1
  （主に C2-4 / C2-4b / C2-2）

NO + 現行版を特定できない / 現行→次の関係を追えない
→ P1
  （主に C3-1 / C3-2）

NO + Draft = 本番保存
→ P1 候補
  （主に C2-3 / C2-4 / C2-4a）
```

### C3 Severity 補足（全 C3 NO を自動 P1 にしない）

| Test ID / 誤認内容 | Severity 候補 |
|---|---|
| C3-3: 過去版一覧を少し混乱 | P2 |
| C3-1: 現行 3 → 次 4 を追えない / 現行を特定できない | P1 |
| C3-2: Draft4 / 元3 を対比できない | P1 |
| C3-4: 版3を残して版4 Draft と説明できない（上書き・適用済み説明を含む） | P1 |

```text
迷ったら P2。
P1 は「少し分かりにくい」では付けない。
安全境界に接続する誤認だけを P1 にする。
```

P0 は本 Matrix 外の重大安全境界破り（他利用者誤操作、LIVE WRITE 等）に限定する。

## 7. Evidence record（必須）

各 Test ID の観測は次を揃える。

| Field | 内容 |
|---|---|
| Persona | 5 Persona 名、または Staff 1（observer） |
| Psychological state | 評価冒頭に 1 文固定 |
| Test ID | 例: C1-2, C2-4b（合意済み ID のみ） |
| Moment of friction | 迷い / 再読 / 照合が起きた瞬間 |
| Result | YES / PARTIAL / NO |
| Severity | NONE / P2 / P1 / P0（別軸） |

## 8. Actual Staff Value Check への転用

本 Matrix は 5 Persona だけでなく、Staff 1 の観察シートにそのまま使う。

職員本人には 12+ 問（C1〜C3 全項目）を読み上げない。

自然なタスクを 1 回行ってもらい、評価者が裏から採点する。

職員への質問は次の 4 問に絞る。

```text
1. 次に何をすればよいと思いますか？
2. このボタンを押すと、
   今使っている計画はどうなると思いますか？
3. 今使っている版と、
   新しくできた版について説明してください。
4. 新しい版は、
   もう現場で使い始める状態ですか？
```

観察 + 4 問から C1〜C3 を採点する。

| Staff Q | 主に裏取りする Test IDs |
|---|---|
| Q1 | C1-1 / C1-2（次操作特定）。Moment を記録 |
| Q2 | C1-PRE（C1-1 / C1-2）、必要なら C1-POST（C1-3 / C1-4） |
| Q3 | C3-1〜C3-4、C1-POST |
| Q4 | C2-4 / C2-4a / C2-4b、C2-1〜C2-3 |

## 9. Process position（工程は不変）

```text
5 Persona Simulation
= PASS WITH MINOR FRICTION（例）
C1-C3 Test Matrix
= DEFINED
↓ NEXT
Actual Staff Value Check
  + C1-C3 observer scoring
↓
PASS / ACCEPTABLE / HOLD
↓ PASS / ACCEPTABLE
Human Ready GO consumption
```

```text
Simulation PASS != Actual Staff Value Check PASS
Simulation PASS != Human Ready Authority
Matrix DEFINED != Staff Value PASS
Matrix DEFINED != Ready / Merge / Deploy GO
```

## 10. Reuse

本文書は「版管理を伴う画面」の共通 Acceptance パターンとする。

Slice 固有の採点表・期待パターン・Staff セッション記録は、対象 unit の architecture 証跡へ分離する（例: `sbs-mgmt-loop-b-understanding-test-matrix-v1.md`）。

## 11. Non-goals

- Product UI 実装 GO
- Human Ready / Merge / Deploy の自動付与
- Simulation による Actual Staff Value の代替
- Issue close / Ready 化 / LIVE WRITE
- 合意済み Test ID の silent remap
