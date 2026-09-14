<template>
  <div class="auth-page">
    <section class="auth-showcase auth-showcase-register">
      <div class="auth-showcase-inner">
        <RouterLink to="/" class="auth-brand"><img src="/logo-auth.svg" alt="BraTipsters" /></RouterLink>
        <div class="auth-showcase-copy">
          <span class="auth-kicker">YOUR FOOTBALL DASHBOARD</span>
          <h1>Follow smarter.<br /><span>Play informed.</span></h1>
          <p>Create one BraTipsters account to follow tipsters, save your favourite picks and keep your football activity in one place.</p>
        </div>
        <div class="auth-feature-list">
          <div><i>01</i><span><b>Discover tipsters</b> Compare records before you follow.</span></div>
          <div><i>02</i><span><b>Track every pick</b> Keep your prediction history organised.</span></div>
          <div><i>03</i><span><b>Unlock premium</b> Access premium features when you are ready.</span></div>
        </div>
      </div>
    </section>

    <section class="auth-panel">
      <div class="auth-form-shell auth-register-shell">
        <div class="auth-mobile-brand"><img src="/logo-light.svg" alt="BraTipsters" /></div>
        <div class="auth-heading">
          <span class="auth-section-label">CREATE ACCOUNT</span>
          <h2>Join BraTipsters</h2>
          <p>It only takes a minute to create your football profile.</p>
        </div>

        <form class="auth-form" @submit.prevent="submit">
          <div v-if="error" class="auth-alert error">{{ error }}</div>
          <div class="auth-field">
            <label for="signup-name">Full name</label>
            <div class="auth-input-wrap"><span>◉</span><input id="signup-name" v-model="name" autocomplete="name" placeholder="Your full name" minlength="2" required /></div>
          </div>
          <div class="auth-field">
            <label for="signup-email">Email address</label>
            <div class="auth-input-wrap"><span>✉</span><input id="signup-email" v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required /></div>
          </div>
          <div class="auth-field">
            <label for="signup-password">Password</label>
            <div class="auth-input-wrap"><span>●</span><input id="signup-password" v-model="password" type="password" autocomplete="new-password" placeholder="Create a secure password" minlength="8" required /></div>
          </div>
          <button class="auth-submit" type="submit" :disabled="busy"><span>{{ busy ? 'Creating account…' : 'Create my account' }}</span><b>→</b></button>
        </form>

        <div class="auth-divider"><span>ALREADY A MEMBER?</span></div>
        <RouterLink to="/login" class="auth-secondary">Log in to BraTipsters <b>→</b></RouterLink>
        <div class="auth-tipster-cta"><span>Want to publish your own picks?</span><RouterLink to="/tipster-signup">Become a tipster</RouterLink></div>
        <p class="auth-footnote">By creating an account, you agree to use BraTipsters responsibly and for informational purposes.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const auth = useAuth()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

async function submit() {
  busy.value = true
  error.value = ''
  try {
    await auth.register(name.value, email.value, password.value)
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e?.message || 'Unable to create your account. Please try again.'
  } finally {
    busy.value = false
  }
}
</script>
