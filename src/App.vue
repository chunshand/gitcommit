<template>
    <NConfigProvider :theme="theme">
        <NDialogProvider>
            <NMessageProvider>
                <Home />
            </NMessageProvider>
        </NDialogProvider>
    </NConfigProvider>
</template>
<script setup lang="ts">
import { darkTheme, NDialogProvider } from "naive-ui";
import useDark from "./composables/useDark";
const isDark = useDark()
const theme = computed<typeof darkTheme | null>(() => {
    return isDark.value ? darkTheme : null
})

</script>
