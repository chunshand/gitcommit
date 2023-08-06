import { Mode } from "@/composables/usePluginEnter";

interface Settings {
  isEmojiMode: boolean;
  isEmoji: boolean;
  isCodeEmoji: boolean;
}
type SaveSettings = Omit<Settings, "isEmojiMode">;

export const useSettingsStore = createGlobalState(() => {
  const SETTINGS_KEY = "SETTINGS_STORE";
  const settings = ref<Settings>({
    isEmojiMode: false,
    ...(utools.dbStorage.getItem(SETTINGS_KEY) as SaveSettings)
  });

  // 新用户初始化设置
  if (!settings.value?.isEmoji) {
    settings.value.isEmoji = false;
  }
  const _saveDB = () => {
    const saveSettings: SaveSettings = {
      isEmoji: settings.value.isEmoji,
      isCodeEmoji: settings.value.isCodeEmoji
    };
    utools.dbStorage.setItem(SETTINGS_KEY, saveSettings);
  };

  const setMode = (mode: Mode) => {
    settings.value!.isEmojiMode = mode === "git-emoji" ? true : false;
  };

  const handleISEmojiChange = (value: boolean) => {
    settings.value.isEmoji = value;
    _saveDB();
  };

  const handleISCodeEmojiChange = (value: boolean) => {
    settings.value.isCodeEmoji = value;
    _saveDB();
  };

  return { settings, setMode, handleISEmojiChange, handleISCodeEmojiChange };
});
