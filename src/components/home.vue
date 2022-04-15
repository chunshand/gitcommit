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
                        <NGridItem span="4 800:4">
                            <NSelect
                                v-model:value="type"
                                filterable
                                placeholder="类型"
                                size="large"
                                :options="typeOptions"
                            >
                            </NSelect>
                        </NGridItem>

                        <NGridItem span="5 800:5" :offset="1">
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
                <NText depth="3">Ctrl /Command + Alt 快速复制并关闭 </NText>
                <!-- <ElFormItem label="最后">
                        <NInput v-model="footer" type="textarea"></NInput>
                    </ElFormItem> -->
            </NGridItem>
        </NGrid>
    </NCard>
</template>
<script setup lang="ts">
import {  useMessage} from "naive-ui";
import useUtools from "../composeables/useUtools";
const message = useMessage();
const utools = useUtools()

const { ctrl_alt } = useMagicKeys();

whenever(ctrl_alt, () => {
    handleCopy()
} )

const handleCopy = async () => {
    if (!subject.value) {
        message.error("必填项必填");
        return;
    }
    let content = handleGetContent();
    await copy(content);
    message.success("复制成功");
    nextTick(() => {
        utools?.hideMainWindow();
    });
};
// https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/index.js
//  TODO 后期引入默认emoji
// TODO 后期引入国际化
const typeOptions = ref([
    {
        value: "feat",
        label: "新功能(feat)",
    },
    {
        value: "fix",
        label: "修复bug(fix)",
    },
    {
        value: "docs",
        label: "文档变更(docs)",
    },
    {
        value: "style",
        label: "无关代码的格式(style)",
    },
    {
        value: "refactor",
        label: "重构(refactor)",
    },
     {
        value: "perf",
        label: "优化性能(perf)",
    },
    {
        value: "test",
        label: "增加或更新测试(test)",
    },
    
    {
        value: "build",
        label: "构建系统或外部依赖更改(build)",
    },    
    {
        value: "ci",
        label: "CI配置或脚本变动(ci)",
    },
       {
        value: "chore",
        label: "不影响代码的变动(chore)",
    },
       {
        value: "revert",
        label: "回退之前版本(revert)",
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

</script>
<style scoped>
.card-class {
    width: 100%;
    height: 100vh;
}
</style>
