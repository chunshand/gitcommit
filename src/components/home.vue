<template>
  <NCard :bordered="false" class="card-class">
    <NGrid cols="24" item-responsive responsive="screen">
      <NGridItem span="24 m:24 l:24">
        <NSpace vertical>
          <NSpace justify="end" align="center" size="large">
            <NCheckbox v-model:checked="ISEmoji" title="是否开启Emoji" :on-update:checked="handleISEmojiChange">
              Emoji
            </NCheckbox>
            <NButton size="small" @click="help = true">
              帮助
            </NButton>
            <NButton size="small" @click="show = true">
              预览
            </NButton>
            <NButton type="warning" size="small" @click="handleClear">重置内容</NButton>
            &nbsp;
            <NButton type="success" size="small" :disabled="copyDisabled" @click="handleCopy()"><span
                v-if="!copied">复制结果</span>
              <span v-else>已复制</span>
            </NButton>
          </NSpace>
          <NGrid cols="10" x-gap="12" y-gap="8">
            <NGridItem span="4 800:4">
              <NSelect v-model:value="type" filterable placeholder="类型" size="large" :options="typeOptions">
              </NSelect>
            </NGridItem>
            <NGridItem span="6 800:6">
              <NInput v-model:value="scope" size="large" placeholder="范围(非必填)" autofocus></NInput>
            </NGridItem>
            <NGridItem span="4  800:4">
              <NSelect v-model:value="emoji" placeholder="emoji" size="large" :options="emojiOptions" filterable
                :disabled="!ISEmoji">
              </NSelect>
            </NGridItem>

            <NGridItem span="6 800:6">
              <NInput v-model:value="subject" :maxlength="50" status="warning" size="large" placeholder="简短描述(必填),最多50字">
              </NInput>
            </NGridItem>

            <NGridItem span="10">
              <NInput v-model:value="body" type="textarea" :rows="10" size="large" placeholder="具体内容(非必填)">
              </NInput>
            </NGridItem>
            <NGridItem span="10">
              <p class="higlogtag-title">历史记录 <NButton quaternary type="warning" size="tiny" @click="handleClearHigLog">清空
                </NButton>
              </p>
              <span class="higlogtag" v-for="item, index in historyLog" :key="index"
                @click.native="handleCopyHistoryLog(item)" @dblclick.native="handleEditHistoryLog(item)">
                <NEllipsis style="max-width: 240px" :tooltip="false">
                  {{ item.content }}
                  <template #tooltip>
                    <div style="text-align: center;max-width:240px">
                      {{ item.content }}
                    </div>
                  </template>
                </NEllipsis>
              </span>
            </NGridItem>
          </NGrid>
        </NSpace>
      </NGridItem>
    </NGrid>
  </NCard>
  <NDrawer v-model:show="show" placement="bottom">
    <NDrawerContent>
      <NSpace vertical>
        <NText depth="1">
          预览：
        </NText>
        <NInput :value="content" type="textarea" autosize size="large" disabled>
        </NInput>
      </NSpace>

    </NDrawerContent>
  </NDrawer>
  <NDrawer v-model:show="help" height="80%" placement="bottom">
    <NDrawerContent>
      <NSpace vertical>
        <NText depth="1">
          帮助：
        </NText>
        <NText depth="3">
          <NText code>Ctrl + Shift + C</NText> 快速复制 并关闭工具
        </NText>
        <NText depth="3">
          <NText code>Ctrl + Shift + R</NText> 重置内容
        </NText>
        <NText depth="3">
          <NText code>Ctrl + P</NText> 快速打开预览，关闭预览
        </NText>
        <NText depth="3">
          <NText code>Tab</NText> 快速切换输入框
        </NText>
        <NText depth="3">
          历史记录最多保存5条历史，单击复制信息内容，双击将对应信息内容设置到表单，方便二次编辑
        </NText>
      </NSpace>
    </NDrawerContent>
  </NDrawer>
