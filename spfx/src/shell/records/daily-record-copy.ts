export const DEMO_DAILY_RECORD_PRESENTATION_NOTE =
  "完全合成データによる表示確認です。業務データには接続されていません。";

export const DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE =
  "記録の作成・編集・保存はこのデモでは実行できません。";

export function dailyRecordCopyIsFailClosed(text: string): boolean {
  const lowered = text.toLowerCase();
  const forbidden = [
    "利用可能です",
    "業務データに接続されています",
    "live sharepoint",
    "保存できます",
  ];
  for (const token of forbidden) {
    if (lowered.indexOf(token.toLowerCase()) >= 0) {
      return false;
    }
  }
  return text.indexOf("業務データには接続されていません") >= 0;
}
