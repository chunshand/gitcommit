import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: ["vue", "@vueuse/core"],
            dts: true,
        }),
        Components({
            resolvers: [NaiveUiResolver()],
            dts: true
        }),
    ],

    base: "./",
    server: {
        port: 8979,
    },
});