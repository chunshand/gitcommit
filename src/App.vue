

<template>
    <div class="w-full p-8">
        <ElRow :gutter="0">
            <ElCol :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <ElForm class="w-full" label-position="top" label-width="100px">
                    <ElFormItem label="类型" :hide-required-asterisk="true">
                        <ElSelect
                            v-model="type"
                            class="m-2"
                            placeholder="Select"
                            size="large"
                        >
                            <ElOption
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </ElOption>
                        </ElSelect>
                    </ElFormItem>

                    <ElFormItem label="范围">
                        <ElInput v-model="scope"></ElInput>
                    </ElFormItem>

                    <ElFormItem label="简短描述" :hide-required-asterisk="true">
                        <ElInput v-model="subject"></ElInput>
                    </ElFormItem>

                    <ElFormItem label="内容">
                        <ElInput v-model="body" type="textarea"></ElInput>
                    </ElFormItem>

                    <!-- <ElFormItem label="最后">
                        <ElInput v-model="footer" type="textarea"></ElInput>
                    </ElFormItem> -->
                </ElForm>

                <div class="py-2">
                    <div class="pb-2 text-right">
                        <ElButton
                            type="primary"
                            class="w-40"
                            @click="handleCreate"
                            >生成</ElButton
                        >
                    </div>

                    <div class="pb-2">
                        <ElInput
                            v-model="content"
                            type="textarea"
                            disabled
                            :rows="10"
                        ></ElInput>
                    </div>
                    <div class="text-right">
                        <ElButton
                            type="success"
                            class="w-40"
                            @click="copy(content)"
                            ><span v-if="!copied">复制</span>
                            <span v-else>已复制</span></ElButton
                        >
                    </div>
                </div>
            </ElCol>
        </ElRow>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
    ElButton,
    ElInput,
} from "element-plus";
import { useClipboard } from "@vueuse/core";
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
    {
        value: "build",
        label: "构建变动",
    },
    {
        value: "ci",
        label: "继承变动",
    },
    {
        value: "revert",
        label: "回滚提交",
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

const content = ref("");

const { text, copy, copied, isSupported } = useClipboard({
    source: content,
});

const handleCreate = () => {};
</script>
<style lang="less" scoped>
</style>

