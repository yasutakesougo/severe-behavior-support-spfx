import { ESLint, RuleTester } from "eslint";
import path from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import tseslint from "typescript-eslint";
import plugin, { checkScssRawHex } from "../../scripts/ui-sem/plugin.mjs";

const tester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: { jsx: true },
      sourceType: "module",
    },
  },
});

describe("UI-SEM ESLint rules", () => {
  it("UI-SEM-01 requires StatusBadge label", () => {
    tester.run("status-badge-label", plugin.rules["status-badge-label"], {
      valid: [{ code: `const n = <StatusBadge label="要確認" />;` }],
      invalid: [
        {
          code: `const n = <StatusBadge shape="pill" />;`,
          errors: [{ messageId: "missingLabel" }],
        },
        {
          code: `const n = <StatusBadge label="" />;`,
          errors: [{ messageId: "emptyLabel" }],
        },
      ],
    });
  });

  it("UI-SEM-02 keeps EmptyNotice away from fail-closed copy", () => {
    tester.run("empty-notice-not-fail-closed", plugin.rules["empty-notice-not-fail-closed"], {
      valid: [{ code: `const n = <EmptyNotice>該当する利用者はいません</EmptyNotice>;` }],
      invalid: [
        {
          code: `const n = <EmptyNotice>アクセス不可</EmptyNotice>;`,
          errors: [{ messageId: "failClosedCopy" }],
        },
        {
          code: `import { EmptyNotice } from "./EmptyNotice";`,
          filename: path.join("spfx", "src", "shell", "ux", "StatusPanel.tsx"),
          errors: [{ messageId: "importedIntoPanel" }],
        },
      ],
    });
  });

  it("UI-SEM-03 rejects invented save vocabulary", () => {
    tester.run("save-state-vocabulary", plugin.rules["save-state-vocabulary"], {
      valid: [
        { code: `const state = "save_failed";` },
        { code: `const n = <SaveStateBadge state="save_outcome_unknown" />;` },
      ],
      invalid: [
        {
          code: `const state = "save_error";`,
          errors: [{ messageId: "inventedId" }],
        },
        {
          code: `const label = "保存成功";`,
          errors: [{ messageId: "inventedLabel" }],
        },
      ],
    });
  });

  it("UI-SEM-04 rejects raw hex and JSX rem", () => {
    tester.run("no-raw-hex-rem", plugin.rules["no-raw-hex-rem"], {
      valid: [
        { code: `const issue = "#356";` },
        { code: `const theme = "[theme:bodyText, default: #323130]";` },
        { code: `const density = "2.75rem";` },
      ],
      invalid: [
        {
          code: `const color = "#deecf9";`,
          errors: [{ messageId: "rawHex" }],
        },
        {
          code: `const n = <div style={{ margin: "1.5rem" }} />;`,
          errors: [{ messageId: "rawRem" }],
        },
      ],
    });
  });

  it("UI-SEM-05 rejects role-selected destinations", () => {
    tester.run("presentation-role-not-nav", plugin.rules["presentation-role-not-nav"], {
      valid: [
        {
          code: `export const SHELL_PRIMARY_NAV_ITEMS = [{ id: "overview", label: "概要" }];`,
          filename: path.join("spfx", "src", "shell", "ux", "primary-navigation.ts"),
        },
        {
          code: `const order = role === "PLANNER" ? ["reviewDue"] : ["todaySupport"];`,
        },
      ],
      invalid: [
        {
          code: `export const role = "PLANNER";`,
          filename: path.join("spfx", "src", "shell", "ux", "primary-navigation.ts"),
          errors: [{ messageId: "navEncodesRole" }],
        },
        {
          code: `const dest = role === "PLANNER" ? "users" : "overview";`,
          errors: [{ messageId: "roleSelectsDestination" }],
        },
      ],
    });
  });

  it("UI-SEM-04 SCSS allows token files and theme fallbacks only", () => {
    const screen = checkScssRawHex("spfx/src/shell/ux/ShellUx.module.scss", "color: #deecf9;");
    assert.equal(screen.length, 1);
    const theme = checkScssRawHex(
      "spfx/src/shell/ux/ShellUx.module.scss",
      'color: "[theme:neutralSecondary, default: #605e5c]";',
    );
    assert.equal(theme.length, 0);
    const tokens = checkScssRawHex(
      "spfx/src/shell/tokens/sbs-tokens.scss",
      "$color-surface: #fff;",
    );
    assert.equal(tokens.length, 0);
  });

  it("lints the shell presentation tree without UI-SEM errors", async () => {
    const eslint = new ESLint({
      cwd: path.resolve(import.meta.dirname, "../.."),
      overrideConfigFile: path.resolve(import.meta.dirname, "../../eslint.ui-sem.config.mjs"),
      errorOnUnmatchedPattern: false,
    });
    const results = await eslint.lintFiles(["spfx/src/shell/**/*.{ts,tsx}"]);
    const errors = results.flatMap((result) =>
      result.messages.filter((message) => message.severity === 2),
    );
    assert.deepEqual(
      errors.map((message) => `${message.ruleId}:${message.message}`),
      [],
    );
    const usersList = results.find((result) =>
      result.filePath.endsWith(`${path.sep}UsersList.tsx`),
    );
    assert.ok(usersList, "UsersList.tsx should be included in the ui-sem run");
    assert.equal(usersList.errorCount, 0);
  });
});
