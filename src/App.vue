

<template>
    <div class="w-full p-8">
        <ElRow :gutter="0">
            <ElCol
                :xs="{
                    span: 24,
                }"
                :sm="{
                    span: 24,
                }"
                :md="{
                    span: 24,
                }"
                :lg="{
                    span: 12,
                    offset: 6,
                }"
                :xl="{
                    span: 10,
                    offset: 7,
                }"
            >
                <div class="text-right">
                    <ElButton type="warning" size="small" @click="handleClear"
                        >重置内容</ElButton
                    >
                </div>
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
                                :label="item.label + '(' + item.value + ')'"
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
                        <ElInput
                            v-model="body"
                            type="textarea"
                            :rows="10"
                        ></ElInput>
                    </ElFormItem>

                    <!-- <ElFormItem label="最后">
                        <ElInput v-model="footer" type="textarea"></ElInput>
                    </ElFormItem> -->
                </ElForm>

                <div class="py-2">
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
                            :disabled="copyDisabled"
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
import { ref, computed } from "vue";
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
<style lang="less" scoped>
</style>

