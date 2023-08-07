<template>
    <NDrawer v-model:show="openSetting" placement="right" :auto-focus="false">
        <NDrawerContent>
            <NSpace vertical>
                <NText depth="1"> 设置： </NText>
                <NCheckbox
                    v-model:checked="settingsStore.settings.value.isEmoji"
                    :disabled="settingsStore.settings.value.isEmojiMode"
                    title="是否开启Emoji选择框"
                    :on-update:checked="settingsStore.handleISEmojiChange"
                >
                    开启emoji
                </NCheckbox>
                <NCheckbox
                    v-model:checked="settingsStore.settings.value.isCodeEmoji"
                    title="是否使用emoji代码(✨ -> :sparkles:)"
                    :disabled="!settingsStore.settings.value.isEmoji"
                    :on-update:checked="settingsStore.handleISCodeEmojiChange"
                >
                    使用代码emoji
                </NCheckbox>
                <NCheckbox
                    v-model:checked="settingsStore.settings.value.autoPaste"
                    title="复制后自动粘贴"
                    :on-update:checked="settingsStore.handleAutoPaste"
                >
                    自动粘贴
                </NCheckbox>
            </NSpace>
        </NDrawerContent>
    </NDrawer>
</template>

<script setup lang="ts">
import { settingsStore } from "@/store"

let openSetting = ref(false)
const switchSetting = () => {
    openSetting.value = !openSetting.value
}
defineExpose({ switchSetting })
</script>

<style scoped></style>
