<template>
    <NCard :bordered="false" class="card-class">
        <NGrid cols="24" item-responsive responsive="screen">
            <NGridItem span="24 m:24 l:24">
                <NSpace vertical>
                    <NSpace justify="end" align="center" size="large">
                        <NButton size="small" @click="settingRef?.switchSetting"> 设置 </NButton>
                        <NButton size="small" @click="showCustomMsgWindow = true">自定义msg</NButton>
                        <NButton size="small" @click="customeEmojiRef?.switchCustom"> 自定义emoji</NButton>
                        <NButton size="small" @click="helpRef?.switchHelp"> 帮助 </NButton>
                        <NButton size="small" @click="show = true"> 预览 </NButton>
                        <NButton type="warning" size="small" @click="handleClear">重置内容</NButton>
                        &nbsp;
                        <NButton
                            type="success"
                            size="small"
                            :disabled="copyDisabled"
                            @click="validCommit(handleCopy)"
                            ><span v-if="!copied">复制结果</span>
                            <span v-else>已复制</span>
                        </NButton>
                    </NSpace>
                    <NGrid cols="10" x-gap="12" y-gap="8">
                        <NGridItem span="4 800:4" v-show="!settingsStore.settings.value.isEmojiMode">
                            <NSelect
                                v-model:value="type"
                                filterable
                                placeholder="类型"
                                size="large"
                                :filter="useFilterMsg"
                                :options="commitMsgStore.list"
                                :render-label="commitMsgLabelRender"
                                :disabled="settingsStore.settings.value.isEmojiMode"
                            >
                            </NSelect>
                        </NGridItem>
                        <NGridItem :span="useGetSpan({ gitc: '6 800:6', gitemoji: '0' })">
                            <NInput
                                v-model:value="scope"
                                size="large"
                                placeholder="范围(非必填)"
                                :disabled="settingsStore.settings.value.isEmojiMode"
                            ></NInput>
                        </NGridItem>
                        <NGridItem :span="useGetSpan({ gitc: '4 800:4', gitemoji: '10' })">
                            <NSelect
                                v-model:value="emoji"
                                placeholder="emoji"
                                size="large"
                                :options="emojisStore.emojiOptions.value"
                                filterable
                                :disabled="!settingsStore.settings.value.isEmoji"
                                ref="searchEmoji"
                                :filter="useFilterEmoji"
                                :show-on-focus="true"
                                @update:value="settingsStore.settings.value.isEmojiMode && handleCopy()"
                            >
                            </NSelect>
                        </NGridItem>

                        <NGridItem :span="useGetSpan({ gitc: '6 800:6', gitemoji: '0' })">
                            <NInput
                                v-model:value="subject"
                                :maxlength="50 - commitStr.length + subject.length"
                                status="warning"
                                size="large"
                                :placeholder="`简短描述(必填),最多50字`"
                                :disabled="settingsStore.settings.value.isEmojiMode"
                                ref="scopRef"
                            >
                                <template #suffix>
                                    <n-text :type="50 - commitStr.length < 10 ? 'error' : 'warning'">
                                        {{ 50 - commitStr.length }}/50
                                    </n-text>
                                </template>
                            </NInput>
                        </NGridItem>

                        <NGridItem span="10">
                            <NInput
                                v-model:value="body"
                                type="textarea"
                                :rows="10"
                                size="large"
                                placeholder="具体内容(非必填)"
                                :disabled="settingsStore.settings.value.isEmojiMode"
                            >
                            </NInput>
                        </NGridItem>
                        <NGridItem span="10">
                            <p class="higlogtag-title">
                                历史记录
                                <NButton quaternary type="warning" size="tiny" @click="handleClearHigLog"
                                    >清空
                                </NButton>
                            </p>
                            <span
                                class="higlogtag"
                                v-for="(item, index) in historyLog"
                                :key="index"
                                @click.native="handleCopyHistoryLog(item)"
                                @dblclick.native="handleEditHistoryLog(item)"
                            >
                                <NEllipsis style="max-width: 240px" :tooltip="false">
                                    {{ item.content }}
                                    <template #tooltip>
                                        <div style="text-align: center; max-width: 240px">
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
                <NText depth="1"> 预览： </NText>
                <NInput :value="content" type="textarea" autosize size="large" disabled> </NInput>
            </NSpace>
        </NDrawerContent>
    </NDrawer>
    <Help ref="helpRef" />
    <SettingsView ref="settingRef" />
    <CustomeEmoji ref="customeEmojiRef" />
    <CustomCommitMsg ref="showCustomMsgWindow" />
</template>
<script setup lang="ts">
import useUtools, { paste } from "@/composables/useUtools";
import { useFilterEmoji, useFilterMsg, useFocusInput, useGetSpan } from "@/composables/useSearch";
import { settingsStore, useEmojisStore } from "@/store";
import { InputInst, SelectInst, SelectOption } from "naive-ui";
import { useCommitMsgStore } from "@/store/commitMsgStore";

// xxx:添加新emoji时在重新生成rawEmojis
// import { nameToEmoji } from "gemoji";
// 组成包含emoji的rawEmojis，复制到文件里
// console.log(rawEmojis.map((item) => ({
//     ...item,
//     emoji: nameToEmoji[item.name]
// })))

