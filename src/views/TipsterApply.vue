<template>
  <div class="tipster-apply-page">
    <section class="tipster-apply-hero">
      <div class="wrap tipster-apply-hero-grid">
        <div>
          <RouterLink to="/" class="tipster-auth-brand"><img src="/logo-auth.svg" alt="BraTipsters" /></RouterLink>
          <span class="auth-kicker">BRATIPS CREATOR PROGRAM</span>
          <h1>Turn your football knowledge into a <span>track record.</span></h1>
          <p>Apply to become a BraTipsters tipster, publish your predictions and build a profile that followers can judge on performance.</p>
        </div>
        <div class="tipster-hero-status"><span class="auth-live-dot"></span><b>APPLICATIONS OPEN</b><small>Reviewed by the BraTipsters team</small></div>
      </div>
    </section>

    <section class="tipster-apply-body">
      <div class="wrap tipster-apply-grid">
        <aside class="tipster-apply-side">
          <div class="tipster-side-card">
            <span class="auth-section-label">WHY TIPSTERS JOIN</span>
            <h2>Build trust before the pick.</h2>
            <div class="tipster-benefit"><i>01</i><div><b>Public performance</b><span>Your published record becomes part of your profile.</span></div></div>
            <div class="tipster-benefit"><i>02</i><div><b>Grow a following</b><span>Give football fans a clear reason to follow your work.</span></div></div>
            <div class="tipster-benefit"><i>03</i><div><b>Premium-ready</b><span>Build credibility for future premium opportunities.</span></div></div>
          </div>
          <div class="tipster-side-note"><b>What makes a strong application?</b><span>Clear analysis, a defined football niche and predictions you can explain.</span></div>
        </aside>

        <form class="tipster-apply-card" @submit.prevent="submit">
          <div class="tipster-form-head">
            <div><span class="auth-section-label">STEP 1 · PROFILE</span><h2>Tell us about you</h2><p>Use the details you want followers to see on your public tipster profile.</p></div>
            <span class="tipster-form-badge">TIPSTER</span>
          </div>

          <div v-if="success" class="auth-alert success">{{ success }} <RouterLink to="/login">Log in →</RouterLink></div>
          <div v-if="error" class="auth-alert error">{{ error }}</div>

          <template v-if="!success">
            <div class="tipster-form-section">
              <div class="tipster-form-section-title"><span>01</span><b>Account</b></div>
              <div class="tipster-fields two">
                <div class="auth-field"><label for="tip-name">Name</label><div class="auth-input-wrap"><span>◉</span><input id="tip-name" v-model="f.name" autocomplete="name" placeholder="Your display name" required /></div></div>
                <div class="auth-field"><label for="tip-username">Username</label><div class="auth-input-wrap"><span>@</span><input id="tip-username" v-model="f.username" placeholder="yourusername" minlength="3" required /></div></div>
              </div>
              <div class="tipster-fields two">
                <div class="auth-field"><label for="tip-email">Email address</label><div class="auth-input-wrap"><span>✉</span><input id="tip-email" v-model="f.email" type="email" autocomplete="email" placeholder="you@example.com" required /></div></div>
                <div class="auth-field"><label for="tip-password">Password</label><div class="auth-input-wrap"><span>●</span><input id="tip-password" v-model="f.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="8+ characters" minlength="8" required /><button type="button" class="password-toggle" :aria-label="showPassword ? 'Hide password' : 'Show password'" :title="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">◉</button></div></div>
              </div>
              <div class="tipster-fields two">
                <div class="auth-field"><label for="tip-country">Country</label><div class="auth-input-wrap"><span>⌖</span><input id="tip-country" v-model="f.country" placeholder="Country" /></div></div>
                <div class="auth-field"><label for="tip-expertise">Expertise</label><div class="auth-input-wrap"><span>★</span><input id="tip-expertise" v-model="expertise" placeholder="Premier League, goals, corners" /></div></div>
              </div>
            </div>

            <div class="tipster-form-section">
              <div class="tipster-form-section-title"><span>02</span><b>Public profile</b></div>
              <div class="auth-field"><label for="tip-bio">Bio</label><textarea id="tip-bio" v-model="f.bio" minlength="20" placeholder="Tell followers what you specialise in, how you analyse matches and what they can expect from your picks…" required></textarea></div>
            </div>

            <div class="tipster-form-section">
              <div class="tipster-form-section-title"><span>03</span><b>Sample prediction</b></div>
              <p class="tipster-section-help">Show the review team how you turn your football analysis into a clear prediction.</p>
              <div class="auth-field"><label for="sample-fixture">Fixture</label><input id="sample-fixture" class="plain-input" v-model="f.samplePrediction.fixture" placeholder="Arsenal vs Chelsea" required /></div>
              <div class="tipster-fields two">
                <div class="auth-field"><label for="sample-prediction">Prediction</label><input id="sample-prediction" class="plain-input" v-model="f.samplePrediction.prediction" placeholder="Arsenal to win" required /></div>
                <div class="auth-field"><label for="sample-odds">Odds</label><input id="sample-odds" class="plain-input" v-model.number="f.samplePrediction.odds" type="number" step="0.01" min="1" placeholder="1.50" required /></div>
              </div>
              <div class="auth-field"><label for="sample-analysis">Analysis</label><textarea id="sample-analysis" v-model="f.samplePrediction.analysis" minlength="20" placeholder="Explain the form, matchup, trends or other factors behind your pick…" required></textarea></div>
            </div>

            <button class="auth-submit tipster-submit" type="submit" :disabled="busy"><span>{{ busy ? 'Submitting application…' : 'Submit for review' }}</span><b>→</b></button>
            <p class="tipster-form-foot">Applications are reviewed before a tipster profile can publish picks.</p>
          </template>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../stores/auth'

const auth = useAuth()
const error = ref('')
const success = ref('')
const expertise = ref('')
const busy = ref(false)
const showPassword = ref(false)
const f = reactive<any>({ name: '', username: '', email: '', password: '', country: '', bio: '', samplePrediction: { fixture: '', prediction: '', odds: 1.5, analysis: '' } })

async function submit() {
  error.value = ''
  busy.value = true
  try {
    const d = await auth.tipsterApply({ ...f, expertise: expertise.value.split(',').map(x => x.trim()).filter(Boolean), samplePrediction: { ...f.samplePrediction, confidence: 80 } })
    success.value = d.message
  } catch (e: any) {
    error.value = e?.message || 'Unable to submit your application. Please check your details.'
  } finally {
    busy.value = false
  }
}
</script>
