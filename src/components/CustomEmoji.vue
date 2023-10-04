<template>
    <NDrawer v-model:show="isOpenWindow" height="70%" placement="bottom">
        <NDrawerContent>
            <NSpace vertical>
                <div>
                    <NText depth="1">自定义emoji： </NText>
                    <NButton type="success" size="small" @click="saveEmojisData">保存</NButton>
                </div>
                <NInput v-model:value="userEmojis" type="textarea" rows="13" />
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

const { error } = useMessage()
const { updateEmojis, readCustomEmojis, saveCustomEmojis } = useEmojisStore()

let userEmojis = ref(JSON.stringify(readCustomEmojis(), undefined, 2))

const saveEmojisData = () => {
    try {
        let customEmojis: RawEmoji[] = JSON.parse(userEmojis.value)
        updateEmojis(customEmojis)
        saveCustomEmojis(customEmojis)
    } catch (err) {
        error(`[JSON Error]:${err}`, { duration: 0, closable: true })
    }
}
</script>

<style scoped></style>
