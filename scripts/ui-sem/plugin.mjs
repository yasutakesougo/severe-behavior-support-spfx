/**
 * Product UI Contract — ESLint plugin (UI-SEM-01..05).
 * Presentation/semantic static checks. No Domain meaning changes.
 */
const CANONICAL_SAVE_STATES = new Set([
  "unsaved",
  "saving",
  "saved",
  "save_failed",
  "save_outcome_unknown",
]);

const INVENTED_SAVE_LABELS = new Set(["保存エラー", "保存成功", "保存完了", "保存不明"]);

const FAIL_CLOSED_PHRASES = [
  "アクセス不可",
  "取得失敗",
  "判定していない",
  "この画面を表示できません",
];

const PRESENTATION_ROLES = new Set(["FIELD_STAFF", "PLANNER", "ADMIN_AUDIT"]);
const DESTINATION_IDS = new Set(["overview", "users", "records"]);

const HEX_COLOR = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8}|[0-9a-fA-F]*[a-fA-F][0-9a-fA-F]*)\b/;
const THEME_DEFAULT_HEX = /\[[^\]]*default:\s*#[0-9a-fA-F]{3,8}[^\]]*\]/;
const INLINE_REM = /\d(?:\.\d+)?rem\b/;
const SAVE_STATE_ID = /^save_[a-z0-9_]+$/;

const jsxName = (node) => {
  if (!node) {
    return "";
  }
  if (node.type === "JSXIdentifier") {
    return node.name;
  }
  if (node.type === "JSXMemberExpression") {
    return `${jsxName(node.object)}.${jsxName(node.property)}`;
  }
  return "";
};

const attrName = (attr) => {
  if (attr.type !== "JSXAttribute" || !attr.name) {
    return "";
  }
  return attr.name.name;
};

const literalValue = (node) => {
  if (!node) {
    return undefined;
  }
  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }
  if (node.type === "JSXExpressionContainer") {
    return literalValue(node.expression);
  }
  return undefined;
};

const jsxStaticText = (node) => {
  if (!node) {
    return "";
  }
  if (node.type === "JSXText") {
    return node.value;
  }
  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }
  if (node.type === "JSXExpressionContainer") {
    return jsxStaticText(node.expression);
  }
  if (node.type === "JSXElement" || node.type === "JSXFragment") {
    return (node.children ?? []).map(jsxStaticText).join("");
  }
  return "";
};

const AST_SKIP_KEYS = new Set(["parent", "range", "loc", "start", "end", "comments"]);

const astMatches = (node, predicate, seen = new Set()) => {
  if (!node || typeof node !== "object") {
    return false;
  }
  if (seen.has(node)) {
    return false;
  }
  seen.add(node);
  if (predicate(node)) {
    return true;
  }
  for (const [key, value] of Object.entries(node)) {
    if (AST_SKIP_KEYS.has(key)) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (astMatches(item, predicate, seen)) {
          return true;
        }
      }
      continue;
    }
    if (value && typeof value === "object" && value.type) {
      if (astMatches(value, predicate, seen)) {
        return true;
      }
    }
  }
  return false;
};

const containsRoleLiteral = (node) =>
  astMatches(node, (item) => item.type === "Literal" && PRESENTATION_ROLES.has(item.value));

const containsDestinationLiteral = (node) =>
  astMatches(node, (item) => item.type === "Literal" && DESTINATION_IDS.has(item.value));

const hexAllowed = (text) => {
  const withoutTheme = text.replace(THEME_DEFAULT_HEX, "");
  return !HEX_COLOR.test(withoutTheme);
};

export const checkScssRawHex = (relativePath, source) => {
  const normalized = relativePath.split("\\").join("/");
  if (normalized.includes("/tokens/") || normalized.endsWith("/tokens/sbs-tokens.scss")) {
    return [];
  }
  const findings = [];
  const lines = source.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (hexAllowed(line)) {
      continue;
    }
    findings.push({
      line: index + 1,
      message:
        "UI-SEM-04: raw hex belongs in DADS-04 tokens (or SPFx [theme:…, default: #…] fallbacks), not screen SCSS.",
    });
  }
  return findings;
};

const statusBadgeLabelRule = {
  meta: {
    type: "problem",
    docs: { description: "UI-SEM-01 StatusBadge requires a non-empty label" },
    schema: [],
    messages: {
      missingLabel: "UI-SEM-01: StatusBadge requires label text (color-only status is forbidden).",
      emptyLabel: "UI-SEM-01: StatusBadge label must not be empty.",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (jsxName(node.name) !== "StatusBadge") {
          return;
        }
        const labelAttr = node.attributes.find((attr) => attrName(attr) === "label");
        if (!labelAttr) {
          context.report({ node, messageId: "missingLabel" });
          return;
        }
        const value = literalValue(labelAttr.value);
        if (value === "") {
          context.report({ node: labelAttr, messageId: "emptyLabel" });
        }
      },
    };
  },
};

