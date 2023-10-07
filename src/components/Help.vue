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
                <ul class="help-content">
                    <NSpace vertical>
                        <li v-for="(item, index) in contents[1]" :key="index">
                            <NText depth="3">
                                <template v-if="item.code">
                                    <NText code>{{ item.code }}</NText
                                    >&ensp;
                                </template>
                                <span v-html="item.commnet"></span>
                            </NText>
                        </li>
                    </NSpace>
                </ul>
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
    "【通用】": [
        { code: "Ctrl + Shift + C", commnet: "快速复制 并关闭工具" },
        { code: "Ctrl + Shift + R", commnet: "重置内容" },
        { code: "Ctrl + P", commnet: "快速打开预览，关闭预览" },
        { code: "Tab", commnet: "快速切换输入框" },
        {
            commnet: "历史记录最多保存5条历史，单击复制信息内容，双击将对应信息内容设置到表单，方便二次编辑"
        }
    ],
    "【gitemoji关键字】—— 快速搜索，可用于仅需要相关emoji表情": [
        { commnet: "在该关键字下可直接使用英文或中文（首字母）搜索emoji" },
        { commnet: "选中emoji后按下回车可以快速复制" }
    ],
    "【自定义emoji】—— 更改已有或添加自己的emoji": [
        {
            commnet:
                "请填入JSON<b>数组</b>格式的文本，数组中的每个元素都为对象，每个对象都是一个emoji所需信息"
        },
        {
            commnet: `每个对象包含以下四个键：<ul>
                <li><b>name</b>(必填)：emoji的代码，例<b>:fire:</b> 填入时不需要两端<b>:</b>，<b>name</b>值相同的对象，<u>后面的对象会覆盖前面</u>的，据此可更改内置的emoji</li>
                <li><b>emoji</b>(可省略)：emoji代码对应的表情，例<b>🔥</b>，如果是新添加的emoji不建议省略！</li>
                <li><b>description</b>(可省略)： 对该表情的使用描述，例<b>删除代码或者文件</b> </li>
                <li><b>pinyin</b>(可省略)：自定义关键字，可以使用对应拼音<b>shan chu dai ma huo zhe wen jian</b>（每个汉字的拼音请用空格隔开，以便支持首字母搜索），也可以自己定义<b>hello</b></li>
                <li>以上四个键的值都能作为搜索条件哦</li></ul>
                `
        },
        {
            commnet: `以下是示例代码。第一个对象更改内置的fire表情的描述和pinyin，之后可以在搜索中输入hello快速查找；第二个对象新添了一个emoji信息<br/>
    <pre>
[
  {
    "name": "fire",
    "description": "这是更改后的描述",
    "pinyin": "hello"
  },{
    "name": "apple",
    "description": "修复在苹果系统上的问题",
    "pinyin": "xiu fu zai ping guo xi tong shang de wen ti",
    "emoji": "🍎"
  }
]
    </pre></b>`
        }
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
ul,
li {
    margin: 0;
    padding-left: 3px;
    list-style-position: inside;
}
:deep(b) {
    font-weight: 400;
    padding: 0.01em 0.35em 0.2em 0.33em;
    border-radius: 3px;
}
@media (prefers-color-scheme: dark) {
    :deep(b) {
        background-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.82);
    }
}
@media (prefers-color-scheme: light) {
    :deep(b) {
        background-color: rgb(244, 244, 248);
        color: rgb(65, 68, 71);
    }
}
</style>
