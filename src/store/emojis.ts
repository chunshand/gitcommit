import { useSearchTxtArr } from "@/composables/useSearch";
import { type RawEmoji, rawEmojis } from "@/data";
import EmojiLabel from "@/components/EmojiLabel.vue";

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

export const useEmojisStore = createGlobalState(() => {
  const CUSTOM_EMOJIS_KEY = "CUSTOM_EMOJIS_STORE";

  const readCustomEmojis = () => {
    const customEmoji: RawEmoji[] = utools.dbStorage.getItem(CUSTOM_EMOJIS_KEY);
    if (customEmoji === null) return [];
    return customEmoji;
  };
  rawEmojis.push(...readCustomEmojis());
  let emojiOptions = ref(rawEmojis.map(toEmojiOptions));

  /**
   * 除了增加新的emoji列表外，相同的emoji会覆盖已有的
   * @param coustomEmojis
   */
  const updateEmojis = (coustomEmojis: RawEmoji[]) => {
    type EmojiOptionsType = ReturnType<typeof toEmojiOptions>;
    let newEmojis: EmojiOptionsType[] = [];
    let result: number;

    // todo: 已有的自定义emoji再保存会重新参与遍历，应该排除上一次自定义emoji
    coustomEmojis.forEach((userEmoji) => {
      result = emojiOptions.value.findIndex(
        (emoji) => emoji.name === userEmoji.name
      );
      if (result !== -1) {
        // 如果存在相同的name，自定义的会覆盖已有的
        emojiOptions.value[result] = toEmojiOptions({
          ...emojiOptions.value[result],
          ...userEmoji
        });
      }
      // 新的emoji会暂存在newEmojis，等自定义的全部遍历完在一起push
      else newEmojis.push(toEmojiOptions(userEmoji));
    });
    emojiOptions.value.push(...newEmojis);
  };

  const saveCustomEmojis = (customEmoji: RawEmoji[]) => {
    utools.dbStorage.setItem(CUSTOM_EMOJIS_KEY, customEmoji);
  };

  return { emojiOptions, updateEmojis, readCustomEmojis, saveCustomEmojis };
});
