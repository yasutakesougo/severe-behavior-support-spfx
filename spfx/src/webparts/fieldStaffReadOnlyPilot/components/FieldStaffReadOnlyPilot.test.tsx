import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import FieldStaffReadOnlyPilot, {
  SYNTHETIC_PILOT_ALLOWLIST,
  SYNTHETIC_PILOT_LIST_GUID,
  SYNTHETIC_PILOT_ROW,
  SYNTHETIC_PILOT_TRANSPORT,
  type FieldStaffReadOnlyPilotProps,
  type FieldStaffReadOnlyPilotStrings,
} from "./FieldStaffReadOnlyPilot";

const STRINGS: FieldStaffReadOnlyPilotStrings = {
  pilotTitle: "FIELD_STAFF 読み取り専用パイロット",
  syntheticBanner: "SYNTHETIC PILOT — 本番データではありません",
  loadingLabel: "合成データを読み込んでいます。",
  emptyLabel: "0件（この合成条件に一致する記録はありません）",
  forbiddenLabel: "この合成パイロットでは表示できません。",
  fetchFailedLabel: "合成データの取得に失敗しました。",
  recordHeading: "合成 ProcedureRecord",
  personLabel: "利用者",
  planLabel: "計画",
  procedureLabel: "支援手順",
  performedAtLabel: "実施日時",
  recordedAtLabel: "記録日時",
  resultLabel: "結果",
  resultValues: {
    PERFORMED_AS_PLANNED: "手順どおり実施",
    PERFORMED_WITH_ADAPTATION: "一部変更して実施",
    NOT_PERFORMED: "実施できなかった",
  },
};

async function renderPilot(
  overrides: Partial<FieldStaffReadOnlyPilotProps> = {},
): Promise<HTMLDivElement> {
  const container = document.createElement("div");
  document.body.appendChild(container);

  await act(async () => {
    ReactDOM.render(<FieldStaffReadOnlyPilot strings={STRINGS} {...overrides} />, container);
    await Promise.resolve();
    await Promise.resolve();
  });

  return container;
}

function cleanup(container: HTMLDivElement): void {
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
}

describe("FieldStaffReadOnlyPilot", () => {
  it("renders one synthetic record and makes the synthetic boundary explicit", async () => {
    const container = await renderPilot();
    try {
      expect(container.querySelector('[data-field-staff-read-only-pilot="true"]')).not.toBeNull();
      expect(
        container
          .querySelector('[data-field-staff-read-only-pilot="true"]')
          ?.getAttribute("data-pilot-data-source"),
      ).toBe("synthetic");
      expect(container.querySelector('[data-pilot-synthetic-banner="true"]')).not.toBeNull();
      expect(container.querySelector('[data-pilot-record="true"]')).not.toBeNull();
      expect(
        container.querySelector('[data-pilot-record="true"]')?.getAttribute("data-pilot-record-id"),
      ).toBe("synthetic-procedure-record-001");
      expect(container.querySelector('[data-pilot-user-id="true"]')?.textContent).toBe("user-a");
      expect(
        container
          .querySelector("[data-pilot-record-count]")
          ?.getAttribute("data-pilot-record-count"),
      ).toBe("1");
    } finally {
      cleanup(container);
    }
  });

  it("has no save, correction, or delete controls", async () => {
    const container = await renderPilot();
    try {
      expect(container.querySelectorAll("button")).toHaveLength(0);
      expect(container.textContent).not.toContain("保存");
      expect(container.textContent).not.toContain("修正");
      expect(container.textContent).not.toContain("削除");
      expect(
        container
          .querySelector('[data-field-staff-read-only-pilot="true"]')
          ?.getAttribute("data-pilot-write-capability"),
      ).toBe("none");
    } finally {
      cleanup(container);
    }
  });

  it("fails closed when the synthetic UserId does not match the allowlist", async () => {
    const container = await renderPilot({
      allowlist: { ...SYNTHETIC_PILOT_ALLOWLIST, userId: "other-user" },
    });
    try {
      expect(container.querySelector('[data-pilot-state="forbidden"]')).not.toBeNull();
      expect(container.querySelector('[data-pilot-fail-closed="true"]')).not.toBeNull();
      expect(container.querySelector('[data-pilot-record="true"]')).toBeNull();
      const count = container
        .querySelector("[data-pilot-record-count]")
        ?.getAttribute("data-pilot-record-count");
      expect(count).toBe("unavailable");
      expect(count).not.toBe("0");
    } finally {
      cleanup(container);
    }
  });

  it("renders EMPTY without treating it as a fetch failure", async () => {
    const container = await renderPilot({
      transport: {
        targetListGuid: SYNTHETIC_PILOT_LIST_GUID,
        findByRecordId: async () => ({ ok: true, rows: [] }),
      },
    });
    try {
      expect(container.querySelector('[data-pilot-state="empty"]')).not.toBeNull();
      expect(container.textContent).toContain("0件");
      expect(container.querySelector('[data-pilot-fail-closed="true"]')).toBeNull();
      expect(
        container
          .querySelector("[data-pilot-record-count]")
          ?.getAttribute("data-pilot-record-count"),
      ).toBe("0");
    } finally {
      cleanup(container);
    }
  });

  it("fails closed on MULTI_MATCH", async () => {
    const container = await renderPilot({
      transport: {
        targetListGuid: SYNTHETIC_PILOT_LIST_GUID,
        findByRecordId: async () => ({
          ok: true,
          rows: [
            SYNTHETIC_PILOT_ROW,
            { ...SYNTHETIC_PILOT_ROW, prRecordId: "synthetic-procedure-record-002" },
          ],
        }),
      },
    });
    try {
      expect(container.querySelector('[data-pilot-state="fetch_failed"]')).not.toBeNull();
      expect(container.querySelector('[data-pilot-record="true"]')).toBeNull();
      expect(
        container
          .querySelector("[data-pilot-failure-code]")
          ?.getAttribute("data-pilot-failure-code"),
      ).toBe("MULTI_MATCH");
      const count = container
        .querySelector("[data-pilot-record-count]")
        ?.getAttribute("data-pilot-record-count");
      expect(count).toBe("unavailable");
      expect(count).not.toBe("0");
    } finally {
      cleanup(container);
    }
  });

  it("reports loading as unavailable, never as zero records", async () => {
    let resolveRead!: (value: {
      ok: true;
      rows: readonly Readonly<Record<string, unknown>>[];
    }) => void;
    const pending = new Promise<{
      ok: true;
      rows: readonly Readonly<Record<string, unknown>>[];
    }>((resolve) => {
      resolveRead = resolve;
    });

    const container = await renderPilot({
      transport: {
        targetListGuid: SYNTHETIC_PILOT_LIST_GUID,
        findByRecordId: () => pending,
      },
    });

    try {
      expect(container.querySelector('[data-pilot-state="loading"]')).not.toBeNull();
      const count = container
        .querySelector("[data-pilot-record-count]")
        ?.getAttribute("data-pilot-record-count");
      expect(count).toBe("unavailable");
      expect(count).not.toBe("0");
    } finally {
      cleanup(container);
      resolveRead({ ok: true, rows: [] });
      await Promise.resolve();
    }
  });

  it("does not use the network during synthetic rendering", async () => {
    const fetchSpy = jest.fn();
    const originalFetch = globalThis.fetch;
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      value: fetchSpy,
    });
    const container = await renderPilot({ transport: SYNTHETIC_PILOT_TRANSPORT });
    try {
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      cleanup(container);
      Object.defineProperty(globalThis, "fetch", {
        configurable: true,
        value: originalFetch,
      });
    }
  });
});
