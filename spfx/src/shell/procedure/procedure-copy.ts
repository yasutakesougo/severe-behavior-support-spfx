/**
 * FIELD-WORKFLOW UI (#356) — fail-closed copy + result labels.
 * PERFORMED_WITH_ADAPTATION / NOT_PERFORMED must not read as staff failure.
 */

import type { ProcedureRecordResultValue } from "./procedure-types";

export const FIELD_WORKFLOW_PRESENTATION_NOTE =
  "表示内容は合成データです。実際の業務データには反映されません。" as const;

export const FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE =
  "入力内容は既存の記録処理で確認されます。実際の業務データには書き込まれません。保存状態は処理結果を確認してから表示します。" as const;

export const FIELD_WORKFLOW_HISTORICAL_UNRESOLVED_NOTE =
  "実施時点の計画版を解決できません。最新版への付け替えはしません（fail-closed）。" as const;

export const FIELD_WORKFLOW_NO_AUTO_JUDGE_NOTE =
  "見直し材料の表示です。「変更すべき」自動判定は行いません。" as const;

export const FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE =
  "保存に失敗しました。入力内容は保持しています。内容を確認してから再試行できます。" as const;

export const FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE =
  "保存結果を確認できていません。成功・失敗のいずれにも丸めません。即時の再送は禁止です。" as const;

export const FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE =
  "計画・手順の文脈は引き継がれています。再選択は不要です。" as const;

export const FIELD_WORKFLOW_CORRECTION_ENTRY_NOTE =
  "元の記録と予定の文脈を確認して、訂正経路へ進みます。元の記録を上書きしません。" as const;

export const FIELD_WORKFLOW_CORRECTION_PRESENTATION_NOTE =
  "訂正内容は合成データです。元の記録を保持したまま、デモ内で訂正を確認できます。実際の業務データには反映されません。" as const;

export const FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE =
  "訂正はデモ内で保存状態を確認できます。実際の業務データには反映されません。元の記録は上書きしません。" as const;

export const FIELD_WORKFLOW_CANCELLATION_ENTRY_NOTE =
  "対象記録と予定の文脈を確認して、取消経路へ進みます。記録の物理削除は行いません。" as const;

export const FIELD_WORKFLOW_CANCELLATION_PRESENTATION_NOTE =
  "取消内容は合成データです。元の記録は削除せず、取消の履歴を追加してデモ内で確認できます。実際の業務データには反映されません。" as const;

export const FIELD_WORKFLOW_CANCELLATION_SAVE_BOUNDARY_NOTE =
  "取消はデモ内で保存状態を確認できます。元の記録は削除せず、実際の業務データには反映されません。" as const;

export const PROCEDURE_RECORD_RESULT_LABELS: Readonly<Record<ProcedureRecordResultValue, string>> =
  {
    PERFORMED_AS_PLANNED: "手順どおり実施",
    PERFORMED_WITH_ADAPTATION: "一部変更して実施",
    NOT_PERFORMED: "実施できなかった",
  };

export const PROCEDURE_RECORD_RESULT_HINTS: Readonly<Record<ProcedureRecordResultValue, string>> = {
  PERFORMED_AS_PLANNED: "計画どおり実施できた事実の記録です。",
  PERFORMED_WITH_ADAPTATION: "一部変更した事実の記録です。職員の失敗表示ではありません。",
  NOT_PERFORMED: "実施できなかった事実の記録です。職員の失敗表示ではありません。",
};

export function labelForProcedureRecordResult(result: ProcedureRecordResultValue): string {
  return PROCEDURE_RECORD_RESULT_LABELS[result];
}

export function hintForProcedureRecordResult(result: ProcedureRecordResultValue): string {
  return PROCEDURE_RECORD_RESULT_HINTS[result];
}

/** Copy helpers must not collapse adaptation / not-performed into failure language. */
export function procedureResultCopyIsNonFailure(result: ProcedureRecordResultValue): boolean {
  const label = PROCEDURE_RECORD_RESULT_LABELS[result];
  const hint = PROCEDURE_RECORD_RESULT_HINTS[result];
  const bannedInLabel = ["失敗", "エラー", "違反", "不合格"];
  if (bannedInLabel.some((token) => label.includes(token))) {
    return false;
  }
  // Hints may say 「失敗表示ではありません」— require the explicit non-failure framing
  // for adaptation / not-performed.
  if (result === "PERFORMED_WITH_ADAPTATION" || result === "NOT_PERFORMED") {
    return hint.includes("失敗表示ではありません");
  }
  return true;
}
