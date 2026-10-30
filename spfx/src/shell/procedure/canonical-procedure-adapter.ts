import * as React from "react";
import type {
  CanonicalProcedureResolutionOutcome,
  CanonicalProcedureUnresolvedReasonCode,
} from "../../sbs-domain/canonical-procedure-resolver.bundle";
import { resolveCanonicalProcedureFromEntities } from "../../sbs-domain/canonical-procedure-resolver.bundle";
import type { TodaySupportItem } from "../../sbs-domain/kiosk-read-model.bundle";
import type { ShellSiteSelection } from "../ux/site-selection";
import { KIOSK_FIXTURE_ORG_ID } from "./kiosk-today-support-fixture";
import type {
  AnyShellCurrentProcedurePresentation,
  ProcedureBindingContext,
} from "./procedure-types";
import type { W2SyntheticProcedureDataSource } from "./w2-synthetic-procedure-fixture";

export type ProcedureTargetIdentity = Readonly<{
  organizationId: string;
  siteId: string;
  userId: string;
  occurrenceId: string;
  localDate: string;
  planId: string;
  planVersion: number;
  procedureId: string;
  procedureVersion: string;
  scheduleItemId: string;
}>;

export function mintProcedureTargetKey(target: ProcedureTargetIdentity): string {
  return [
    "target-v1",
    target.organizationId,
    target.siteId,
    target.userId,
    target.occurrenceId,
    target.localDate,
    target.planId,
    String(target.planVersion),
    target.procedureId,
    target.procedureVersion,
    target.scheduleItemId,
  ]
    .map((token) => encodeURIComponent(token))
    .join("::");
}

export type CurrentProcedureViewState =
  | Readonly<{
      status: "LOADING";
      targetKey: string;
      dataSource: W2SyntheticProcedureDataSource;
      dataSourceRevision: number;
    }>
  | Readonly<{
      status: "RESOLVED";
      targetKey: string;
      dataSource: W2SyntheticProcedureDataSource;
      dataSourceRevision: number;
      outcome: Extract<CanonicalProcedureResolutionOutcome, { status: "RESOLVED" }>;
    }>
  | Readonly<{
      status: "UNRESOLVED";
      targetKey: string;
      dataSource: W2SyntheticProcedureDataSource;
      dataSourceRevision: number;
      reasonCode: CanonicalProcedureUnresolvedReasonCode;
      unresolvedReason: string;
    }>
  | Readonly<{
      status: "FETCH_FAILED";
      targetKey: string;
      dataSource: W2SyntheticProcedureDataSource;
      dataSourceRevision: number;
      errorMessage: string;
    }>
  | Readonly<{
      status: "INCOMPLETE";
      targetKey: string;
      dataSource: W2SyntheticProcedureDataSource;
      dataSourceRevision: number;
      unresolvedReason: string;
    }>;

export interface UseCanonicalProcedureCoordinatorInput {
  currentProcedureOpen: boolean;
  siteSelection: ShellSiteSelection;
  selectedOccurrenceItem?: TodaySupportItem;
  dataSource: W2SyntheticProcedureDataSource;
  dataSourceRevision: number;
}

