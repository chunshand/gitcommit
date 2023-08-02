import { Ref, onMounted } from "vue";

export default function useDark(): Ref<boolean> {
  const isDark = ref<boolean>(false);
  onMounted(() => {
    isDark.value = window?.utools.isDarkColors();
  });
  return isDark;
}
