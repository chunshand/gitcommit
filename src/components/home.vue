<template>
    <NCard :bordered="false" class="card-class">
        <NGrid cols="24" item-responsive responsive="screen">
            <NGridItem span="24 m:12 l:12" offset="0 m:6 l:6">
                <NSpace vertical>
                    <NSpace justify="end" size="large">
                        <NButton type="warning" size="small" @click="handleClear">重置内容</NButton>

                        <NButton type="success" size="small" :disabled="copyDisabled" @click="handleCopy()"><span
                                v-if="!copied">复制结果</span>
                            <span v-else>已复制</span>
                        </NButton>
                    </NSpace>
                    <NGrid cols="10" x-gap="12" y-gap="8">
                        <NGridItem span="4 800:4">
                            <NSelect v-model:value="type" filterable placeholder="类型" size="large"
                                :options="typeOptions">
                            </NSelect>
                        </NGridItem>

                        <NGridItem span="6 800:6">
                            <NInput v-model:value="scope" size="large" placeholder="范围(非必填)"></NInput>
                        </NGridItem>
                        <NGridItem span="4 800:4">
                            <NSelect v-model:value="emoji" placeholder="emoji" size="large" :options="emojiOptions"
                                filterable>
                            </NSelect>
                        </NGridItem>
                        <NGridItem span="6 800:6">
                            <NInput v-model:value="subject" status="warning" size="large" placeholder="简短描述(必填)">
                            </NInput>
                        </NGridItem>
                        <NGridItem span="10">
                            <NInput v-model:value="body" type="textarea" :rows="10" size="large"
                                placeholder="具体内容(非必填)">
                            </NInput>
                        </NGridItem>
                    </NGrid>


                </NSpace>
                <NText depth="3">Ctrl /Command + Alt 快速复制并关闭 </NText>
                <!-- <ElFormItem value="最后">
                        <NInput v-model="footer" type="textarea"></NInput>
                    </ElFormItem> -->
            </NGridItem>
        </NGrid>
    </NCard>
</template>
<script setup lang="ts">
import { useMessage } from "naive-ui";
import { nameToEmoji } from 'gemoji'
import useUtools from "../composables/useUtools";
const message = useMessage();
const utools = useUtools()


const { ctrl_alt } = useMagicKeys();

whenever(ctrl_alt, () => {
    handleCopy()
})

const handleCopy = async () => {
    if (!subject.value) {
        message.error("必填项必填");
        return;
    }
    await copy(content.value);
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
        emoji: "✨",
    },
    {
        value: "fix",
        label: "修复bug(fix)",
        emoji: "🐛",
    },
    {
        value: "docs",
        label: "文档变更(docs)",
        emoji: "📝",
    },
    {
        value: "style",
        label: "无关代码的格式(style)",
        emoji: "🎨",
    },
    {
        value: "refactor",
        label: "重构(refactor)",
        emoji: "♻️",
    },
    {
        value: "perf",
        label: "优化性能(perf)",
        emoji: "⚡️",
    },
    {
        value: "test",
        label: "增加或更新测试(test)",
        emoji: "✅",
    },

    {
        value: "build",
        label: "构建系统或外部依赖更改(build)",
        emoji: "🛠️",
    },
    {
        value: "ci",
        label: "CI配置或脚本变动(ci)",
        emoji: "👷",
    },
    {
        value: "chore",
        label: "不影响代码的其余变动(chore)",
        emoji: "🔧",
    },
    {
        value: "revert",
        label: "回退之前版本(revert)",
        emoji: "⏪",
    },

]);
// 类型
const type = ref("feat");

watch(type, (val) => {
    // console.log(val)
    emoji.value = typeOptions.value.find((item) => item.value === val)?.emoji ?? '✨'
})
// 范围
const scope = ref("");
// 简短描述
const subject = ref("");

// body
const body = ref("");

// 最后
const footer = ref("");

