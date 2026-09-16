<template>
  <section class="pro-panel td-profile-settings-page">
    <div class="pro-section-head td-page-head">
      <div>
        <span class="eyebrow">Public profile</span>
        <h1>{{ tipster?.username || 'Your profile' }}</h1>
        <p>Review the profile members see when they discover your football predictions.</p>
      </div>
      <div class="td-page-actions">
        <RouterLink to="/tipster-dashboard/settings" class="ghost">Edit profile</RouterLink>
        <RouterLink v-if="tipster?.username" :to="`/tipsters/${encodeURIComponent(tipster.username)}`" class="btn">Open public profile →</RouterLink>
      </div>
    </div>

    <div class="td-public-profile-card">
      <div class="td-public-avatar">{{ initials(tipster?.username || auth.user?.name || 'T') }}</div>
      <div class="td-public-copy">
        <span class="td-profile-label">Verified tipster</span>
        <h2>@{{ tipster?.username || auth.user?.name || 'tipster' }}</h2>
        <p>{{ tipster?.bio || 'Add a clear football bio so members know what your selections specialise in.' }}</p>
        <div class="td-profile-tags">
          <span>{{ tipster?.country || 'Global' }}</span>
          <span>{{ expertiseText }}</span>
          <span>Transparent record</span>
        </div>
      </div>
      <div class="td-profile-rate"><b>{{ winRate }}%</b><span>Win rate</span></div>
    </div>

    <div class="td-profile-metrics">
      <div><span>Total tips</span><b>{{ tipster?.totalTips || 0 }}</b><small>Published selections</small></div>
      <div><span>Wins</span><b>{{ tipster?.wins || 0 }}</b><small>Settled winners</small></div>
      <div><span>Current streak</span><b>{{ tipster?.currentStreak || 0 }}</b><small>Consecutive wins</small></div>
      <div><span>ROI</span><b>{{ formatPercent(tipster?.roi) }}</b><small>Tracked performance</small></div>
    </div>

    <div class="td-profile-editor-note">
      <div><strong>Keep your public profile current</strong><span>Update your bio, country, expertise and social links from Profile Settings.</span></div>
      <RouterLink to="/tipster-dashboard/settings" class="ghost">Update profile →</RouterLink>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../services/api'
import { useAuth } from '../stores/auth'
import { formatPercent } from '../utils/formatters'
const auth = useAuth()
const tipster = ref<any>(null)
const winRate = computed(() => { const w=Number(tipster.value?.wins||0), l=Number(tipster.value?.losses||0); return w+l ? Math.round(w/(w+l)*100) : 0 })
const expertiseText = computed(() => Array.isArray(tipster.value?.expertise) ? (tipster.value.expertise.join(' · ') || 'Football analysis') : (tipster.value?.expertise || 'Football analysis'))
function initials(v:string){return v.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'T'}
onMounted(async()=>{try{tipster.value=(await api.get('/me/tipster')).data.profile}catch{}})
</script>
