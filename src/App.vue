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
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";
const theme = computed<BuiltInGlobalTheme | null>(() => {
    return window?.utools?.isDarkColors() ? darkTheme : null
})

</script>
