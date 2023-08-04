import { Mode } from "@/composables/usePluginEnter";

interface Settings {
  isEmojiMode: boolean;
}
export const useSettingsStore = createGlobalState(() => {
  const SETTINGS_KEY = "SETTINGS_STORE";
  const settings = ref(
    (utools.dbStorage.getItem(SETTINGS_KEY) as Settings) ?? {}
  );

  // 新用户初始化设置
  if (Object.keys(settings.value).length === 0) {
    settings.value!.isEmojiMode = false;
  }

  const setMode = (mode: Mode) => {
    settings.value!.isEmojiMode = mode === "git-emoji" ? true : false;
  };

  return { settings, setMode };
});
