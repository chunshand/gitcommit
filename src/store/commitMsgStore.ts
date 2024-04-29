import { CommitMsg, getDefaultMsg } from "@/data";

export const CUSTOM_COMMIT_MSG_KEY = "CUSTOM_COMMIT_MSG";
/**
 * 消息合并,source中如果出现相同value的会被target中的合并
 * @param source 非空
 * @param target 非空
 */
const doMergeMsg = (source: CommitMsg[], target: CommitMsg[]): void => {
  if (target === null || target.length === 0) {
    return;
  }
  let replace: boolean;
  for (let i = 0; i < target.length; i++) {
    replace = false;
    for (let j = 0; j < source.length; j++) {
      if (target[i].value === source[j].value) {
        //覆盖掉之前的
        source[j] = target[i];
        replace = true;
        break;
      }
    }
    if (!replace) {
      source.push(target[i]);
    }
  }
};
/**
 * 初始化消息
 */
const initCommitMsg = (): CommitMsg[] => {
  const customCommitMsg: CommitMsg[] = JSON.parse(
    utools.dbStorage.getItem(CUSTOM_COMMIT_MSG_KEY)
  );
  //合并msg
  const defaultMsg = getDefaultMsg();
  doMergeMsg(defaultMsg, customCommitMsg);
  return defaultMsg;
};

export const useCommitMsgStore = createGlobalState(() => {
  const list: CommitMsg[] = reactive(initCommitMsg());
  const update = (data: string) => {
    //解析
    const customMsg: CommitMsg[] = JSON.parse(data);
    //合并msg
    const defaultMsg = getDefaultMsg();
    doMergeMsg(defaultMsg, customMsg);
    //保存至uTools中
    utools.dbStorage.setItem(CUSTOM_COMMIT_MSG_KEY, data);
    list.length = 0;
    list.push(...defaultMsg);
  };
  return { list, update };
});
