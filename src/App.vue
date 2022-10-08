<template>
    <NConfigProvider :theme="theme">
        <NMessageProvider>
            <Home />
        </NMessageProvider>
    </NConfigProvider>
</template>
<script setup lang="ts">
import { darkTheme } from "naive-ui";
import useDark from "./composables/useDark";
const isDark = useDark()
const theme = computed<typeof darkTheme | null>(() => {
    return isDark.value ? darkTheme : null
})

</script>
