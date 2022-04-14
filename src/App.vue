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
import { onMounted, computed } from "vue";
import { darkTheme } from "naive-ui";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";
const isDark = ref(false);
const theme = computed<BuiltInGlobalTheme | null>(() => {
    return isDark.value ? darkTheme : null
})
let utools = null;
onMounted(() => {
    if (window["utools"]) {
        utools = window["utools"];
        utools.onPluginEnter(() => {
            isDark.value = utools.isDarkColors();
        });
    }
})
</script>
