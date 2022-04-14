<template>
    <NCard :bordered="false" class="card-class">
        <NGrid cols="24" item-responsive responsive="screen">
            <NGridItem span="24 m:12 l:12" offset="0 m:6 l:6">
                <NSpace vertical>
                    <NSpace justify="end" size="large">
                        <NButton
                            type="warning"
                            size="small"
                            @click="handleClear"
                            >重置内容</NButton
                        >

                        <NButton
                            type="success"
                            size="small"
                            :disabled="copyDisabled"
                            @click="handleCopy()"
                            ><span v-if="!copied">复制结果</span>
                            <span v-else>已复制</span>
                        </NButton>
                    </NSpace>
                    <NGrid cols="10">
                        <NGridItem span="3 800:3">
                            <NSelect
                                v-model:value="type"
                                placeholder="类型"
                                size="large"
                                :options="typeOptions"
                            >
                            </NSelect>
                        </NGridItem>

                        <NGridItem span="6 800:6" :offset="1">
                            <NInput
                                v-model:value="scope"
                                size="large"
                                placeholder="范围(非必填)"
                            ></NInput
                        ></NGridItem>
                    </NGrid>
                    <NInput
                        v-model:value="subject"
                        size="large"
                        placeholder="简短描述(必填)"
                    ></NInput>

                    <NInput
                        v-model:value="body"
                        type="textarea"
                        :rows="10"
                        size="large"
                        placeholder="具体内容(非必填)"
                    ></NInput>
                </NSpace>
                <NText depth="3">Ctrl + Shift + C 快速复制并关闭 </NText>
                <!-- <ElFormItem label="最后">
                        <NInput v-model="footer" type="textarea"></NInput>
                    </ElFormItem> -->
            </NGridItem>
        </NGrid>
    </NCard>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
    NCard,
    NGrid,
    NGridItem,
    NForm,
    NFormItem,
    NSelect,
    NButton,
    NInput,
    NSpace,
    NText,
    useMessage,
} from "naive-ui";
import { useClipboard, useMagicKeys } from "@vueuse/core";
const message = useMessage();

const keys = useMagicKeys();
const shiftCtrlC = keys["Ctrl+Shift+C"];

watch(shiftCtrlC, (v) => {
    if (v) {
        handleCopy();
    }
});
const typeOptions = ref([
    {
        value: "feat",
        label: "新功能",
    },
    {
        value: "fix",
        label: "修补bug",
    },
    {
        value: "docs",
        label: "文档",
    },
    {
        value: "style",
        label: "格式",
    },
    {
        value: "refactor",
        label: "重构",
    },
    {
        value: "perf",
        label: "性能 体验优化",
    },
    {
        value: "test",
        label: "增加 更新测试",
    },
]);
// 类型
const type = ref("feat");
// 范围
const scope = ref("");
// 简短描述
const subject = ref("");

// body
const body = ref("");

// 最后
const footer = ref("");

const content = computed(() => {
    let commit = "";
    commit += type.value;
    if (scope.value) {
        commit += "(" + scope.value + ")";
    }
    commit += ": " + subject.value;

    if (body.value) {
        commit += "\r\n\r\n" + body.value + "\r\n\r\n";
    }
    return commit;
});
const handleGetContent = () => {
    let commit = "";
    commit += type.value;
    if (scope.value) {
        commit += "(" + scope.value + ")";
    }
    commit += ": " + subject.value;

    if (body.value) {
        commit += "\r\n\r\n" + body.value + "\r\n\r\n";
    }
    return commit;
};
const copyDisabled = computed((): boolean => {
    return type.value && subject.value ? false : true;
});
const { text, copy, copied, isSupported } = useClipboard({
    source: content,
});
const handleClear = () => {
    subject.value = "";
    scope.value = "";
    body.value = "";
    type.value = typeOptions.value[0].value;
};
let utools = null;
onMounted(() => {
    if (window["utools"]) {
        utools = window["utools"];
    }
});
const handleCopy = async () => {
    if (!subject.value) {
        message.error("必填项必填");
        return;
    }
    let content = handleGetContent();
    await copy(content);
    message.success("复制成功");
    nextTick(() => {
        utools && utools.hideMainWindow();
    });
};
</script>
<style scoped>
.card-class {
    width: 100%;
    height: 100vh;
}
</style>
