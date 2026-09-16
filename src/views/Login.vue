<template>
  <div class="auth-page">
    <section class="auth-showcase">
      <div class="auth-showcase-inner">
        <RouterLink to="/" class="auth-brand"><img src="/logo-auth.svg" alt="BraTipsters" /></RouterLink>
        <div class="auth-showcase-copy">
          <span class="auth-kicker">FOOTBALL INTELLIGENCE</span>
          <h1>Know the pick.<br /><span>Track the form.</span></h1>
          <p>Follow trusted tipsters, compare real performance and stay close to the football action that matters.</p>
        </div>
        <div class="auth-signal-grid">
          <div><strong>24/7</strong><span>Football coverage</span></div>
          <div><strong>LIVE</strong><span>Match intelligence</span></div>
          <div><strong>PRO</strong><span>Tipster insights</span></div>
        </div>
        <div class="auth-ticker"><span class="auth-live-dot"></span><b>BRATIPS SIGNAL</b><span>Track picks. Follow results. Stay informed.</span></div>
      </div>
    </section>

    <section class="auth-panel">
      <div class="auth-form-shell">
        <div class="auth-mobile-brand"><img src="/logo-light.svg" alt="BraTipsters" /></div>
        <div class="auth-heading">
          <span class="auth-section-label">MEMBER ACCESS</span>
          <h2>Welcome back</h2>
          <p>Sign in and BraTipsters will take you to the correct dashboard for your account.</p>
        </div>

        <form class="auth-form" @submit.prevent="submit">
          <div v-if="error" class="auth-alert error">{{ error }}</div>
          <div class="auth-field">
            <label for="login-email">Email address</label>
            <div class="auth-input-wrap"><span>✉</span><input id="login-email" v-model="email" type="email" autocomplete="email" placeholder="you@example.com" required /></div>
          </div>
          <div class="auth-field">
            <div class="auth-label-row"><label for="login-password">Password</label><span class="auth-hint">8+ characters</span></div>
            <div class="auth-input-wrap"><span>●</span><input id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Enter your password" required /><button type="button" class="password-toggle" :aria-label="showPassword ? 'Hide password' : 'Show password'" :title="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">◉</button></div>
          </div>
          <button class="auth-submit" type="submit" :disabled="busy"><span>{{ busy ? 'Signing in…' : 'Log in to BraTipsters' }}</span><b>→</b></button>
        </form>

        <div class="auth-divider"><span>NEW TO BRATIPS?</span></div>
        <RouterLink to="/signup" class="auth-secondary">Create a member account <b>→</b></RouterLink>
        <div class="auth-tipster-cta"><span>Want to publish your own picks?</span><RouterLink to="/tipster-signup">Apply to become a tipster</RouterLink></div>
        <div class="auth-member-note"><strong>Premium member?</strong><span>Use a regular member account to access Premium tips. Tipster status is only for approved publishers.</span></div>
        <p class="auth-footnote">By continuing, you agree to use BraTipsters responsibly and for informational purposes.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const auth = useAuth()
const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const busy = ref(false)

async function submit() {
  busy.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    const redirect=String(route.query.redirect||'')
    const safeRedirect=redirect.startsWith('/')&&!redirect.startsWith('//')?redirect:''
    if (safeRedirect) {
      router.push(safeRedirect)
    } else if (auth.user?.role === 'tipster') {
      router.push('/tipster-dashboard')
    } else if (auth.user?.role === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/dashboard')
    }
  } catch (e: any) {
    error.value = e?.message || 'Unable to sign in. Please check your details.'
  } finally {
    busy.value = false
  }
}
</script>
