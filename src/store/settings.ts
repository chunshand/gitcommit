import { Mode } from "@/composables/usePluginEnter";

interface Settings {
  isEmojiMode: boolean;
  isEmoji: boolean;
  isCodeEmoji: boolean;
  autoPaste: boolean;
}
type SaveSettings = Omit<Settings, "isEmojiMode">;

export const useSettingsStore = createGlobalState(() => {
  const SETTINGS_KEY = "SETTINGS_STORE";
  const settings = ref<Settings>({
    isEmojiMode: false,
    ...(utools.dbStorage.getItem(SETTINGS_KEY) as SaveSettings)
  });

  const _saveDB = () => {
    const saveSettings: SaveSettings = {
      ...settings.value
    };
    Reflect.deleteProperty(saveSettings, "isEmojiMode");
    utools.dbStorage.setItem(SETTINGS_KEY, saveSettings);
  };

  const init = () => {
    if (settings.value?.autoPaste !== undefined) return;

    // 新用户初始化设置
    settings.value.autoPaste = false;
    settings.value.isCodeEmoji = false;

    const _ISEmojiKey = "ISEmoji";
    const oldIsEmoji = utools.dbStorage.getItem(_ISEmojiKey);
    // 旧版本的设置数据迁移
    if (oldIsEmoji !== null) {
      settings.value.isEmoji = oldIsEmoji;
      utools.dbStorage.removeItem(_ISEmojiKey);
    } else {
      settings.value.isEmoji = false;
    }
    _saveDB();
  };

  const setMode = (mode: Mode) => {
    settings.value.isEmojiMode = mode === "git-emoji" ? true : false;
    if (settings.value.isEmojiMode) {
      settings.value.isEmoji = true;
    }
  };

  const handleISEmojiChange = (value: boolean) => {
    settings.value.isEmoji = value;
    _saveDB();
  };

  const handleISCodeEmojiChange = (value: boolean) => {
    settings.value.isCodeEmoji = value;
    _saveDB();
  };

  const handleAutoPaste = (value: boolean) => {
    settings.value.autoPaste = value;
    _saveDB();
  };

  return {
    settings,
    setMode,
    handleISEmojiChange,
    handleISCodeEmojiChange,
    handleAutoPaste,
    init
  };
});
