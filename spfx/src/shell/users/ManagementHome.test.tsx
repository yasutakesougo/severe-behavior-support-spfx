import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MANAGEMENT_HOME_CONFIRMED_NONE_MODEL,
  MANAGEMENT_HOME_FULLY_RESOLVED_MODEL,
  MANAGEMENT_HOME_UNAVAILABLE_MODEL,
} from "./management-home-fixture";
import { ManagementHome } from "./ManagementHome";

describe("SBS-MGMT-HOME-C ManagementHome", () => {
  it("renders the staff-facing hierarchy from the resolved snapshot", () => {
    const html = renderToStaticMarkup(
      <ManagementHome model={MANAGEMENT_HOME_FULLY_RESOLVED_MODEL} />,
    );
    expect(html).toContain("マネジメントホーム");
    expect(html).toContain("Aさん");
    expect(html).toContain("版3（適用中）");
    expect(html).toContain("結果: 変更が必要");
    expect(html).toContain("Revision Intent: 消費済み");
    expect(html).toContain("Draft 版4あり / 未適用");
    expect(html).toContain("次版はまだ未適用です");
    expect(html).not.toContain("優先度");
    expect(html).not.toContain("リスクスコア");
  });

  it("renders confirmed none without calling it unavailable", () => {
    const html = renderToStaticMarkup(
      <ManagementHome model={MANAGEMENT_HOME_CONFIRMED_NONE_MODEL} />,
    );
    expect(html).toContain("記録 0件");
    expect(html).toContain("見直し: 未実施を確認");
    expect(html).toContain("Revision Intent: なし");
    expect(html).toContain("Draft: なし");
  });

  it("renders unavailable sources without inferring a next action", () => {
    const html = renderToStaticMarkup(
      <ManagementHome model={MANAGEMENT_HOME_UNAVAILABLE_MODEL} />,
    );
    expect(html).toContain("確認できません");
    expect(html).toContain('data-management-home-next-action-status="UNAVAILABLE"');
    expect(html).toContain("次の行動は表示しません");
  });
});
