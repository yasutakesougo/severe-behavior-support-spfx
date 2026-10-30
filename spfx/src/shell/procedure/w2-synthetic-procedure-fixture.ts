import type {
  ScheduleItem,
  ScheduledOccurrence,
  SupportPlanVersion,
  SupportPlanVersionProcedureBinding,
} from "../../sbs-domain/canonical-procedure-resolver.bundle";
import {
  KIOSK_FIXTURE_LOCAL_DATE,
  KIOSK_FIXTURE_ORG_ID,
  KIOSK_FIXTURE_SITE_ID,
  KIOSK_FIXTURE_USER_ID,
  KIOSK_SYNTHETIC_SCHEDULE_ITEMS,
} from "./kiosk-today-support-fixture";

/**
 * W2-A Canonical SupportPlanVersion (plan-001, v1) for user-a.
 * Aligned with KIOSK_SYNTHETIC_SCHEDULE_ITEMS (plan-001, version 1).
 */
export const W2_SYNTHETIC_SUPPORT_PLAN_VERSION_1: SupportPlanVersion = {
  planId: "plan-001",
  OrganizationId: KIOSK_FIXTURE_ORG_ID,
  SiteId: KIOSK_FIXTURE_SITE_ID,
  UserId: KIOSK_FIXTURE_USER_ID,
  version: 1,
  goals: [
    "見通しを持った日課の進行と、落ち着いた活動参加を目指す。",
    "体調や気分の変化を捉え、適切な休息と見守りを提供する。",
  ],
  supportMethods: [
    "次の活動内容を絵カードやスケジュール表で事前に提示する。",
    "本人のペースに合わせて指示を短く区切り、受容的な態度で接する。",
    "着席や準備ができた段階で具体的に褒めて認める。",
  ],
  precautions: [
    "急な予定変更を予告なしに行わない。",
    "強い口調や威圧的な声かけを避ける。",
    "混乱時は無理に活動を継続させず、静かな環境で休息を促す。",
  ],
  reviewCriteria: ["毎日の予定実績・支援記録の整合確認", "定期的な手順評価"],
  versionCreatedBy: "synthetic-planner-001",
  versionCreatedAt: "2026-08-01T00:00:00.000Z",
};

/**
 * W2-A Bindings for plan-001 v1 connecting to the 4 approved procedure references:
 * 1. proc-morning (v1)
 * 2. proc-lunch (v1)
 * 3. proc-creation (v1)
 * 4. proc-conflict (v1)
 */
export const W2_SYNTHETIC_BINDINGS: readonly SupportPlanVersionProcedureBinding[] = [
  {
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    planId: "plan-001",
    planVersion: 1,
    Procedure: {
      ProcedureId: "proc-morning",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
  },
  {
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    planId: "plan-001",
    planVersion: 1,
    Procedure: {
      ProcedureId: "proc-lunch",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
  },
  {
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    planId: "plan-001",
    planVersion: 1,
    Procedure: {
      ProcedureId: "proc-creation",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
  },
  {
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    planId: "plan-001",
    planVersion: 1,
    Procedure: {
      ProcedureId: "proc-conflict",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
  },
];

/**
 * W2-A ScheduledOccurrences for all 5 schedule slots.
 * OccurrenceId matches mintOccurrenceId SHA-256 digests byte-for-byte.
 */
export const W2_SYNTHETIC_OCCURRENCES: readonly ScheduledOccurrence[] = [
  {
    schemaVersion: "1.0.0",
    OccurrenceId: "e518a51d6c45a6541747d80439d9d0d9879b46d4d7ef9e359596a3833feac795",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
    TimeZone: "Asia/Tokyo",
    ScheduleItemId: "sch-001",
    Procedure: {
      ProcedureId: "proc-morning",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
  },
  {
    schemaVersion: "1.0.0",
    OccurrenceId: "141b8d111dc5d5d98f59a4d2348322a3093450b7de0457ed3ebef839c9f3b9c9",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
    TimeZone: "Asia/Tokyo",
    ScheduleItemId: "sch-002",
    Procedure: {
      ProcedureId: "proc-lunch",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
  },
  {
    schemaVersion: "1.0.0",
    OccurrenceId: "e24282df42dacc449ae93456024531c5379df05bce85ef79d20436498a0c80be",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
    TimeZone: "Asia/Tokyo",
    ScheduleItemId: "sch-003",
    Procedure: {
      ProcedureId: "proc-creation",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
  },
  {
    schemaVersion: "1.0.0",
    OccurrenceId: "1b1174bbb3370eaa4f67d40764e59dfeb68630fc48ff6ced3d9cc9d6d53bb549",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
    TimeZone: "Asia/Tokyo",
    ScheduleItemId: "sch-004-repeated",
    Procedure: {
      ProcedureId: "proc-lunch",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
  },
  {
    schemaVersion: "1.0.0",
    OccurrenceId: "06ab5aaaa79db8907b4340bea1c8f05398bb408b49ab50c75e8b8c3e8c3a6563",
    OrganizationId: KIOSK_FIXTURE_ORG_ID,
    SiteId: KIOSK_FIXTURE_SITE_ID,
    UserId: KIOSK_FIXTURE_USER_ID,
    LocalDate: KIOSK_FIXTURE_LOCAL_DATE,
    TimeZone: "Asia/Tokyo",
    ScheduleItemId: "sch-005-conflict",
    Procedure: {
      ProcedureId: "proc-conflict",
      ProcedureVersion: "v1",
      ApprovalState: "APPROVED",
    },
    planId: "plan-001",
    planVersion: 1,
  },
];

export type CanonicalProcedureEntityBundle = Readonly<{
  planVersions: readonly SupportPlanVersion[];
  bindings: readonly SupportPlanVersionProcedureBinding[];
  scheduleItems: readonly ScheduleItem[];
  occurrences: readonly ScheduledOccurrence[];
}>;

export interface W2SyntheticProcedureDataSource {
  loadEntities(target: {
    organizationId: string;
    siteId: string;
    userId: string;
  }): Promise<CanonicalProcedureEntityBundle | undefined>;
}

export class DefaultW2SyntheticProcedureDataSource implements W2SyntheticProcedureDataSource {
  private _simulateFetchFailure: boolean = false;
  private _simulateIncomplete: boolean = false;

  public setSimulateFetchFailure(value: boolean): void {
    this._simulateFetchFailure = value;
  }

  public setSimulateIncomplete(value: boolean): void {
    this._simulateIncomplete = value;
  }

  public async loadEntities(target: {
    organizationId: string;
    siteId: string;
    userId: string;
  }): Promise<CanonicalProcedureEntityBundle | undefined> {
    if (this._simulateFetchFailure) {
      return undefined;
    }
    if (this._simulateIncomplete) {
      return {
        planVersions: [],
        bindings: [],
        scheduleItems: [],
        occurrences: [],
      };
    }

    if (
      target.organizationId !== KIOSK_FIXTURE_ORG_ID ||
      target.siteId !== KIOSK_FIXTURE_SITE_ID ||
      target.userId !== KIOSK_FIXTURE_USER_ID
    ) {
      return {
        planVersions: [],
        bindings: [],
        scheduleItems: [],
        occurrences: [],
      };
    }

    return {
      planVersions: [W2_SYNTHETIC_SUPPORT_PLAN_VERSION_1],
      bindings: W2_SYNTHETIC_BINDINGS,
      scheduleItems: KIOSK_SYNTHETIC_SCHEDULE_ITEMS,
      occurrences: W2_SYNTHETIC_OCCURRENCES,
    };
  }
}
