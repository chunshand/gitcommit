export interface IPluginEnterAction {
  code: string;
  type: string;
  payload: any;
}

export default function usePluginEnter(
  hook: (action: IPluginEnterAction) => unknown
) {
  onMounted(() => {
    window?.utools?.onPluginEnter((action) => {
        return hook(action);
    });
  });
}
