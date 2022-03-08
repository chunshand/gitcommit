

<template>
    <div class="main">
        <ElRow :gutter="0">
            <ElCol :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                <ElForm
                    label-position="top"
                    label-width="100px"
                    style="max-width: 460px"
                >
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
                <ElButton type="primary">生成</ElButton>
                <div></div>
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
</script>
<style lang="less" scoped>
*,
html,
body {
    padding: 0;
    margin: 0;
}
.main {
}
</style>
<style>
#app {
    padding: 0;
    margin: 0;
}
</style>
