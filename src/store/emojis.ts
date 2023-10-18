import { useSearchTxtArr } from "@/composables/useSearch";
import { type RawEmoji, rawEmojis } from "@/data";
import EmojiLabel from "@/components/EmojiLabel.vue";

const CUSTOM_EMOJIS_KEY = "CUSTOM_EMOJIS_STORE";

const readCustomEmojis = () => {
  const customEmoji: RawEmoji[] = utools.dbStorage.getItem(CUSTOM_EMOJIS_KEY);
  if (customEmoji === null || customEmoji.length === 0) return [];
  return customEmoji;
};

const saveCustomEmojis = (customEmoji: RawEmoji[]) => {
  utools.dbStorage.setItem(CUSTOM_EMOJIS_KEY, customEmoji);
};

const toEmojiOptions = (item: RawEmoji) => ({
  ...item,
  searchTxtArr: useSearchTxtArr(item),
  value: `${item.emoji} :${item.name}:`,
  label: () =>
    h(EmojiLabel, {
      label: {
        emoji: item.emoji,
        emojiCode: `:${item.name}:`,
        description: item.description
      }
    })
});

/**
 * 对自定义emoji数组的每个对象比较，name相同，后面覆盖前面
 * @param arr 自定义emoji数组对象
 * @returns
 */
const compareArrays = (arr: RawEmoji[]) => {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].name === arr[j].name) {
        arr[i] = {
          ...arr[i],
          ...arr[j]
        };
        arr.splice(j, 1);
      }
    }
  }
  return arr;
};

type EmojiOptionsType = ReturnType<typeof toEmojiOptions>;

export const useEmojisStore = createGlobalState(() => {
  let newCustomEmojis = ref(readCustomEmojis());

  const updateEmojis = (customEmojis: RawEmoji[]) => {
    newCustomEmojis.value = compareArrays(customEmojis);
    saveCustomEmojis(customEmojis);
  };

  let emojiOptions = computed(() => {
    let newEmojis: EmojiOptionsType[] = [];
    let result: number;

    let emojiOptions = rawEmojis.map(toEmojiOptions);

    newCustomEmojis.value.forEach((userEmoji) => {
      result = emojiOptions.findIndex((emoji) => emoji.name === userEmoji.name);
      if (result !== -1) {
        // 如果存在相同的name，自定义的会覆盖已有的
        emojiOptions[result] = toEmojiOptions({
          ...emojiOptions[result],
          ...userEmoji
        });
      }
      // 新的emoji会暂存在newEmojis，等自定义的全部遍历完在一起push
      else newEmojis.push(toEmojiOptions(userEmoji));
    });
    emojiOptions.push(...newEmojis);
    return emojiOptions;
  });

  return {
    emojiOptions,
    updateEmojis,
    customEmojis: newCustomEmojis
  };
});
