import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import type { TodaySupportItem } from "../../sbs-domain/kiosk-read-model.bundle";
import type { ShellSiteSelection } from "../ux/site-selection";
import {
  buildOverviewCurrentProcedurePresentation,
  mintProcedureTargetKey,
  useCanonicalProcedureCoordinator,
  type CurrentProcedureViewState,
  type ProcedureTargetIdentity,
} from "./canonical-procedure-adapter";
import { getKioskSyntheticTodaySupportItems } from "./kiosk-today-support-fixture";
import { DefaultW2SyntheticProcedureDataSource } from "./w2-synthetic-procedure-fixture";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

interface TestHarnessProps {
  currentProcedureOpen: boolean;
  siteSelection: ShellSiteSelection;
  selectedOccurrenceItem?: TodaySupportItem;
  dataSource: DefaultW2SyntheticProcedureDataSource;
  dataSourceRevision: number;
  onStateChange: (state: CurrentProcedureViewState) => void;
}

const CoordinatorTestHarness: React.FC<TestHarnessProps> = ({
  currentProcedureOpen,
  siteSelection,
  selectedOccurrenceItem,
  dataSource,
  dataSourceRevision,
  onStateChange,
}) => {
  const state = useCanonicalProcedureCoordinator({
    currentProcedureOpen,
    siteSelection,
    selectedOccurrenceItem,
    dataSource,
    dataSourceRevision,
  });

  React.useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  return <div data-status={state.status} data-target-key={state.targetKey} />;
};