const SettingsView = defineAsyncComponent(() => import("@/components/SettingsView.vue"));
const Help = defineAsyncComponent(() => import("@/components/Help.vue"));
const CustomeEmoji = defineAsyncComponent(() => import("@/components/CustomEmoji.vue"));

const settingRef = ref<InstanceType<typeof SettingsView>>();
const helpRef = ref<InstanceType<typeof Help>>();
const customeEmojiRef = ref<InstanceType<typeof CustomeEmoji>>();

let clickTimer: any = null;
const _historyLogKEY = "historyLog";

interface commitInterface {
    type: string;
    scope?: string;
    emoji: string;
    subject: string;
    body?: string;
    content: string;
}
const historyLog = ref<commitInterface[]>([]);
const message = useMessage();
const dialog = useDialog();

useUtools((data) => {
    settingsStore.init();
    settingsStore.setMode(data.code);

    let payload: string = data.payload as string;
    let cmd: string = payload.replace(/^git(c|emoji)/, "");
    if (cmd) {
        type.value = cmd;
    }
    try {
        let list = window?.utools?.dbStorage.getItem(_historyLogKEY);
        historyLog.value = list ? JSON.parse(list) : [];
    } catch (error) {
        historyLog.value = [];
    }
});
const keys = useMagicKeys();
const shiftCtrlC = keys["Shift+Ctrl+C"];
const shiftCtrlR = keys["Shift+Ctrl+R"];
const show = ref(false);
const CtrlP = keys["Ctrl+P"];
// 复制
whenever(shiftCtrlC, () => {
    validCommit(handleCopy);
});
// 预览
whenever(CtrlP, () => {
    show.value = !show.value;
});
// 重置内容
whenever(shiftCtrlR, () => {
    handleClear();
});
/**
 * 渲染消息
 * @param option label option
 * @return label str
 */
const commitMsgLabelRender = (option: SelectOption): string => option.label + "(" + option.value + ")";
const showCustomMsgWindow = ref<boolean>(false);
const validCommit = (fn: () => Promise<void>) => {
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
    fn();
};

const handleCopy = async () => {
    await copy(content.value);
    if (historyLog.value.length >= 5) {
        historyLog.value.splice(0, 1);
    }
    historyLog.value.push({
        type: type.value,
        scope: scope.value,
        emoji: emoji.value,
        subject: subject.value,
        body: body.value,
        content: content.value
    });
    window?.utools?.dbStorage.setItem(_historyLogKEY, JSON.stringify(historyLog.value));
    show.value = false;
    window?.utools?.hideMainWindow();
    if (settingsStore.settings.value.autoPaste) {
        paste();
    }
};
// https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/index.js
const commitMsgStore = useCommitMsgStore();
const emojisStore = useEmojisStore();

// 默认emoji
const defatltEmoji = ref(emojisStore.emojiOptions.value[0].value);
// 类型
const type = ref("feat");
const emoji = ref(defatltEmoji.value);
watch(
    type,
    (val) => {
        const _emoji = commitMsgStore.list.find((item) => item.value === val)!.emoji;
        emoji.value =
            emojisStore.emojiOptions.value.find((item: { value: string }) => item.value.startsWith(_emoji))
                ?.value ?? defatltEmoji.value;
    },
    { immediate: true }
);
// 范围
const scope = ref("");
// 简短描述
const subject = ref("");

// body
const body = ref("");

const commitStr = computed(() => {
    const { isEmojiMode } = settingsStore.settings.value;

    const _type = isEmojiMode ? "" : type.value;
    const _scope = scope.value ? `(${scope.value})` : "";
    const symbol = isEmojiMode ? "" : ": ";
    const _emoji = settingsStore.settings.value.isEmoji ? parseEmojiValue() + " " : "";
    return `${_type}${_scope}${symbol}${_emoji}${subject.value}`;
});

const content = computed(() => {
    let commit: string = commitStr.value;
    commit += body.value && `\r\n\r\n${body.value}\r\n\r\n`;
    return commit;
});
const contentBefor = computed(() => {
    let commit: string = `${type.value}${scope.value ? "(" + scope.value + ")" : ""}: ${
        settingsStore.settings.value.isEmoji ? parseEmojiValue() : ""
    } ${subject.value}`;
    return commit;
});
const copyDisabled = computed((): boolean => {
    return type.value && subject.value ? false : true;
});
const { copy, copied } = useClipboard({
    source: content
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
            type.value = commitMsgStore.list[0].value;
        }
    });
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
};
const handleEditHistoryLog = (item: commitInterface) => {
    if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
    }
    subject.value = item.subject;
    scope.value = item.scope ?? "";
    body.value = item.body ?? "";
    type.value = item.type;
    message.success("设置成功");
};

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
    });
};

const scopRef = ref<InputInst>();
const searchEmoji = ref<SelectInst>();
useFocusInput({
    gitc: scopRef as Ref<InputInst>,
    gitemoji: searchEmoji as Ref<SelectInst>
});

const parseEmojiValue = () => {
    const tempEmojis = emoji.value.split(" ");
    return settingsStore.settings.value.isCodeEmoji ? tempEmojis[1] : tempEmojis[0];
};
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
