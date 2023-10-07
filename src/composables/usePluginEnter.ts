export type Mode = "git-commit" | "git-emoji";
export interface IPluginEnterAction {
  // 'code' from plugin
  code: Mode;
  type: string;
  payload: any;
}

export default function usePluginEnter(
  hook: (action: IPluginEnterAction) => unknown
) {
  window?.utools?.onPluginEnter((action) => {
    return hook(action as IPluginEnterAction);
  });
}

export const usePluginActive = (callback: () => void) => {
  const onVisibilityChange = function () {
    if (!document.hidden) callback();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
};
