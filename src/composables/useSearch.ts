import type { InputInst, SelectInst, SelectOption } from "naive-ui";
import type { RawEmoji } from "@/data";
import { settingsStore } from "@/store";
import { usePluginActive } from "@/composables/usePluginEnter";

export const useFocusInput = (focusElements: {
  gitc: Ref<InputInst>;
  gitemoji: Ref<SelectInst>;
}) => {
  const { gitc: scopRef, gitemoji: searchEmoji } = focusElements;
  const { error } = useMessage();
  let flag = true; // 在gitc关键字下只需要聚焦一次
  watch(
    () => settingsStore.settings.value.isEmojiMode,
    () => {
      const focusInput = () => {
        if (!settingsStore.settings.value.isEmojiMode) {
          flag && scopRef.value.focus();
          flag = false;
          return;
        }
        try {
          // xxx:naive-ui@2.35.0已增加
          searchEmoji.value!.focusInput();
        } catch (err) {
          error(`[FocusInput Error]:${err}`, { duration: 0, closable: true });
        }
      };
      usePluginActive(() => setTimeout(focusInput, 200));
    },
    { immediate: true }
  );
};

export const useSearchTxtArr = (item: RawEmoji) => {
  const pinyin = item.pinyin.toLowerCase();
  const py = pinyin.split(" ").reduce((firstLetter, word) => {
    const _fl = word.charAt(0);
    // 缩写首字母不应该包含数组内的字符
    if ([",", "(", ")", "/"].includes(_fl)) {
      return firstLetter;
    }
    return firstLetter + _fl;
  }, "");
  // {
  //   pinyin:"jiegougaijin/geshihuadaima",
  //   py:"jggjgshdm",
  //   des:"结构改进 / 格式化代码",
  // }
  return {
    pinyin: pinyin.replaceAll(" ", ""),
    py,
    des: item.description
  };
};
export const useFilterMsg = (
  pattern: string,
  option: SelectOption
): boolean => {
  pattern = pattern.trim();
  if (pattern.length === 0) {
    return true;
  }
  return (
    option.emoji === pattern ||
    (option.value as string)?.includes(pattern) ||
    (option.label as string)?.includes(pattern)
  );
};
export const useFilterEmoji = (pattern: string, option: SelectOption) => {
  pattern = pattern.trim();
  if (pattern.length === 0) return true;

  const searchTxtArr = (
    option as {
      searchTxtArr: ReturnType<typeof useSearchTxtArr>;
    }
  ).searchTxtArr;
  pattern = pattern.toLowerCase();
  return (
    // 默认先按照首字母匹配
    searchTxtArr.py?.includes(pattern) ||
    (option.value as string).replace(" ", "").includes(pattern) ||
    searchTxtArr.pinyin?.includes(pattern) ||
    searchTxtArr.des?.includes(pattern)
  );
};

export const useGetSpan = (options: { gitc: string; gitemoji: string }) =>
  settingsStore.settings.value.isEmojiMode ? options.gitemoji : options.gitc;
