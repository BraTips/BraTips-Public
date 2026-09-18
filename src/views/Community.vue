<template>
  <section class="community-page">
    <div class="wrap">
      <div class="community-hero">
        <span class="eyebrow">BRA TIPSTERS COMMUNITY</span>
        <h1>Join the BraTipsters community</h1>
        <p>Connect with football fans, follow BraTipsters updates and stay close to the latest prediction discussions across our social channels.</p>
      </div>

      <div class="community-grid">
        <a class="community-card" :href="socialLinks.discord" target="_blank" rel="noopener noreferrer">
          <div class="community-icon">D</div>
          <div><h2>Discord</h2><p>Join the BraTipsters community for football discussions and match-day conversations.</p><span>Join Discord →</span></div>
        </a>
        <a class="community-card" :href="socialLinks.facebook" target="_blank" rel="noopener noreferrer">
          <div class="community-icon">f</div>
          <div><h2>Facebook</h2><p>Follow the BraTipsters Facebook page for updates, tips and football content.</p><span>Follow Facebook →</span></div>
        </a>
        <a class="community-card" :href="socialLinks.telegram" target="_blank" rel="noopener noreferrer">
          <div class="community-icon">T</div>
          <div><h2>Telegram</h2><p>Join the BraTipsters Telegram community for quick updates and football conversations.</p><span>Join Telegram →</span></div>
        </a>
        <a class="community-card" :href="socialLinks.instagram" target="_blank" rel="noopener noreferrer">
          <div class="community-icon">◎</div>
          <div><h2>Instagram</h2><p>Follow BraTipsters for visual football content, updates and community highlights.</p><span>Follow Instagram →</span></div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {socialLinks} from '../config/socialLinks';
</script>
