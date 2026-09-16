<template>
  <div class="auth-page auth-register-page">
    <section class="auth-showcase auth-showcase-register">
      <div class="auth-showcase-inner">
        <RouterLink to="/" class="auth-brand"><img src="/logo-auth.svg" alt="BraTipsters" /></RouterLink>
        <div class="auth-showcase-copy">
          <span class="auth-kicker">YOUR BRATIPSTERS ACCOUNT</span>
          <h1>Follow smarter.<br /><span>Play informed.</span></h1>
          <p>Create one BraTipsters account to follow tipsters, save your favourite picks and keep your football activity in one place.</p>
        </div>
        <div class="auth-feature-list">
          <div><i>01</i><span><b>Discover tipsters</b> Compare records before you follow.</span></div>
          <div><i>02</i><span><b>Track every pick</b> Keep your prediction history organised.</span></div>
          <div><i>03</i><span><b>Unlock Premium</b> Subscribe to Premium tips whenever you are ready.</span></div>
        </div>
      </div>
    </section>

    <section class="auth-panel">
      <div class="auth-form-shell auth-register-shell">
        <div class="auth-mobile-brand"><img src="/logo-light.svg" alt="BraTipsters" /></div>
        <div class="auth-heading">
          <span class="auth-section-label">CREATE ACCOUNT</span>
          <h2>Create your member account</h2>
          <p>Create a free member account to follow tipsters, save picks and subscribe to Premium tips.</p>
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
            <div class="auth-input-wrap"><span>●</span><input id="signup-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Create a secure password" minlength="8" required /><button type="button" class="password-toggle" :aria-label="showPassword ? 'Hide password' : 'Show password'" :title="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">◉</button></div>
          </div>
          <button class="auth-submit" type="submit" :disabled="busy"><BrandedLoader v-if="busy" label="Creating account"/><template v-else><span>Create member account</span><b>→</b></template></button>
        </form>

        <div class="auth-divider"><span>ALREADY A MEMBER?</span></div>
        <RouterLink to="/login" class="auth-secondary">Log in to BraTipsters <b>→</b></RouterLink>
        <div class="auth-tipster-cta">
          <span>Want to publish your own picks?</span>
          <RouterLink to="/tipster-signup">Apply to become a tipster</RouterLink>
        </div>
        <div class="auth-member-note">
          <strong>Looking for Premium tips?</strong>
          <span>Create a member account first, then choose a Premium subscription. You do not need a tipster account to access Premium.</span>
        </div>
        <p class="auth-footnote">By creating an account, you agree to use BraTipsters responsibly and for informational purposes.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import BrandedLoader from '../components/BrandedLoader.vue'

const auth = useAuth()
const route = useRoute()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const busy = ref(false)

async function submit() {
  busy.value = true
  error.value = ''
  try {
    await auth.register(name.value, email.value, password.value)
    await auth.login(email.value, password.value)
    const redirect = String(route.query.redirect || '')
    const safeRedirect = redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : ''
    router.push(safeRedirect || '/dashboard')
  } catch (e: any) {
    error.value = e?.message || 'Unable to create your account. Please try again.'
  } finally {
    busy.value = false
  }
}
</script>
