<template>
  <Transition name="bt-modal">
    <div v-if="state" class="bt-modal-backdrop" @click.self="close(false)">
      <section class="bt-confirm-modal" role="dialog" aria-modal="true" :aria-labelledby="'bt-confirm-title'">
        <button class="bt-modal-x" type="button" aria-label="Close" @click="close(false)">×</button>
        <div :class="['bt-confirm-icon',{danger:state.danger,success:state.success}]">{{ state.danger ? '!' : state.success ? '✓' : '♛' }}</div>
        <span class="bt-confirm-kicker">BraTipsters</span>
        <h2 id="bt-confirm-title">{{ state.title }}</h2>
        <p>{{ state.message }}</p>
        <div class="bt-confirm-actions">
          <button v-if="!state.success" type="button" class="ghost" @click="close(false)">{{ state.cancelText }}</button>
          <button type="button" :class="['btn',{danger:state.danger}]" @click="close(true)">{{ state.confirmText }}</button>
        </div>
      </section>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import {useConfirm} from '../composables/feedback';
const {confirmState:state,close}=useConfirm();
</script>
