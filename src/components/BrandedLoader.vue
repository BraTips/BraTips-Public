<template>
  <Transition name="bt-loader">
    <div v-if="visible" class="bt-loader-overlay" role="status" aria-live="polite" aria-label="Loading">
      <div class="bt-loader-card">
        <div class="bt-loader-mark"><span>♛</span></div>
        <div class="bt-loader-ring"></div>
        <strong>BraTipsters</strong>
        <small>Loading smarter insights…</small>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">defineProps<{visible:boolean}>()</script>
