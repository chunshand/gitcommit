

<template>
    <div class="w-full p-2">
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
                <div class="text-right p-2">
                    <ElButton type="warning" size="small" @click="handleClear"
                        >重置内容</ElButton
                    >
                    <ElButton
                        type="success"
                        size="small"
                        :disabled="copyDisabled"
                        @click="copy(content)"
                        ><span v-if="!copied">复制结果</span>
                        <span v-else>已复制</span></ElButton
                    >
                </div>
                <div class="flex justify-center items-center">
                    <div class="mx-2">
                        <ElSelect
                            v-model="type"
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
                    </div>

                    <div class="mx-2 w-full">
                        <ElInput v-model="scope" size="large"></ElInput>
                    </div>
                </div>
                <div class="p-2">
                    <ElInput v-model="subject" size="large"></ElInput>
                </div>
                <div class="p-2">
                    <ElInput
                        v-model="body"
                        type="textarea"
                        :rows="10"
                        size="large"
                    ></ElInput>
                </div>

                <!-- <ElFormItem label="最后">
                        <ElInput v-model="footer" type="textarea"></ElInput>
                    </ElFormItem> -->

                <div class="py-2">
                    <div class="text-right"></div>
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

