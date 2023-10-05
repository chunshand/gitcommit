<template>
    <NDrawer v-model:show="isOpenWindow" height="70%" placement="bottom">
        <NDrawerContent>
            <NSpace vertical>
                <div>
                    <NText depth="1">自定义emoji： </NText>
                    <NButton type="success" size="small" @click="saveEmojisData">保存</NButton>
                </div>
                <NInput v-model:value="userEmojis" type="textarea" rows="13" :status="inputStatus" />
            </NSpace>
        </NDrawerContent>
    </NDrawer>
</template>
<script setup lang="ts">
import { useWindowHandle } from "@/composables/useWindowHandle"
import { type RawEmoji } from "@/data"
import { useEmojisStore } from "@/store"

let { isOpenWindow, switchWindow: switchCustom } = useWindowHandle()
isOpenWindow.value = true
defineExpose({ switchCustom })

const { error, success } = useMessage()
const { updateEmojis, customEmojis, saveCustomEmojis } = useEmojisStore()

let userEmojis = ref(JSON.stringify(customEmojis, undefined, 2))
let inputStatus = ref<"success" | "error">("success")

const customEorror = (str: string) => {
    error(str, { duration: 10000, closable: true })
    inputStatus.value = "error"
}
const customSuccess = (str: string) => {
    success(str)
    inputStatus.value = "success"
}

/**
 * 验证自定义emoji的每个对象是否存在特定key
 * @param emojisData
 * @returns boolean 每个对象都存在keys时才返回true
 */
const validEmojiKey = (emojisData: RawEmoji[]) => {
    const keys = ["name", "emoji"]
    return !emojisData.some((emojiItem) => {
        let flag = emojiItem.hasOwnProperty(keys[0]) ? false : keys[0]

        flag = flag === false ? (emojiItem.hasOwnProperty(keys[1]) ? false : keys[1]) : flag

        if (keys.includes(flag as string)) {
            // 不存在flag键，终止遍历并返回true
            customEorror(`[JSON Key Error]:对象中缺少${flag}键`)
            return true
        }
        return flag
    })
}

const saveEmojisData = () => {
    try {
        let emojisData: RawEmoji[] = JSON.parse(userEmojis.value)
        if (!validEmojiKey(emojisData)) return
        updateEmojis(emojisData)
        saveCustomEmojis(emojisData)
        customSuccess("保存成功")
    } catch (err) {
        customEorror(`[JSON Error]:${err}`)
    }
}
</script>
