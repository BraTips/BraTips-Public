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
<style scoped>
.td-profile-settings-page{padding:24px;overflow:hidden}
.td-page-head{margin-bottom:22px;align-items:center}
.td-page-head h1{margin:5px 0 6px;font-size:30px}
.td-page-head p{margin:0;color:#748196;font-size:13px;line-height:1.6}
.td-page-actions{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}
.td-page-actions>*{white-space:nowrap}
.td-public-profile-card{display:grid;grid-template-columns:76px minmax(0,1fr) auto;gap:18px;align-items:center;padding:24px;border-radius:16px;background:linear-gradient(135deg,#17243b,#243556 68%,#3b2037);color:#fff;box-shadow:0 16px 34px rgba(16,26,46,.14)}
.td-public-avatar{width:76px;height:76px;display:grid;place-items:center;border-radius:20px;background:linear-gradient(145deg,#ed275f,#a8194b);font-size:25px;font-weight:900;box-shadow:0 9px 22px rgba(237,39,95,.25)}
.td-public-copy{min-width:0}
.td-profile-label{display:block;color:#ff91ae;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.td-public-copy h2{margin:6px 0 7px;font-size:25px;letter-spacing:-.5px}
.td-public-copy p{margin:0;max-width:700px;color:#c4cedd;font-size:13px;line-height:1.65;overflow-wrap:anywhere}
.td-profile-tags{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}
.td-profile-tags span{padding:6px 9px;border:1px solid rgba(255,255,255,.14);border-radius:7px;background:rgba(255,255,255,.07);color:#dce3ee;font-size:10px;font-weight:800}
.td-profile-rate{min-width:112px;padding-left:22px;border-left:1px solid rgba(255,255,255,.14);text-align:right}
.td-profile-rate b,.td-profile-rate span{display:block}
.td-profile-rate b{font-size:31px;line-height:1.1}
.td-profile-rate span{margin-top:5px;color:#b8c4d5;font-size:10px;text-transform:uppercase;letter-spacing:.08em}
.td-profile-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:16px 0}
.td-profile-metrics>div{min-width:0;padding:16px;border:1px solid #dfe5ed;border-radius:13px;background:#fff;box-shadow:0 6px 20px rgba(16,26,46,.035)}
.td-profile-metrics span,.td-profile-metrics small{display:block;color:#8490a1;font-size:10px}
.td-profile-metrics span{text-transform:uppercase;letter-spacing:.06em;font-weight:800}
.td-profile-metrics b{display:block;margin:6px 0 3px;color:#182842;font-size:24px;line-height:1.1}
.td-profile-metrics small{font-size:11px}
.td-profile-editor-note{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 18px;border:1px solid #f1d4de;border-radius:13px;background:#fff8fa}
.td-profile-editor-note strong,.td-profile-editor-note span{display:block}
.td-profile-editor-note strong{color:#27344c;font-size:13px}
.td-profile-editor-note span{margin-top:4px;color:#7b8799;font-size:11px;line-height:1.5}
.td-profile-editor-note .ghost{flex:none;white-space:nowrap}
@media(max-width:900px){.td-profile-settings-page{padding:20px}.td-public-profile-card{grid-template-columns:64px minmax(0,1fr)}.td-public-avatar{width:64px;height:64px;border-radius:16px;font-size:21px}.td-profile-rate{grid-column:2;padding:14px 0 0;border-top:1px solid rgba(255,255,255,.14);border-left:0;text-align:left}.td-profile-rate b,.td-profile-rate span{display:inline-block}.td-profile-rate span{margin:0 0 0 7px}.td-profile-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:620px){.td-profile-settings-page{padding:16px}.td-page-head{display:block}.td-page-head h1{font-size:26px}.td-page-actions{justify-content:stretch;margin-top:15px}.td-page-actions>*{flex:1;text-align:center}.td-public-profile-card{display:block;padding:20px}.td-public-avatar{margin-bottom:16px}.td-profile-rate{margin-top:18px}.td-profile-metrics{gap:8px}.td-profile-metrics>div{padding:13px}.td-profile-metrics b{font-size:21px}.td-profile-editor-note{align-items:flex-start;flex-direction:column}.td-profile-editor-note .ghost{width:100%;text-align:center}}
</style>
