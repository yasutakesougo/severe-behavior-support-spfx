export const VP1_DEMO_SAFETY_NOTICE = "デモ環境｜表示内容は合成データです。保存されません。";

/** SharePoint page chrome vs business save — keep SP edit/new/unsaved; explain in-shell only. */
export const VP1_PAGE_EDIT_VS_BUSINESS_SAVE_NOTICE =
  "SharePoint の「編集」とページの「未保存」はページ編集です。支援の記録や保存ではありません。";

export const VP1_DEMO_ROLE_LEGEND = "表示ロール（デモ専用）";

export const VP1_DEMO_ROLE_HINT =
  "表示だけを切り替えます。権限判定・Entra ロールには影響しません。";

export const VP1_DEMO_UI_POLICY = Object.freeze({
  businessChromeFirst: true,
  compactSafetyNoticeRequired: true,
  demoControlsSecondary: true,
  presentationRoleOnly: true,
  liveTenantIoAuthorized: false,
} as const);
