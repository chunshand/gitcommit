<template>
    <NConfigProvider :theme="theme">
        <NMessageProvider>
            <Home />
        </NMessageProvider>
    </NConfigProvider>
    <!-- <NButton @click="theme = darkTheme">深色</NButton>
    <NButton @click="theme = null">浅色</NButton> -->
</template>
<script setup lang="ts">
import { darkTheme } from "naive-ui";
const isDark = useDark()
const theme = computed<typeof darkTheme | null>(() => {
    return isDark.value ? darkTheme : null
})

</script>