export function useCanonicalProcedureCoordinator(
  input: UseCanonicalProcedureCoordinatorInput,
): CurrentProcedureViewState {
  const {
    currentProcedureOpen,
    siteSelection,
    selectedOccurrenceItem,
    dataSource,
    dataSourceRevision,
  } = input;

  const generationRef = React.useRef(0);

  const isSiteSupported = siteSelection === "SITE-ISG";
  const unsupportedReason =
    siteSelection === "unselected"
      ? "事業所が選択されていません。上部の事業所選択から磯子（SITE-ISG）を選択してください。"
      : siteSelection === "SITE-HOM"
        ? "選択された事業所（本牧 SITE-HOM）の合成手順データは存在しません。合成環境は磯子（SITE-ISG）限定です。"
        : undefined;

  const activeTarget: ProcedureTargetIdentity | undefined = React.useMemo(() => {
    if (!currentProcedureOpen || !isSiteSupported || !selectedOccurrenceItem) return undefined;
    const it = selectedOccurrenceItem;
    return {
      organizationId: KIOSK_FIXTURE_ORG_ID,
      siteId: siteSelection,
      userId: it.userId,
      occurrenceId: it.occurrenceId,
      localDate: it.localDate,
      planId: it.planId,
      planVersion: it.planVersion,
      procedureId: it.procedure.ProcedureId,
      procedureVersion: it.procedure.ProcedureVersion,
      scheduleItemId: it.scheduleItemId,
    };
  }, [
    currentProcedureOpen,
    isSiteSupported,
    siteSelection,
    selectedOccurrenceItem?.userId,
    selectedOccurrenceItem?.occurrenceId,
    selectedOccurrenceItem?.localDate,
    selectedOccurrenceItem?.planId,
    selectedOccurrenceItem?.planVersion,
    selectedOccurrenceItem?.procedure.ProcedureId,
    selectedOccurrenceItem?.procedure.ProcedureVersion,
    selectedOccurrenceItem?.scheduleItemId,
  ]);

  const currentTargetKey = activeTarget ? mintProcedureTargetKey(activeTarget) : "";

  const [viewState, setViewState] = React.useState<CurrentProcedureViewState>(() => ({
    status: "LOADING",
    targetKey: currentTargetKey,
    dataSource,
    dataSourceRevision,
  }));

  const isSynchronized =
    currentProcedureOpen &&
    Boolean(activeTarget) &&
    viewState.targetKey === currentTargetKey &&
    viewState.dataSource === dataSource &&
    viewState.dataSourceRevision === dataSourceRevision;

  const effectiveViewState: CurrentProcedureViewState = isSynchronized
    ? viewState
    : {
        status: "LOADING",
        targetKey: currentTargetKey,
        dataSource,
        dataSourceRevision,
      };

  React.useEffect(() => {
    generationRef.current += 1;
    const thisGeneration = generationRef.current;

    if (!currentProcedureOpen || !isSiteSupported || !activeTarget) {
      return () => {
        generationRef.current += 1;
      };
    }

    const expectedTargetKey = currentTargetKey;
    const expectedDataSource = dataSource;
    const expectedRevision = dataSourceRevision;

    setViewState({
      status: "LOADING",
      targetKey: expectedTargetKey,
      dataSource: expectedDataSource,
      dataSourceRevision: expectedRevision,
    });

    let isCancelled = false;

    const executeResolution = async (): Promise<void> => {
      try {
        const bundle = await expectedDataSource.loadEntities(activeTarget);
        if (isCancelled || generationRef.current !== thisGeneration) return;

        if (!bundle) {
          setViewState({
            status: "FETCH_FAILED",
            targetKey: expectedTargetKey,
            dataSource: expectedDataSource,
            dataSourceRevision: expectedRevision,
            errorMessage: "手順データの取得に失敗しました。通信状況を確認して再度開いてください。",
          });
          return;
        }

        if (
          bundle.planVersions.length === 0 ||
          bundle.bindings.length === 0 ||
          bundle.scheduleItems.length === 0 ||
          bundle.occurrences.length === 0
        ) {
          setViewState({
            status: "INCOMPLETE",
            targetKey: expectedTargetKey,
            dataSource: expectedDataSource,
            dataSourceRevision: expectedRevision,
            unresolvedReason:
              "支援手順の解決に必要な正本データ（計画版・割当・日課・予定）が不完全です。",
          });
          return;
        }

        const outcome = resolveCanonicalProcedureFromEntities({
          query: {
            organizationId: activeTarget.organizationId,
            siteId: activeTarget.siteId,
            userId: activeTarget.userId,
            planId: activeTarget.planId,
            planVersion: activeTarget.planVersion,
            procedureId: activeTarget.procedureId,
            procedureVersion: activeTarget.procedureVersion,
            scheduleItemId: activeTarget.scheduleItemId,
            occurrenceId: activeTarget.occurrenceId,
          },
          planVersions: bundle.planVersions,
          bindings: bundle.bindings,
          scheduleItems: bundle.scheduleItems,
          occurrences: bundle.occurrences,
        });

        if (isCancelled || generationRef.current !== thisGeneration) return;

        if (outcome.status === "RESOLVED") {
          setViewState({
            status: "RESOLVED",
            targetKey: expectedTargetKey,
            dataSource: expectedDataSource,
            dataSourceRevision: expectedRevision,
            outcome,
          });
        } else {
          setViewState({
            status: "UNRESOLVED",
            targetKey: expectedTargetKey,
            dataSource: expectedDataSource,
            dataSourceRevision: expectedRevision,
            reasonCode: outcome.reasonCode,
            unresolvedReason: outcome.unresolvedReason,
          });
        }
      } catch (err: unknown) {
        if (isCancelled || generationRef.current !== thisGeneration) return;
        setViewState({
          status: "FETCH_FAILED",
          targetKey: expectedTargetKey,
          dataSource: expectedDataSource,
          dataSourceRevision: expectedRevision,
          errorMessage:
            err instanceof Error
              ? err.message
              : "手順データの取得中に予期しないエラーが発生しました。",
        });
      }
    };

    executeResolution().catch(() => {
      // Unhandled promise rejection guard
    });

    return () => {
      isCancelled = true;
      generationRef.current += 1;
    };
  }, [currentProcedureOpen, isSiteSupported, currentTargetKey, dataSource, dataSourceRevision]);

  if (currentProcedureOpen && !isSiteSupported) {
    return {
      status: "UNRESOLVED",
      targetKey: "",
      dataSource,
      dataSourceRevision,
      reasonCode: "USER_OR_SITE_MISMATCH",
      unresolvedReason: unsupportedReason ?? "この事業所では合成手順を表示できません。",
    };
  }

  if (currentProcedureOpen && !activeTarget) {
    return {
      status: "UNRESOLVED",
      targetKey: "",
      dataSource,
      dataSourceRevision,
      reasonCode: "INPUT_INVALID",
      unresolvedReason: "選択された予定を確認できません。",
    };
  }

  return effectiveViewState;
}

