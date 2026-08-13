/**
 * DADS-05 — primitive disposition registry (KEEP / ADAPT / FIX / CONSOLIDATE).
 * Existing PASS surfaces are not replaced without cause.
 */

export const SBS_PRIMITIVE_DISPOSITIONS = ["KEEP", "ADAPT", "FIX", "CONSOLIDATE"] as const;

export type SbsPrimitiveDisposition = (typeof SBS_PRIMITIVE_DISPOSITIONS)[number];

export const SBS_PRIMITIVE_SLICE = {
  id: "DADS-05",
  kind: "shared-ui-primitives" as const,
  accessibilityGateAuthorized: false as const,
  screenMigrationAuthorized: false as const,
  inv19HeadingFixAuthorized: false as const,
  domainContractsMutationAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

export type SbsPrimitiveRegistryEntry = Readonly<{
  id: string;
  disposition: SbsPrimitiveDisposition;
  inventoryRefs: readonly string[];
  note: string;
}>;

export const SBS_PRIMITIVE_REGISTRY: readonly SbsPrimitiveRegistryEntry[] = [
  {
    id: "StatusBadge",
    disposition: "CONSOLIDATE",
    inventoryRefs: ["INV-13", "INV-12"],
    note: "Presentation-only badge; label text remains the meaning channel",
  },
  {
    id: "EmptyNotice",
    disposition: "FIX",
    inventoryRefs: ["INV-17"],
    note: "Dynamic empty uses role=status; not a mandatory illustrated EmptyState",
  },
  {
    id: "SingleSelectListbox",
    disposition: "FIX",
    inventoryRefs: ["INV-10"],
    note: "Proper listbox/option + keyboard; replaces hybrid button+option",
  },
  {
    id: "SectionLabelStrip",
    disposition: "FIX",
    inventoryRefs: ["INV-07"],
    note: "Non-tab section order labels; actions stay separate buttons",
  },
  {
    id: "StatusPanelFamily",
    disposition: "KEEP",
    inventoryRefs: ["INV-15", "INV-16", "INV-24"],
    note: "Existing fail-closed panels remain; no semantic rewrite this slice",
  },
] as const;
