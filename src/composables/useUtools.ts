import usePluginEnter from "./usePluginEnter";

export default function useUtools(){
  let tools = reactive<UToolsApi>(window?.utools);
  usePluginEnter(() => {
    tools = window!.utools;
  });
  return tools;
}

