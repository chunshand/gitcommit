import usePluginEnter, { IPluginEnterAction } from "./usePluginEnter";

export default function useUtools(_hook?: (action: IPluginEnterAction) => unknown) {
  let tools = reactive<UToolsApi>(window?.utools);
  usePluginEnter((action) => {
    tools = window!.utools;
    _hook && _hook(action);
  });
  return tools;
}

