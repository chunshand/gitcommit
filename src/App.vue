

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
import { ref, onMounted } from "vue";
import { darkTheme } from "naive-ui";
import Home from "./components/home2.vue";
const theme = ref(null);
const loadFunc = () => {
    if (utools.isDarkColors()) {
        theme.value = darkTheme;
    } else {
        theme.value = null;
    }
};
let utools = null;
if (window["utools"]) {
    utools = window["utools"];
    utools.onPluginReady(() => {
        console.log("插件装配完成，已准备好");
        loadFunc();
    });
    utools.onPluginEnter(({ code, type, payload }) => {
        loadFunc();
    });
}
</script>
