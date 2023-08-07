import type { InputInst, SelectInst, SelectOption } from "naive-ui";
import type { RawEmoji } from "@/data";
import { settingsStore } from "@/store";

export const useFocusInput = (scopRef: Ref<InputInst>) => {
  let searchEmoji = ref<SelectInst>();
  watch(
    () => settingsStore.settings.value.isEmojiMode,
    () => {
      const focusInput = () => {
        if (!settingsStore.settings.value.isEmojiMode) {
          scopRef.value.focus();
          clearInterval(timed);
          return;
        }
        // todo:下一个naive-ui版本的api，用pnpm打个补丁先用
        searchEmoji.value?.focusInput();
      };
      nextTick(() => focusInput());
      const timed = setInterval(focusInput, 1500);
    },
    { immediate: true }
  );
  return searchEmoji;
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
    searchTxtArr.py.includes(pattern) ||
    (option.value as string).replace(" ", "").includes(pattern) ||
    searchTxtArr.pinyin.includes(pattern) ||
    searchTxtArr.des.includes(pattern)
  );
};
