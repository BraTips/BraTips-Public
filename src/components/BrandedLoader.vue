<template>
  <span class="bt-inline-loader" role="status" :aria-label="label">
    <i aria-hidden="true"></i><span>{{ label }}</span>
  </span>
</template>
<script setup lang="ts">
withDefaults(defineProps<{label?: string}>(), {label: 'Working…'});
</script>
