

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
import { ref } from "vue";
// import {
//     NConfigProvider,
//     NMessageProvider,
//     NCard,
//     NButton,
//     darkTheme,
// } from "naive-ui";
import Home from "./components/home2.vue";
const theme = ref(null);
</script>

