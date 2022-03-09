import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: "./",
    server: {
        port: 8979
    },
    // css: {
    //     postcss: {
    //         plugins: [
    //             {
    //                 postcssPlugin: 'internal:charset-removal',
    //                 AtRule: {
    //                     charset: (atRule) => {
    //                         if (atRule.name === 'charset') {
    //                             atRule.remove();
    //                         }
    //                     }
    //                 }
    //             }
    //         ],
    //     },
    // }

})
