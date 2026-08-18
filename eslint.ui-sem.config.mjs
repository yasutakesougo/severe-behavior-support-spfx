import tseslint from "typescript-eslint";
import plugin from "./scripts/ui-sem/plugin.mjs";

/** Focused ESLint config for Product UI Contract rules. Does not replace SPFx Heft lint. */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/tokens/**",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/lib-commonjs/**",
      "**/lib/**",
      "**/dist/**",
    ],
  },
  {
    files: ["spfx/src/shell/**/*.{ts,tsx}"],
    linterOptions: {
      // Existing SPFx disable comments (UsersList.tsx) must not fail this focused run.
      reportUnusedDisableDirectives: "off",
    },
    plugins: {
      "sbs-ui-sem": plugin,
      // Stub only. Heft still owns the real react-hooks lint for SPFx.
      // Without a definition, ESLint 10 errors: Definition for rule
      // 'react-hooks/exhaustive-deps' was not found.
      "react-hooks": {
        meta: { name: "react-hooks-stub" },
        rules: {
          "exhaustive-deps": {
            meta: {
              docs: {
                description: "stub so existing disable comments resolve under ESLint 10",
              },
            },
            create() {
              return {};
            },
          },
        },
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "sbs-ui-sem/status-badge-label": "error",
      "sbs-ui-sem/empty-notice-not-fail-closed": "error",
      "sbs-ui-sem/save-state-vocabulary": "error",
      "sbs-ui-sem/no-raw-hex-rem": "error",
      "sbs-ui-sem/presentation-role-not-nav": "error",
    },
  },
];
