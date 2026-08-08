/**
 * Accepted #29 Internal Names for SBS_AUDIT_EVENTS physical rows.
 * Display Names are intentionally omitted (Revision 2 undefined).
 */

export const AUDIT_EVENT_LIST = {
  provisioningKey: "SBS_AUDIT_EVENTS",
  displayName: "SBS Audit Events",
  path: "Lists/SBSAuditEvents",
} as const;

export const AUDIT_EVENT_PHYSICAL_COLUMNS = {
  recordIdentityKey: "SbsAudRecordIdentityKey",
  idempotencyIdentityKey: "SbsAudIdempotencyIdentityKey",
  organizationIdEncoded: "SbsAudOrganizationIdEncoded",
  auditEventIdEncoded: "SbsAudAuditEventIdEncoded",
  idempotencyKeyEncoded: "SbsAudIdempotencyKeyEncoded",
  siteIdEncoded: "SbsAudSiteIdEncoded",
  actorStaffIdEncoded: "SbsAudActorStaffIdEncoded",
  actionCode: "SbsAudActionCode",
  targetType: "SbsAudTargetType",
  targetRecordIdEncoded: "SbsAudTargetRecordIdEncoded",
  result: "SbsAudResult",
  occurredAtRaw: "SbsAudOccurredAtRaw",
  occurredAtUtc: "SbsAudOccurredAtUtc",
  correlationIdEncoded: "SbsAudCorrelationIdEncoded",
  reasonCode: "SbsAudReasonCode",
  appVersionEncoded: "SbsAudAppVersionEncoded",
  ruleSetVersionEncoded: "SbsAudRuleSetVersionEncoded",
} as const;

/**
 * Synthetic SharePoint-shaped list item.
 * System metadata may exist on the row but must never enter logical evidence.
 */
export type AuditEventPhysicalRow = Readonly<{
  SbsAudRecordIdentityKey: string;
  SbsAudIdempotencyIdentityKey: string;
  SbsAudOrganizationIdEncoded: string;
  SbsAudAuditEventIdEncoded: string;
  SbsAudIdempotencyKeyEncoded: string;
  SbsAudSiteIdEncoded?: string;
  SbsAudActorStaffIdEncoded?: string;
  SbsAudActionCode: string;
  SbsAudTargetType: string;
  SbsAudTargetRecordIdEncoded?: string;
  SbsAudResult: string;
  SbsAudOccurredAtRaw: string;
  SbsAudOccurredAtUtc: string;
  SbsAudCorrelationIdEncoded: string;
  SbsAudReasonCode?: string;
  SbsAudAppVersionEncoded?: string;
  SbsAudRuleSetVersionEncoded?: string;
  // Physical-only metadata (ignored on read conversion)
  ListItemId?: number;
  ETag?: string;
  Created?: string;
  Modified?: string;
  Author?: string;
  Title?: string;
}>;