describe("Canonical Procedure Coordinator & Presentation Adapter (A2 / W2-A)", () => {
  let container: HTMLDivElement;
  let items: readonly TodaySupportItem[];
  let dataSource: DefaultW2SyntheticProcedureDataSource;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    items = getKioskSyntheticTodaySupportItems();
    dataSource = new DefaultW2SyntheticProcedureDataSource();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  it("TC-SITE-HOOK-01: SITE-ISG -> SITE-HOM -> SITE-ISG transition causes no Hooks violation and restores resolved body", async () => {
    const states: CurrentProcedureViewState[] = [];
    const onStateChange = (st: CurrentProcedureViewState): void => {
      states.push(st);
    };

    const itemMorning = items.find((i) => i.scheduleItemId === "sch-001");
    expect(itemMorning).toBeDefined();

    // 1. Initial render with SITE-ISG
    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={itemMorning}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={onStateChange}
        />,
        container,
      );
    });

    // Wait for resolution
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    const resolvedState = states[states.length - 1];
    expect(resolvedState.status).toBe("RESOLVED");
    if (resolvedState.status === "RESOLVED") {
      expect(resolvedState.outcome.projection.sceneLabel).toContain("朝の朝礼");
    }

    // 2. Switch to SITE-HOM (unsupported display site)
    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-HOM"
          selectedOccurrenceItem={itemMorning}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={onStateChange}
        />,
        container,
      );
    });

    const homState = states[states.length - 1];
    expect(homState.status).toBe("UNRESOLVED");
    if (homState.status === "UNRESOLVED") {
      expect(homState.reasonCode).toBe("USER_OR_SITE_MISMATCH");
      expect(homState.unresolvedReason).toContain("本牧 SITE-HOM");
    }

    // 3. Switch back to SITE-ISG (Hooks order preserved, correct resolution restored)
    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={itemMorning}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={onStateChange}
        />,
        container,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    const restoredState = states[states.length - 1];
    expect(restoredState.status).toBe("RESOLVED");
    if (restoredState.status === "RESOLVED") {
      expect(restoredState.outcome.projection.sceneLabel).toContain("朝の朝礼");
    }
  });

  it("TC-MISSING-ITEM-01: Disappearing occurrence item transitions to UNRESOLVED without hanging in LOADING", async () => {
    const states: CurrentProcedureViewState[] = [];
    const onStateChange = (st: CurrentProcedureViewState): void => {
      states.push(st);
    };

    const itemLunch = items.find((i) => i.scheduleItemId === "sch-002");
    expect(itemLunch).toBeDefined();

    // 1. Initial resolution
    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={itemLunch}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={onStateChange}
        />,
        container,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(states[states.length - 1].status).toBe("RESOLVED");

    // 2. Occurrence item disappears (undefined)
    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={undefined}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={onStateChange}
        />,
        container,
      );
    });

    const missingState = states[states.length - 1];
    expect(missingState.status).toBe("UNRESOLVED");
    if (missingState.status === "UNRESOLVED") {
      expect(missingState.reasonCode).toBe("INPUT_INVALID");
      expect(missingState.unresolvedReason).toContain("選択された予定を確認できません");
    }
  });

  it("TC-STATUS-SYNC-01: effectiveStatus changes do not re-run Resolver and preserve body with updated status", async () => {
    const loadEntitiesSpy = jest.spyOn(dataSource, "loadEntities");

    const itemLunch = items.find((i) => i.scheduleItemId === "sch-002");
    expect(itemLunch).toBeDefined();

    let currentState: CurrentProcedureViewState | undefined;
    const onStateChange = (st: CurrentProcedureViewState): void => {
      currentState = st;
    };

    // 1. Initial render and resolution
    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={itemLunch}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={onStateChange}
        />,
        container,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(loadEntitiesSpy).toHaveBeenCalledTimes(1);
    expect(currentState?.status).toBe("RESOLVED");

    // Build initial presentation
    const pres1 = buildOverviewCurrentProcedurePresentation({
      viewState: currentState!,
      selectedOccurrenceItem: itemLunch,
      activeOrganizationId: "synthetic-org-001",
      activeSiteId: "SITE-ISG",
    });
    expect(pres1.occurrenceStatus).toBe("記録済み");
    expect(pres1.projection).toBeDefined();

    // 2. Update effectiveStatus to "取消済み" (same identity keys)
    const updatedItemCancelled: TodaySupportItem = {
      ...itemLunch!,
      effectiveStatus: "取消済み",
    };

    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={updatedItemCancelled}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={onStateChange}
        />,
        container,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    // Verify 0 additional load/resolver executions
    expect(loadEntitiesSpy).toHaveBeenCalledTimes(1);

    const pres2 = buildOverviewCurrentProcedurePresentation({
      viewState: currentState!,
      selectedOccurrenceItem: updatedItemCancelled,
      activeOrganizationId: "synthetic-org-001",
      activeSiteId: "SITE-ISG",
    });
    expect(pres2.occurrenceStatus).toBe("取消済み");
    expect(pres2.projection).toBeDefined(); // Body preserved!

    // 3. Update effectiveStatus to "確認が必要"
    const updatedItemConflict: TodaySupportItem = {
      ...itemLunch!,
      effectiveStatus: "確認が必要",
    };

    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={updatedItemConflict}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={onStateChange}
        />,
        container,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(loadEntitiesSpy).toHaveBeenCalledTimes(1);

    const pres3 = buildOverviewCurrentProcedurePresentation({
      viewState: currentState!,
      selectedOccurrenceItem: updatedItemConflict,
      activeOrganizationId: "synthetic-org-001",
      activeSiteId: "SITE-ISG",
    });
    expect(pres3.occurrenceStatus).toBe("確認が必要");
    expect(pres3.projection).toBeDefined(); // Body preserved!

    loadEntitiesSpy.mockRestore();
  });

  it("TC-SHIELD-01: targetKey mismatch synchronously yields LOADING", () => {
    let capturedState: CurrentProcedureViewState | undefined;
    const itemMorning = items.find((i) => i.scheduleItemId === "sch-001")!;
    const itemLunch = items.find((i) => i.scheduleItemId === "sch-002")!;

    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={itemMorning}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={(st) => {
            capturedState = st;
          }}
        />,
        container,
      );
    });

    expect(capturedState?.status).toBe("LOADING");
    const targetMorning: ProcedureTargetIdentity = {
      organizationId: "synthetic-org-001",
      siteId: "SITE-ISG",
      userId: itemMorning.userId,
      occurrenceId: itemMorning.occurrenceId,
      localDate: itemMorning.localDate,
      planId: itemMorning.planId,
      planVersion: itemMorning.planVersion,
      procedureId: itemMorning.procedure.ProcedureId,
      procedureVersion: itemMorning.procedure.ProcedureVersion,
      scheduleItemId: itemMorning.scheduleItemId,
    };
    expect(capturedState?.targetKey).toBe(mintProcedureTargetKey(targetMorning));

    // Synchronously switch to Lunch item
    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={itemLunch}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={(st) => {
            capturedState = st;
          }}
        />,
        container,
      );
    });

    expect(capturedState?.status).toBe("LOADING");
    const targetLunch: ProcedureTargetIdentity = {
      organizationId: "synthetic-org-001",
      siteId: "SITE-ISG",
      userId: itemLunch.userId,
      occurrenceId: itemLunch.occurrenceId,
      localDate: itemLunch.localDate,
      planId: itemLunch.planId,
      planVersion: itemLunch.planVersion,
      procedureId: itemLunch.procedure.ProcedureId,
      procedureVersion: itemLunch.procedure.ProcedureVersion,
      scheduleItemId: itemLunch.scheduleItemId,
    };
    expect(capturedState?.targetKey).toBe(mintProcedureTargetKey(targetLunch));
  });

  it("TC-FAIL-CLOSED: Handles simulated transport fetch failure and incomplete data", async () => {
    const states: CurrentProcedureViewState[] = [];
    const itemMorning = items.find((i) => i.scheduleItemId === "sch-001")!;

    // 1. Fetch failure simulation
    dataSource.setSimulateFetchFailure(true);
    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={itemMorning}
          dataSource={dataSource}
          dataSourceRevision={1}
          onStateChange={(st) => states.push(st)}
        />,
        container,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(states[states.length - 1].status).toBe("FETCH_FAILED");

    // 2. Incomplete data simulation
    dataSource.setSimulateFetchFailure(false);
    dataSource.setSimulateIncomplete(true);

    act(() => {
      ReactDOM.render(
        <CoordinatorTestHarness
          currentProcedureOpen={true}
          siteSelection="SITE-ISG"
          selectedOccurrenceItem={itemMorning}
          dataSource={dataSource}
          dataSourceRevision={2}
          onStateChange={(st) => states.push(st)}
        />,
        container,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(states[states.length - 1].status).toBe("INCOMPLETE");
  });
});
