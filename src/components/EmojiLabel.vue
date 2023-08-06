<template>
    <div class="emoji-label">
        <p>
            <span>{{ label.emoji }}</span
            >&ensp;<span>{{ label.emojiCode }}</span>
        </p>
        <p>{{ label.description }}</p>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    label: { emoji: string; emojiCode: string; description: string }
}>()
</script>

<style scoped>
p,
span {
    margin: 0;
}
.emoji-label {
    font-size: 13px;
    margin: 5px 0;
}
</style>
