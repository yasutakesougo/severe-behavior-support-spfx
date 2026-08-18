/**
 * FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 6 — per-user session-local ProcedureRecord draft resume.
 * Does not persist, mutate 未記録, change 5-state semantics, or enable LIVE WRITE.
 */

import { createEmptyProcedureRecordDraft } from "../procedure/procedure-record-draft";
import type {
  ProcedureBindingContext,
  ProcedureRecordDraft,
  ProcedureRecordFormSaveSnapshot,
} from "../procedure/procedure-types";
import type { ShellSaveState } from "../ux/save-state";

export type UsersSessionDraftByUserId = Readonly<Record<string, ProcedureRecordFormSaveSnapshot>>;

export const USERS_SESSION_DRAFT_RESUME_EMPTY: UsersSessionDraftByUserId = {};

function bindingContextKey(context: ProcedureBindingContext): string {
  return [
    context.userId,
    context.planId,
    String(context.planVersion),
    context.procedureId,
    context.procedureVersion,
    context.occurrenceId ?? "",
  ].join("|");
}

export function procedureBindingContextsMatch(
  left: ProcedureBindingContext,
  right: ProcedureBindingContext,
): boolean {
  return bindingContextKey(left) === bindingContextKey(right);
}

export function isResumeWorthyDraft(draft: ProcedureRecordDraft): boolean {
  return draft.result !== undefined || draft.note.trim().length > 0;
}

export function isResumeWorthySnapshot(snapshot: ProcedureRecordFormSaveSnapshot): boolean {
  if (snapshot.saveState !== "unsaved") {
    return true;
  }
  return isResumeWorthyDraft(snapshot.draft);
}

export function rememberUserSessionDraft(
  prev: UsersSessionDraftByUserId,
  userId: string | undefined,
  snapshot: ProcedureRecordFormSaveSnapshot,
): UsersSessionDraftByUserId {
  if (!userId) {
    return prev;
  }
  if (snapshot.context.userId !== userId) {
    return prev;
  }
  if (!isResumeWorthySnapshot(snapshot)) {
    if (prev[userId] === undefined) {
      return prev;
    }
    const next = { ...prev };
    delete next[userId];
    return next;
  }
  const existing = prev[userId];
  if (
    existing &&
    existing.saveState === snapshot.saveState &&
    existing.draft.result === snapshot.draft.result &&
    existing.draft.performedAtLocal === snapshot.draft.performedAtLocal &&
    existing.draft.note === snapshot.draft.note &&
    procedureBindingContextsMatch(existing.context, snapshot.context)
  ) {
    return prev;
  }
  return { ...prev, [userId]: snapshot };
}

export function forgetUserSessionDraft(
  prev: UsersSessionDraftByUserId,
  userId: string | undefined,
): UsersSessionDraftByUserId {
  if (!userId || prev[userId] === undefined) {
    return prev;
  }
  const next = { ...prev };
  delete next[userId];
  return next;
}

export function discardAllUserSessionDrafts(): UsersSessionDraftByUserId {
  return USERS_SESSION_DRAFT_RESUME_EMPTY;
}

export function snapshotForUser(
  byUserId: UsersSessionDraftByUserId,
  userId: string | undefined,
): ProcedureRecordFormSaveSnapshot | undefined {
  if (!userId) {
    return undefined;
  }
  return byUserId[userId];
}

export type ProcedureRecordResume = Readonly<{
  resumed: boolean;
  draft: ProcedureRecordDraft;
  saveState: ShellSaveState;
}>;

export function resolveProcedureRecordResume(input: {
  authorized: boolean;
  snapshot: ProcedureRecordFormSaveSnapshot | undefined;
  currentContext: ProcedureBindingContext;
}): ProcedureRecordResume {
  const empty: ProcedureRecordResume = {
    resumed: false,
    draft: createEmptyProcedureRecordDraft(),
    saveState: "unsaved",
  };
  if (!input.authorized || !input.snapshot) {
    return empty;
  }
  if (!procedureBindingContextsMatch(input.snapshot.context, input.currentContext)) {
    return empty;
  }
  if (!isResumeWorthySnapshot(input.snapshot)) {
    return empty;
  }
  return {
    resumed: true,
    draft: input.snapshot.draft,
    saveState: input.snapshot.saveState,
  };
}