const rawEmojis = [
    { "name": "art", "description": "结构改进 / 格式化代码" },
    { "name": "zap", "description": "性能改善" },
    { "name": "fire", "description": "删除代码或者文件" },
    { "name": "bug", "description": "修了一个 BUG" },
    { "name": "ambulance", "description": "重大热修复" },
    { "name": "sparkles", "description": "引入新的特性" },
    { "name": "pencil", "description": "写文档" },
    { "name": "rocket", "description": "部署相关" },
    { "name": "lipstick", "description": "更新界面与样式文件" },
    { "name": "tada", "description": "创世提交" },
    { "name": "white_check_mark", "description": "更新测试" },
    { "name": "lock", "description": "修复安全问题" },
    { "name": "apple", "description": "修复在苹果系统上的问题" },
    { "name": "penguin", "description": "修复在 Linux 系统上的问题" },
    { "name": "checkered_flag", "description": "修复在 Windows 系统上的问题" },
    { "name": "robot", "description": "修复在安卓系统上的问题" },
    { "name": "green_apple", "description": "修复在 iOS 系统上的问题" },
    { "name": "bookmark", "description": "发布 / 版本标签" },
    { "name": "rotating_light", "description": "消除 linter 警告" },
    { "name": "construction", "description": "进行中" },
    { "name": "green_heart", "description": "修复持续集成构建" },
    { "name": "arrow_down", "description": "降级依赖" },
    { "name": "arrow_up", "description": "升级依赖" },
    { "name": "pushpin", "description": "固定依赖在特定的版本" },
    { "name": "construction_worker", "description": "添加持续集成构建系统" },
    { "name": "chart_with_upwards_trend", "description": "添加分析或者跟踪代码" },
    { "name": "recycle", "description": "代码重构" },
    { "name": "whale", "description": "Docker 容器相关" },
    { "name": "heavy_plus_sign", "description": "添加依赖" },
    { "name": "heavy_minus_sign", "description": "删除依赖" },
    { "name": "wrench", "description": "改变配置文件" },
    { "name": "globe_with_meridians", "description": "国际化与本地化" },
    { "name": "pencil2", "description": "修正拼写错误" },
    { "name": "poop", "description": "写需要改进的坏代码" },
    { "name": "rewind", "description": "回滚改动" },
    { "name": "twisted_rightwards_arrows", "description": "合并分支" },
    { "name": "package", "description": "更新编译后的文件或者包" },
    { "name": "alien", "description": "由于外部 API 变动而更新代码" },
    { "name": "truck", "description": "文件移动或者重命名" },
    { "name": "page_facing_up", "description": "添加或者更新许可" },
    { "name": "boom", "description": "引入破坏性的改动" },
    { "name": "bento", "description": "添加或者更新静态资源" },
    { "name": "ok_hand", "description": "代码审核后更新代码" },
    { "name": "wheelchair", "description": "改进可访问性" },
    { "name": "bulb", "description": "给源代码加文档" },
    { "name": "beers", "description": "醉写代码" },
    { "name": "speech_balloon", "description": "更新文本和字面" },
    { "name": "card_file_box", "description": "执行数据库相关的改动" },
    { "name": "loud_sound", "description": "添加日志" },
    { "name": "mute", "description": "删除日志" },
    { "name": "busts_in_silhouette", "description": "添加贡献者（们）" },
    { "name": "children_crossing", "description": "改进用户体验 / 可用性" },
    { "name": "building_construction", "description": "架构改动" },
    { "name": "iphone", "description": "响应性设计相关" },
    { "name": "clown_face", "description": "模拟相关" },
    { "name": "egg", "description": "添加一个彩蛋" },
    { "name": "see_no_evil", "description": "添加或者更新 .gitignore 文件" },
    { "name": "camera_flash", "description": "添加或者更新快照" },
    { "name": "alembic", "description": "研究新事物" },
    { "name": "hammer_and_wrench", "description": "构建系统更改" },
    { "name": "wrench", "description": "不影响代码的其余变动" },
    { "name": "mag", "description": "改进搜索引擎优化" },
    { "name": "wheel_of_dharma", "description": "Kubernetes 相关的工作" },
    { "name": "label", "description": "添加或者更新类型（Flow, TypeScript）" },
]

const emoji = ref('✨')

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
    let commit = `${type.value}(${scope.value ?? ''}): ${emoji.value} ${subject.value}`;
    commit += body.value && `\r\n\r\n${body.value}\r\n\r\n`
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
<style scoped>
.card-class {
    width: 100%;
    height: 100vh;
}
</style>
