import {
  SHELL_UNAUTHENTICATED_BODY,
  SHELL_UNAUTHENTICATED_TITLE,
  unauthenticatedCopyExcludesSensitiveTokens,
} from "./unauthenticated";

describe("SHELL-UX-6 unauthenticated presentation", () => {
  it("provides fail-closed title and body", () => {
    expect(SHELL_UNAUTHENTICATED_TITLE).toContain("未認証");
    expect(SHELL_UNAUTHENTICATED_BODY).toContain("個人情報および業務データは表示していません");
    expect(SHELL_UNAUTHENTICATED_BODY).toContain("認証判定・サインイン処理は行いません");
  });

  it("keeps fail-closed copy free of sensitive presentation tokens", () => {
    expect(unauthenticatedCopyExcludesSensitiveTokens(SHELL_UNAUTHENTICATED_TITLE)).toBe(true);
    expect(unauthenticatedCopyExcludesSensitiveTokens(SHELL_UNAUTHENTICATED_BODY)).toBe(true);
    expect(unauthenticatedCopyExcludesSensitiveTokens("表示名: Alice")).toBe(false);
  });
});