</template>
<script setup lang="ts">
import { useMessage, useDialog } from 'naive-ui'
import { nameToEmoji } from 'gemoji'
import useUtools from "../composables/useUtools";
import { rawEmojis, typeData } from "../data";
let clickTimer: any = null;
const _historyLogKEY = "historyLog";
const _ISEmojiKey = "ISEmoji";
interface commitInterface {
  type: string,
  scope?: string,
  emoji: string,
  subject: string,
  body?: string
  content: string
}
const historyLog = ref<commitInterface[]>([]);
const message = useMessage();
const dialog = useDialog();
useUtools((data) => {
  let payload: string = data.payload as string;
  let cmd: string = payload.replace('gitc', '');
  if (cmd) {
    type.value = cmd;
  }
  try {
    let list = window?.utools?.dbStorage.getItem(_historyLogKEY);
    historyLog.value = list ? JSON.parse(list) : [];
    let ISEmojiValue = window?.utools?.dbStorage.getItem(_ISEmojiKey) ? true : false;
    ISEmoji.value = ISEmojiValue;
  } catch (error) {
    historyLog.value = [];
  }

})
const keys = useMagicKeys();
const shiftCtrlC = keys['Shift+Ctrl+C']
const shiftCtrlR = keys['Shift+Ctrl+R']
const show = ref(false);
const help = ref(false);
const CtrlP = keys['Ctrl+P']
const ISEmoji = ref(true);
// 复制
whenever(shiftCtrlC, () => {
  handleCopy()
})
// 预览
whenever(CtrlP, () => {
  show.value = !show.value;
})
// 重置内容
whenever(shiftCtrlR, () => {
  handleClear()
})
const handleISEmojiChange = (value: any) => {
  window?.utools?.dbStorage.setItem(_ISEmojiKey, value)
  ISEmoji.value = value;
}
const handleCopy = async () => {
  if (!subject.value) {
    message.error("简短描述 必填");
    show.value = false;
    return;
  }
  if (contentBefor.value.length > 50) {
    message.error("单行行头超过了50字符。");
    show.value = false;
    return;
  }
  await copy(content.value);
  if (historyLog.value.length >= 5) {
    historyLog.value.splice(0, 1)
  }
  historyLog.value.push(
    {
      type: type.value,
      scope: scope.value,
      emoji: emoji.value,
      subject: subject.value,
      body: body.value,
      content: content.value
    });
  window?.utools?.dbStorage.setItem(_historyLogKEY, JSON.stringify(historyLog.value))
  show.value = false;
  window?.utools?.hideMainWindow();
};
// https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/index.js
const typeOptions = ref(typeData);
// 默认emoji
const defatltEmoji = ref("✨");
// 类型
const type = ref("feat");
watch(type, (val) => {
  emoji.value = typeOptions.value.find((item) => item.value === val)?.emoji ?? defatltEmoji.value
})
// 范围
const scope = ref("");
// 简短描述
const subject = ref("");

// body
const body = ref("");

const emoji = ref(defatltEmoji.value)

const emojiOptions = computed(() => {
  return rawEmojis.map((item) => {
    return {
      ...item,
      value: nameToEmoji[item.name],
      label: `${nameToEmoji[item.name]} ${item.description}`,
    }
  })
})

const content = computed(() => {
  let commit: string = `${type.value}${scope.value ? '(' + scope.value + ')' : ''}: ${ISEmoji.value ? emoji.value : ''} ${subject.value}`;
  commit += body.value && `\r\n\r\n${body.value}\r\n\r\n`
  return commit;
});
const contentBefor = computed(() => {
  let commit: string = `${type.value}${scope.value ? '(' + scope.value + ')' : ''}: ${ISEmoji.value ? emoji.value : ''} ${subject.value}`;
  return commit;
});
const copyDisabled = computed((): boolean => {
  return type.value && subject.value ? false : true;
});
const { copy, copied } = useClipboard({
  source: content,
});
const handleClear = () => {
  dialog.warning({
    title: "警告",
    content: "你确定要重置当前的内容?",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      subject.value = "";
      scope.value = "";
      body.value = "";
      type.value = typeOptions.value[0].value;
    }
  })
};

const handleCopyHistoryLog = (item: commitInterface) => {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
  clickTimer = setTimeout(async () => {
    await copy(item.content);
    message.success("复制成功");
  }, 300);
}
const handleEditHistoryLog = (item: commitInterface) => {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
  subject.value = item.subject;
  scope.value = item.scope ?? '';
  body.value = item.body ?? "";
  type.value = item.type;
  message.success("设置成功");
}

const handleClearHigLog = () => {
  dialog.warning({
    title: "警告",
    content: "你确定要清空历史记录吗?",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      historyLog.value = [];
      window?.utools?.dbStorage.setItem(_historyLogKEY, JSON.stringify([]));
    }
  })
}


</script>

<style scoped>
.card-class {
  width: 100%;
  height: 100vh;
}

.higlogtag-title {
  margin: 0;
  padding-bottom: 8px;
  font-size: 12px;
}

.higlogtag {
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  user-select: none;
  margin-right: 4px;
  margin-top: 4px;
  display: inline-block;
}
</style>