export function buildOverviewCurrentProcedurePresentation(input: {
  viewState: CurrentProcedureViewState;
  selectedOccurrenceItem?: TodaySupportItem;
  selectedOccurrenceId?: string;
  activeOrganizationId: string;
  activeSiteId: string;
}): AnyShellCurrentProcedurePresentation {
  const {
    viewState,
    selectedOccurrenceItem,
    selectedOccurrenceId,
    activeOrganizationId,
    activeSiteId,
  } = input;

  const liveOccurrenceStatus = selectedOccurrenceItem?.effectiveStatus;

  const baseContext: ProcedureBindingContext = {
    organizationId: activeOrganizationId,
    siteId: activeSiteId,
    userId: selectedOccurrenceItem?.userId ?? "",
    personLabel: selectedOccurrenceItem?.personLabel ?? "対象者未特定",
    procedureId: selectedOccurrenceItem?.procedure?.ProcedureId ?? "",
    procedureVersion: selectedOccurrenceItem?.procedure?.ProcedureVersion ?? "",
    planId: selectedOccurrenceItem?.planId ?? "",
    planVersion: selectedOccurrenceItem?.planVersion ?? 0,
    planPeriodLabel:
      viewState.status === "RESOLVED"
        ? viewState.outcome.planPeriodLabel
        : selectedOccurrenceItem
          ? `第${selectedOccurrenceItem.planVersion}版`
          : "対象未特定",
    occurrenceId: selectedOccurrenceItem?.occurrenceId ?? selectedOccurrenceId ?? "",
  };

  if (!selectedOccurrenceItem) {
    return {
      heading: "現在の支援手順",
      summaryPrompt: "指定された支援手順（occurrence）が見つかりません。",
      lookupStatus: "UNRESOLVED",
      unresolvedReason:
        "指定された支援手順（occurrence）が見つかりません。安全のため手順詳細は表示されません。",
      canStartProcedureRecord: false,
      occurrenceStatus: undefined,
      context: baseContext,
      projection: undefined,
    };
  }

  if (viewState.status === "RESOLVED") {
    return {
      heading: "現在の支援手順",
      summaryPrompt: `${selectedOccurrenceItem.activityLabel}（${selectedOccurrenceItem.scheduledTime}）の支援手順を確認します。`,
      lookupStatus: "RESOLVED",
      canStartProcedureRecord: false,
      occurrenceStatus: liveOccurrenceStatus,
      context: baseContext,
      projection: viewState.outcome.projection,
    };
  }

  if (viewState.status === "LOADING") {
    return {
      heading: "現在の支援手順",
      summaryPrompt: `${selectedOccurrenceItem.activityLabel}（${selectedOccurrenceItem.scheduledTime}）の手順本文を読み込んでいます。`,
      lookupStatus: "LOADING",
      canStartProcedureRecord: false,
      occurrenceStatus: liveOccurrenceStatus,
      context: baseContext,
      projection: undefined,
    };
  }

  if (viewState.status === "FETCH_FAILED") {
    return {
      heading: "現在の支援手順",
      summaryPrompt: "手順データの取得に失敗しました。",
      lookupStatus: "FETCH_FAILED",
      unresolvedReason: viewState.errorMessage,
      canStartProcedureRecord: false,
      occurrenceStatus: liveOccurrenceStatus,
      context: baseContext,
      projection: undefined,
    };
  }

  if (viewState.status === "INCOMPLETE") {
    return {
      heading: "現在の支援手順",
      summaryPrompt: "手順解決に必要なデータが不足しています。",
      lookupStatus: "INCOMPLETE",
      unresolvedReason: viewState.unresolvedReason,
      canStartProcedureRecord: false,
      occurrenceStatus: liveOccurrenceStatus,
      context: baseContext,
      projection: undefined,
    };
  }

  return {
    heading: "現在の支援手順",
    summaryPrompt: "選択された予定の手順本文を解決できませんでした。",
    lookupStatus: "UNRESOLVED",
    unresolvedReason: viewState.unresolvedReason,
    canStartProcedureRecord: false,
    occurrenceStatus: liveOccurrenceStatus,
    context: baseContext,
    projection: undefined,
  };
}