const emptyNoticeNotFailClosedRule = {
  meta: {
    type: "problem",
    docs: { description: "UI-SEM-02 EmptyNotice must not carry fail-closed meaning" },
    schema: [],
    messages: {
      failClosedCopy:
        "UI-SEM-02: EmptyNotice is zero-result only. Do not use fail-closed copy ({{phrase}}). Use StatusPanelFamily.",
      importedIntoPanel:
        "UI-SEM-02: StatusPanelFamily must not import EmptyNotice (fail-closed ≠ zero-result).",
    },
  },
  create(context) {
    const filename = context.filename.split("\\").join("/");
    return {
      ImportDeclaration(node) {
        if (!filename.endsWith("/StatusPanel.tsx")) {
          return;
        }
        const specifiers = node.specifiers ?? [];
        const importsEmpty = specifiers.some(
          (spec) => spec.imported?.name === "EmptyNotice" || spec.local?.name === "EmptyNotice",
        );
        if (importsEmpty) {
          context.report({ node, messageId: "importedIntoPanel" });
        }
      },
      JSXElement(node) {
        if (jsxName(node.openingElement?.name) !== "EmptyNotice") {
          return;
        }
        const text = (node.children ?? []).map(jsxStaticText).join("");
        const phrase = FAIL_CLOSED_PHRASES.find((item) => text.includes(item));
        if (phrase) {
          context.report({ node, messageId: "failClosedCopy", data: { phrase } });
        }
      },
    };
  },
};

const saveStateVocabularyRule = {
  meta: {
    type: "problem",
    docs: { description: "UI-SEM-03 save state vocabulary is closed" },
    schema: [],
    messages: {
      inventedId:
        "UI-SEM-03: '{{value}}' is not a ShellSaveState. Use the save 5-state vocabulary.",
      inventedLabel:
        "UI-SEM-03: '{{value}}' invents a save label. Canonical labels live in SHELL_SAVE_STATE_LABELS.",
    },
  },
  create(context) {
    const checkLiteral = (node) => {
      if (node.type !== "Literal" || typeof node.value !== "string") {
        return;
      }
      const value = node.value;
      if (SAVE_STATE_ID.test(value) && !CANONICAL_SAVE_STATES.has(value)) {
        context.report({ node, messageId: "inventedId", data: { value } });
      }
      if (INVENTED_SAVE_LABELS.has(value)) {
        context.report({ node, messageId: "inventedLabel", data: { value } });
      }
    };

    return {
      Literal: checkLiteral,
      JSXAttribute(node) {
        const name = attrName(node);
        const parentName = jsxName(node.parent?.name);
        const value = literalValue(node.value);
        if (value === undefined) {
          return;
        }
        const saveComponent =
          parentName === "SaveStatePresentation" || parentName === "SaveStateBadge";
        if ((name === "state" && saveComponent) || name === "data-save-state") {
          if (!CANONICAL_SAVE_STATES.has(value)) {
            context.report({ node, messageId: "inventedId", data: { value } });
          }
        }
      },
    };
  },
};

const noRawHexRule = {
  meta: {
    type: "problem",
    docs: { description: "UI-SEM-04 no raw hex or rem outside tokens in TS/TSX" },
    schema: [],
    messages: {
      rawHex: "UI-SEM-04: raw hex '{{value}}' belongs in DADS-04 tokens, not component source.",
      rawRem:
        "UI-SEM-04: ad-hoc rem '{{value}}' belongs in DADS-04 tokens, not TS/TSX inline style.",
    },
  },
  create(context) {
    const inspectHex = (node, text) => {
      if (typeof text !== "string") {
        return;
      }
      if (!hexAllowed(text)) {
        const match = text.match(HEX_COLOR);
        context.report({ node, messageId: "rawHex", data: { value: match?.[0] ?? text } });
      }
    };

    const inspectRem = (node, text) => {
      if (typeof text !== "string" || !INLINE_REM.test(text)) {
        return;
      }
      const match = text.match(INLINE_REM);
      context.report({ node, messageId: "rawRem", data: { value: match?.[0] ?? text } });
    };

    return {
      Literal(node) {
        if (typeof node.value === "string") {
          inspectHex(node, node.value);
        }
      },
      TemplateElement(node) {
        inspectHex(node, node.value?.raw ?? "");
      },
      JSXAttribute(node) {
        if (attrName(node) !== "style") {
          return;
        }
        const text = context.sourceCode.getText(node);
        inspectRem(node, text);
        inspectHex(node, text);
      },
    };
  },
};

const presentationRoleNotNavRule = {
  meta: {
    type: "problem",
    docs: { description: "UI-SEM-05 role entry is not implied by destination alone" },
    schema: [],
    messages: {
      navEncodesRole:
        "UI-SEM-05: primary navigation must not encode presentationRole. Keep destinations role-neutral.",
      roleSelectsDestination:
        "UI-SEM-05: do not select a primary destination from presentationRole. Pass presentationRole into the surface.",
    },
  },
  create(context) {
    const filename = context.filename.split("\\").join("/");
    return {
      Program(node) {
        if (!filename.endsWith("/primary-navigation.ts")) {
          return;
        }
        const text = context.sourceCode.text;
        if (/"FIELD_STAFF"|"PLANNER"|"ADMIN_AUDIT"/.test(text)) {
          context.report({ node, messageId: "navEncodesRole" });
        }
      },
      ConditionalExpression(node) {
        const mixes =
          (containsRoleLiteral(node.test) && containsDestinationLiteral(node)) ||
          (containsDestinationLiteral(node.test) && containsRoleLiteral(node));
        if (mixes) {
          context.report({ node, messageId: "roleSelectsDestination" });
        }
      },
    };
  },
};

const plugin = {
  meta: {
    name: "sbs-ui-sem",
    version: "1.0.0",
  },
  rules: {
    "status-badge-label": statusBadgeLabelRule,
    "empty-notice-not-fail-closed": emptyNoticeNotFailClosedRule,
    "save-state-vocabulary": saveStateVocabularyRule,
    "no-raw-hex-rem": noRawHexRule,
    "presentation-role-not-nav": presentationRoleNotNavRule,
  },
};

export default plugin;
