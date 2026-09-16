<template>
  <section class="pro-panel td-simple-page">
    <div class="pro-section-head td-page-head">
      <div><span class="eyebrow">Premium access</span><h1>Premium</h1><p>Your tipster account can also have Premium access. Premium is a subscription status, not a separate account role.</p></div>
      <span class="td-soft-badge">SAME ACCOUNT</span>
    </div>
    <div class="td-feature-grid">
      <article class="td-feature-card"><div class="td-feature-icon">01</div><div><h2>One account</h2><p>You do not need another account or another email address to subscribe.</p></div></article>
      <article class="td-feature-card"><div class="td-feature-icon">02</div><div><h2>Premium tips</h2><p>Access Premium predictions while keeping your tipster publishing tools and public record.</p></div></article>
      <article class="td-feature-card td-feature-card-accent"><div class="td-feature-icon">03</div><div><h2>Manage subscription</h2><p>View available plans, subscription status and renewal details from the Premium page.</p><RouterLink to="/subscription" class="btn">Manage Premium →</RouterLink></div></article>
    </div>
  </section>
</template>
<script setup lang="ts">import { RouterLink } from 'vue-router'</script>
