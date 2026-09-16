<template>
  <component :is="as" :class="['bt-card', `bt-card--${variant}`, {'bt-card--interactive': interactive}]">
    <div v-if="title || eyebrow || subtitle || $slots.actions" class="bt-card-head">
      <div class="bt-card-heading">
        <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
        <h2 v-if="title">{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="bt-card-actions"><slot name="actions" /></div>
    </div>
    <slot />
  </component>
</template>
<script setup lang="ts">
withDefaults(defineProps<{as?: string; variant?: 'default'|'soft'|'compact'; interactive?: boolean; eyebrow?: string; title?: string; subtitle?: string}>(), {
  as: 'section', variant: 'default', interactive: false
});
</script>
