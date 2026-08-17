const { execSync } = require("child_process");
const webUrl = "https://isogokatudouhome.sharepoint.com/sites/severe-support-procedurerecord-test";

function run(cmd) {
  return JSON.parse(execSync(cmd, { encoding: "utf8" }));
}

function addField(
  listTitle,
  internalName,
  type,
  required = false,
  indexed = false,
  unique = false,
) {
  try {
    run(
      `m365 spo field get --webUrl "${webUrl}" --listTitle "${listTitle}" --name "${internalName}" --output json`,
    );
    console.log(`  Column ${internalName} exists in ${listTitle}.`);
  } catch {
    const xml = `<Field Type="${type}" DisplayName="${internalName}" Name="${internalName}" StaticName="${internalName}" Required="${required ? "TRUE" : "FALSE"}" Indexed="${indexed ? "TRUE" : "FALSE"}" EnforceUniqueValues="${unique ? "TRUE" : "FALSE"}" />`;
    const cmd = `m365 spo field add --webUrl "${webUrl}" --listTitle "${listTitle}" --xml "${xml.replace(/"/g, '\\"')}" --output json`;
    run(cmd);
    console.log(
      `  Created column ${internalName} (${type}, req=${required}, idx=${indexed}, uniq=${unique}) in ${listTitle}.`,
    );
  }
}

function ensureList(title) {
  try {
    const list = run(`m365 spo list get --webUrl "${webUrl}" --title "${title}" --output json`);
    console.log(`List ${title} exists. GUID: ${list.Id}`);
    return list;
  } catch {
    const list = run(
      `m365 spo list add --webUrl "${webUrl}" --title "${title}" --baseTemplate GenericList --output json`,
    );
    console.log(`Created List ${title}. GUID: ${list.Id}`);
    return list;
  }
}

console.log("=== Provisioning Five Kiosk Lists ===");

// 1. SBS_SCHEDULE_ITEMS
ensureList("SBS_SCHEDULE_ITEMS");
addField("SBS_SCHEDULE_ITEMS", "schScheduleItemId", "Text", true, true, true);
addField("SBS_SCHEDULE_ITEMS", "schOrganizationId", "Text", true);
addField("SBS_SCHEDULE_ITEMS", "schSiteId", "Text", true);
addField("SBS_SCHEDULE_ITEMS", "schProcedureId", "Text", true);
addField("SBS_SCHEDULE_ITEMS", "schProcedureVersion", "Text", true);
addField("SBS_SCHEDULE_ITEMS", "schApprovalState", "Text", true);
addField("SBS_SCHEDULE_ITEMS", "schPlanId", "Text", true);
addField("SBS_SCHEDULE_ITEMS", "schPlanVersion", "Number", true);
addField("SBS_SCHEDULE_ITEMS", "schScheduledTime", "Text", true);
addField("SBS_SCHEDULE_ITEMS", "schActivityLabel", "Text", true);
addField("SBS_SCHEDULE_ITEMS", "schCatalogOrder", "Number", true);

// 2. SBS_SCHEDULED_OCCURRENCES
ensureList("SBS_SCHEDULED_OCCURRENCES");
addField("SBS_SCHEDULED_OCCURRENCES", "occOccurrenceId", "Text", true, true, true);
addField("SBS_SCHEDULED_OCCURRENCES", "occOrganizationId", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occSiteId", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occUserId", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occLocalDate", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occTimeZone", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occScheduleItemId", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occProcedureId", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occProcedureVersion", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occApprovalState", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occPlanId", "Text", true);
addField("SBS_SCHEDULED_OCCURRENCES", "occPlanVersion", "Number", true);

// 3. SBS_PROCEDURE_RECORD_OCCURRENCE_BINDINGS
ensureList("SBS_PROCEDURE_RECORD_OCCURRENCE_BINDINGS");
addField("SBS_PROCEDURE_RECORD_OCCURRENCE_BINDINGS", "bindOccurrenceId", "Text", true, true);
addField("SBS_PROCEDURE_RECORD_OCCURRENCE_BINDINGS", "bindRecordId", "Text", true, true);

// 4. SBS_PROCEDURE_OBSERVATIONS
ensureList("SBS_PROCEDURE_OBSERVATIONS");
addField("SBS_PROCEDURE_OBSERVATIONS", "obsRecordId", "Text", true, true);
addField("SBS_PROCEDURE_OBSERVATIONS", "obsOccurrenceId", "Text", false);
addField("SBS_PROCEDURE_OBSERVATIONS", "obsCondition", "Text", false);
addField("SBS_PROCEDURE_OBSERVATIONS", "obsResponse", "Text", false);
addField("SBS_PROCEDURE_OBSERVATIONS", "obsChange", "Text", false);
addField("SBS_PROCEDURE_OBSERVATIONS", "obsMemo", "Note", false);

// 5. SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS
ensureList("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS");
addField("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS", "lifeLifecycleEventId", "Text", true, true, true);
addField(
  "SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS",
  "lifeLifecycleIdempotencyKey",
  "Text",
  true,
  true,
  true,
);
addField("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS", "lifeLifecyclePayloadFingerprint", "Text", true);
addField("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS", "lifeEventType", "Text", true);
addField("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS", "lifeTargetRecordId", "Text", true, true);
addField("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS", "lifeReplacementRecordId", "Text", false);
addField("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS", "lifeRecordedAt", "Text", true);
addField("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS", "lifeRecordedBy", "Text", true);
addField("SBS_PROCEDURE_RECORD_LIFECYCLE_EVENTS", "lifeReason", "Text", false);

console.log("=== Provisioning Five Kiosk Lists Completed Successfully ===");
