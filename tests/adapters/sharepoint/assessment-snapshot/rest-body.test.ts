import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCreateItemFields,
  buildUpdateItemFields,
} from "../../../../src/adapters/sharepoint/assessment-snapshot/rest-body.js";
import { FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS } from "../../../../src/adapters/sharepoint/assessment-snapshot/derived-envelope.js";
import { validFinalizedSnapshot, validSnapshot } from "./fixtures.js";

describe("AssessmentSnapshot REST body construction (CO-1-A)", () => {
  it("create: omit supersedesSnapshotId when absent", () => {
    const body = buildCreateItemFields(validSnapshot());
    assert.equal(body.ok, true);
    if (!body.ok) return;
    assert.equal("supersedesSnapshotId" in body.fields, false);
    assert.equal(body.fields.snapshotId, "snap-001");
    assert.equal(body.fields.recordStatus, "draft");
  });

  it("create: exact pass-through supersedesSnapshotId; no trim", () => {
    const body = buildCreateItemFields(
      validFinalizedSnapshot({
        snapshotId: "snap-new",
        supersedesSnapshotId: "  prev-1  ",
      }),
    );
    assert.equal(body.ok, true);
    if (!body.ok) return;
    assert.equal(body.fields.supersedesSnapshotId, "  prev-1  ");
  });

  it("create: empty / whitespace / logical null supersedes fail-closed", () => {
    assert.equal(
      buildCreateItemFields(
        validFinalizedSnapshot({
          snapshotId: "snap-new",
          supersedesSnapshotId: "",
        }),
      ).ok,
      false,
    );
    assert.equal(
      buildCreateItemFields(
        validFinalizedSnapshot({
          snapshotId: "snap-new",
          supersedesSnapshotId: "   ",
        }),
      ).ok,
      false,
    );
    assert.equal(
      buildCreateItemFields(
        validFinalizedSnapshot({
          snapshotId: "snap-new",
          supersedesSnapshotId: null as unknown as string,
        }),
      ).ok,
      false,
    );
  });

  it("update: clear emits JSON null; omit leaves field absent (≠ clear)", () => {
    const clear = buildUpdateItemFields(validSnapshot(), { kind: "clear" });
    assert.equal(clear.ok, true);
    if (!clear.ok) return;
    assert.ok("supersedesSnapshotId" in clear.fields);
    assert.equal(clear.fields.supersedesSnapshotId, null);

    const omit = buildUpdateItemFields(validSnapshot(), { kind: "omit" });
    assert.equal(omit.ok, true);
    if (!omit.ok) return;
    assert.equal("supersedesSnapshotId" in omit.fields, false);

    const set = buildUpdateItemFields(validSnapshot(), {
      kind: "set",
      value: "  prior  ",
    });
    assert.equal(set.ok, true);
    if (!set.ok) return;
    assert.equal(set.fields.supersedesSnapshotId, "  prior  ");
  });

  it("update set: empty / whitespace fail-closed", () => {
    assert.equal(buildUpdateItemFields(validSnapshot(), { kind: "set", value: "" }).ok, false);
    assert.equal(buildUpdateItemFields(validSnapshot(), { kind: "set", value: "  " }).ok, false);
  });

  it("ENV fields never appear in REST bodies", () => {
    const create = buildCreateItemFields(validSnapshot());
    assert.equal(create.ok, true);
    if (!create.ok) return;
    for (const key of FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS) {
      assert.ok(!(key in create.fields));
    }
  });
});
