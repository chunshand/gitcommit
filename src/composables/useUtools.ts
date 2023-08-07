import usePluginEnter, { IPluginEnterAction } from "./usePluginEnter";

export default function useUtools(
  _hook?: (action: IPluginEnterAction) => unknown
) {
  let tools = reactive<UToolsApi>(window?.utools);
  usePluginEnter((action) => {
    tools = window!.utools;
    _hook && _hook(action);
  });
  return tools;
}

export const paste = () => {
  if (utools.isMacOs()) {
    utools.simulateKeyboardTap("v", "command");
    return;
  }
  utools.simulateKeyboardTap("v", "ctrl");
};
