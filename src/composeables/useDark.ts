import { Ref } from "vue";
import usePluginEnter from "./usePluginEnter";

export default function useDark(): Ref<boolean> {
  const isDark = ref<boolean>(false);
  usePluginEnter(() => {
    isDark.value = window?.utools.isDarkColors();
  });
  return isDark;
}
