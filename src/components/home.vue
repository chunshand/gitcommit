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
import { rawEmojis, typeData } from "../data";
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
const typeOptions = ref(typeData);
// 默认emoji
const defatltEmoji = ref("✨");
// 类型
const type = ref("feat");
watch(type, (val) => {
    // console.log(val)
    emoji.value = typeOptions.value.find((item) => item.value === val)?.emoji ?? defatltEmoji.value
})
// 范围
const scope = ref("");
// 简短描述
const subject = ref("");

// body
const body = ref("");

// 最后
const footer = ref("");

const emoji = ref(defatltEmoji.value)

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
