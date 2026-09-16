<template>
  <Transition name="bt-toast">
    <div v-if="toast" :class="['bt-toast', `bt-toast--${toast.type}`]" role="status" aria-live="polite">
      <span class="bt-toast-icon">{{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i' }}</span>
      <div><strong>{{ toast.title }}</strong><p>{{ toast.message }}</p></div>
      <button type="button" aria-label="Dismiss" @click="dismiss">×</button>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import {useToast} from '../composables/feedback';
const {toast,dismiss}=useToast();
</script>
