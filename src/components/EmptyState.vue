<template>
  <div :class="['bt-empty', compact ? 'bt-empty--compact' : '']" role="status">
    <div class="bt-empty-icon" aria-hidden="true">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <div v-if="$slots.action" class="bt-empty-action"><slot name="action" /></div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{title?: string; message: string; icon?: string; compact?: boolean}>(), {
  title: 'Nothing here yet', icon: '⌁', compact: false
});
</script>
