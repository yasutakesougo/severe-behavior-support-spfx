export const VP1_DEMO_SAFETY_NOTICE = "デモ環境｜表示内容は合成データです。保存されません。";

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
