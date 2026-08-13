export const DEMO_DAILY_RECORD_PRESENTATION_NOTE =
  "完全合成データによる表示確認です。業務データには接続されていません。";

export const DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE =
  "作成・保存は実行できません（実保存なし）。入力イメージは画面内の一時編集のみで、保存済みにはなりません。";

export const DEMO_DAILY_RECORD_INCOMPLETE_HINT =
  "未完了確認から対象を選ぶと、下の記録入力イメージが追随します。";

export const DEMO_DAILY_RECORD_DRAFT_HINT =
  "入力イメージはローカルの一時編集です。画面を離れると破棄され、業務データへは保存されません。";

export const DEMO_DAILY_RECORD_RECENT_HINT =
  "最近の記録は閲覧サンプルです。ここからは編集できません。";

/**
 * INV-17: incomplete zero-result only — not “all clear” business completion.
 * Default synthetic fixture is non-empty; this copy is for empty presentation paths.
 */
export const DEMO_DAILY_RECORD_INCOMPLETE_EMPTY_NOTE =
  "表示する未完了確認はありません（合成データ）。業務上の未完了が無いことを示すものではありません。";

/**
 * INV-17: recent-records zero-result only — not live retrieval failure / facility-empty.
 */
export const DEMO_DAILY_RECORD_RECENT_EMPTY_NOTE =
  "表示する最近の記録はありません（合成データ）。業務データが空であることを示すものではありません。";

export function dailyRecordCopyIsFailClosed(text: string): boolean {
  const lowered = text.toLowerCase();
  const forbidden = [
    "利用可能です",
    "業務データに接続されています",
    "live sharepoint",
    "保存できます",
    "保存済みです",
  ];
  for (const token of forbidden) {
    if (lowered.indexOf(token.toLowerCase()) >= 0) {
      return false;
    }
  }
  return text.indexOf("業務データには接続されていません") >= 0;
}
