# Understanding Test Matrix v1 — Version-management screens

```text
repository: yasutakesougo/severe-behavior-support-spfx
kind: reusable acceptance pattern / understanding test matrix
status: DEFINED / ADOPTED
version: Understanding Test Matrix v1
scope: 版管理を伴う職員向け画面（例: SBS-MGMT-LOOP-B）
authority granted: NONE
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Simulation Evidence != Actual Staff Value Evidence
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
Target HEAD:
```

## 3. Axes

```text
C1 Source Immutability
  C1-PRE  C1-1 / C1-2   （操作前・予測理解）
  C1-POST C1-3 / C1-4   （操作後・結果確認）

C2 Draft / Production Separation
  C2-1 / C2-2 / C2-3
  C2-4a Draft != 本番保存
  C2-4b Draft != 適用開始

C3 Version Relationship
  C3-1 / C3-2 / C3-3 / C3-4
```

## 4. Items

### C1 — Source Immutability

目的: 「押しても現行の適用中版を直接変更しない」が理解できるか。

#### C1-PRE — 押す前から現行版が守られると思えるか

| ID | 問い | YES | PARTIAL | NO |
|---|---|---|---|---|
| C1-1 | CTA 語だけを見たとき、現行の適用中版が直接書き換わると予測しないか | 初見で「直接は変わらない」と予測できる | 不安・再読・近傍文探索の後に正しく予測できる | 最終的に「押すと現行が直接変わる」と予測したまま |
| C1-2 | 操作前の境界・説明コピーだけで、現行版が守られると理解できるか | 最小限の通常読解で理解 | 読み直し・探索後に理解 | 最終的に守られると説明できない / 上書きされると理解 |

#### C1-POST — 押した後、実際に現行版が残ったと理解できるか

| ID | 問い | YES | PARTIAL | NO |
|---|---|---|---|---|
| C1-3 | 操作後表示（例: 「元の版: N（変更しない）」）から、元版が残ったと理解できるか | 直後に理解 | 照合・再読後に理解 | 最終的に元版が消えた / 上書きされたと理解 |
| C1-4 | 操作後も現行 / 適用中表示が N のままであることを理解できるか | 直後に理解 | 他表示との照合後に理解 | 最終的に現行が N+1 に移ったと理解 |

組み合わせ例（具体 Finding 化）:

```text
C1-2 = PARTIAL
C1-3 = YES
→ 操作後は安全だと分かるが、押す前の不安が残る
→ 原則 P2 Finding（UI_FRICTION / WORDING）
```

### C2 — Draft / Production Separation

目的: Draft 作成 ≠ 本番保存 ≠ 適用開始 が分離して理解できるか。

| ID | 問い | YES | PARTIAL | NO |
|---|---|---|---|---|
| C2-1 | 作成直後の成果物を「下書き」として識別できるか | 初見で下書きと分かる | 探索後に分かる | 最終的に本番版 / 適用版だと理解 |
| C2-2 | Draft の扱いについて、正しい境界理解を保てるか（下記 NO 条件） | 不安なく / 最小読解で境界を正しく理解 | 「消えるのでは？」等の不安があっても、本番未保存であることは正しく理解（UI_FRICTION） | 下記 NO 条件 |
| C2-3 | Draft が「いま現場で使っている適用版になった」と誤解していないか | 適用版ではないと理解 | 推論・照合後に理解 | 適用版になったと理解 |
| C2-4a | Draft ≠ 本番保存 が理解できるか | 「本番未保存」等を初見で正しく理解 | 探索後に理解 | 「すでに本番保存された」と理解 |
| C2-4b | Draft ≠ 適用開始 が理解できるか | 「まだ適用開始されていない」を初見で正しく理解 | 他表示からの推論後に理解 | 「適用開始された / 現場で使い始めている」と理解 |

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

C2-4 を分けない採点は禁止する。全体を「Draft/Production Separation が弱い」と雑判定しない。

```text
例（今回型画面の典型）:
C2-4a = YES
C2-4b = PARTIAL
→ 「未適用の明示」だけが P2 候補。C2 全体を弱としない。
```

### C3 — Version Relationship

目的: 元の版 N（変更しない）と新しい下書き N+1（別物）の関係を追えるか。

| ID | 問い | YES | PARTIAL | NO |
|---|---|---|---|---|
| C3-1 | 版一覧（版 1/2/3…）の並び・関係を追えるか | 初見で追える | 軽い混乱の後に追える | 最終的に関係を説明できない |
| C3-2 | どれが現行版か特定できるか | 初見で特定 | 探索後に特定 | 現行版を特定できない |
| C3-3 | N+1 が N を上書きしたと思わないか | 上書きしていないと理解 | 照合後に理解 | N+1 が N を上書きしたと理解 |
| C3-4 | N+1 がすでに適用中だと思わないか | 未適用と理解 | 推論後に理解 | すでに適用中だと理解 |

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

## 6. Severity rules（別軸）

Severity は Judgement の別名ではない。安全境界への接続だけで付ける。

```text
YES
→ Finding なし、または軽微観測のみ

PARTIAL + 最終理解は正しい
→ 原則 P2

NO + 現行版上書き誤認
→ P1

NO + Draft = 適用開始
→ P1

NO + 現行版を特定できない
→ P1

NO + Draft = 本番保存（C2-4a）
→ P1 候補（境界誤認）
```

### C3 NO の Severity 分割

すべての C3 NO を自動で P1 にしない。

| 誤認内容 | Severity 候補 |
|---|---|
| 版 1/2/3 の一覧を少し混乱（C3-1） | P2 |
| どれが現行版か分からない（C3-2） | P1 |
| 版 N+1 が版 N を上書きしたと思う（C3-3） | P1 |
| 版 N+1 がすでに適用中だと思う（C3-4） | P1 |

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
| Test ID | 例: C1-2, C2-4b |
| Moment of friction | 迷い / 再読 / 照合が起きた瞬間 |
| Result | YES / PARTIAL / NO |
| Severity | NONE / P2 / P1 / P0（別軸） |

## 8. Actual Staff Value Check への転用

本 Matrix は 5 Persona だけでなく、Staff 1 の観察シートにそのまま使う。

職員本人には 12 問（C1〜C3 全項目）を読み上げない。

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
| Q1 | 次操作特定（導線）。C 軸外でもよいが Moment は記録 |
| Q2 | C1-PRE（C1-1 / C1-2）、必要なら C1-POST |
| Q3 | C3-1〜C3-4、C1-POST |
| Q4 | C2-4a / C2-4b、C2-3 |

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
