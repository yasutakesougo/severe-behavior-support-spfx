const STAFF_TIME_ZONE = "Asia/Tokyo" as const;

const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/;
const DATE_ONLY = /^(\d{4})[-/](\d{2})[-/](\d{2})$/;
const MONTH_ONLY = /^(\d{4})[-/](\d{2})$/;

function numberPart(value: string): string {
  return String(Number(value));
}

function partsForInstant(value: string): Readonly<Record<string, string>> | undefined {
  const instant = new Date(value);
  if (Number.isNaN(instant.getTime())) {
    return undefined;
  }

  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: STAFF_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);

  const result: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }
  }
  return result;
}

/** Presentation-only formatter. It never derives or persists a business date. */
export function formatStaffBusinessDateTime(value: string): string {
  const local = LOCAL_DATE_TIME.exec(value);
  if (local) {
    return `${numberPart(local[1])}年${numberPart(local[2])}月${numberPart(local[3])}日 ${local[4]}:${local[5]}`;
  }

  const parts = partsForInstant(value);
  if (!parts?.year || !parts.month || !parts.day || !parts.hour || !parts.minute) {
    return value;
  }
  return `${numberPart(parts.year)}年${numberPart(parts.month)}月${numberPart(parts.day)}日 ${parts.hour}:${parts.minute}`;
}

export function formatStaffBusinessDate(value: string): string {
  const date = DATE_ONLY.exec(value);
  if (!date) {
    return value;
  }
  return `${numberPart(date[1])}年${numberPart(date[2])}月${numberPart(date[3])}日`;
}

export function formatStaffBusinessMonth(value: string): string {
  const month = MONTH_ONLY.exec(value);
  if (!month) {
    return value;
  }
  return `${numberPart(month[1])}年${numberPart(month[2])}月`;
}
