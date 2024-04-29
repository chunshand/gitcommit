<template>
    <NDrawer v-model:show="showWindow" height="70%" placement="bottom">
        <NDrawerContent>
            <NSpace vertical>
                <NSpace>
                    <NText depth="1"> 自定义msg：</NText>
                    <NButton size="small" type="success" @click="saveEmojisData">保存</NButton>
                </NSpace>
                <NInput
                    v-model:value="userMsg"
                    :status="inputStatus"
                    placeholder="详细使用说明请在‘帮助’中查看"
                    rows="13"
                    type="textarea"
                />
            </NSpace>
        </NDrawerContent>
    </NDrawer>
</template>
<script lang="ts" setup>
import { CommitMsg } from "@/data"
import { CUSTOM_COMMIT_MSG_KEY, useCommitMsgStore } from "@/store/commitMsgStore"

const showWindow = ref(false)
defineExpose(showWindow)
const { error, success } = useMessage()
const msgStore = useCommitMsgStore()

const userMsg = ref<string>(utools.dbStorage.getItem(CUSTOM_COMMIT_MSG_KEY))
let inputStatus = ref<"success" | "error">("success")

const customError = (str: string) => {
    error(str, { duration: 10000, closable: true })
    inputStatus.value = "error"
}
const customSuccess = (str: string) => {
    success(str)
    inputStatus.value = "success"
}
watch(showWindow, (nVal) => {
    if (nVal) {
        inputStatus.value = "success"
    }
})
/**
 * 验证自定义msg的每个对象是否存在特定key
 * @param msgData
 * @returns boolean 每个对象都存在keys时才返回true
 */
const validMsgKey = (msgData: CommitMsg[]) => {
    const keys = ["value", "label"]
    return !msgData.some((emojiItem) => {
        for (const key of keys) {
            const flag = emojiItem.hasOwnProperty(key) ? false : key
            // flag = flag === false ? (emojiItem.hasOwnProperty(keys[1]) ? false : keys[1]) : flag

            if (keys.includes(flag as string)) {
                // 不存在flag键，终止遍历并返回true
                customError(`[JSON Key Error]:对象中缺少${flag}键`)
                return true
            }
        }
        return false
    })
}

const saveEmojisData = () => {
    try {
        if (userMsg.value != null && userMsg.value.length !== 0) {
            const msgData: CommitMsg[] = JSON.parse(userMsg.value)
            if (!validMsgKey(msgData)) {
                return
            }
            msgStore.update(userMsg.value)
        } else {
            msgStore.update("[]")
        }
        customSuccess("保存成功")
    } catch (err) {
        customError(`[JSON Error]:${err}`)
    }
}
</script>
