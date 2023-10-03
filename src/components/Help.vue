<template>
    <NDrawer v-model:show="openHelp" height="80%" placement="bottom">
        <NDrawerContent>
            <NText depth="1">帮助： </NText>
            <div
                class="help"
                v-for="(contents, contentsIndex) in Object.entries(helpContent)"
                :key="contentsIndex"
            >
                <div class="help-title">
                    <NText depth="2">{{ contents[0] }}：</NText>
                </div>
                <div class="help-content">
                    <NSpace vertical>
                        <NText depth="3" v-for="(item, index) in contents[1]" :key="index">
                            <template v-if="item.code">
                                <NText code>{{ item.code }}</NText>
                            </template>
                            {{ item.commnet }}
                        </NText>
                    </NSpace>
                </div>
            </div>
        </NDrawerContent>
    </NDrawer>
</template>
<script setup lang="ts">
import { useWindowHandle } from "@/composables/useWindowHandle"

let { isOpenWindow: openHelp, switchWindow: switchHelp } = useWindowHandle()
defineExpose({ switchHelp })

type HelpContentType = {
    code?: string
    commnet: string
}
const helpContent: {
    [key: string]: HelpContentType[]
} = {
    "通用": [
        { code: "Ctrl + Shift + C", commnet: "快速复制 并关闭工具" },
        { code: "Ctrl + Shift + R", commnet: "重置内容" },
        { code: "Ctrl + P", commnet: "快速打开预览，关闭预览" },
        { code: "Tab", commnet: "快速切换输入框" },
        {
            commnet: "历史记录最多保存5条历史，单击复制信息内容，双击将对应信息内容设置到表单，方便二次编辑"
        }
    ],
    "gitemoji关键字": [
        { commnet: "在该关键字下支持emoji中文或英文搜索" },
        { commnet: "选中emoji后按下回车可以快速复制" }
    ]
}
</script>
<style scoped>
.help {
    --space: 8px;
    margin-left: var(--space);
}
.help-title {
    padding-top: calc(var(--space) + 3px);
}
.help-content {
    margin-left: var(--space);
}
</style>
