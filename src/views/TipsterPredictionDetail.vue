<template>
  <div class="pro-page page-animate premium-detail-page">
    <div class="wrap">
      <div v-if="loading" class="premium-skeleton" aria-label="Loading premium prediction">
        <div class="sk sk-eyebrow"></div><div class="sk sk-title"></div><div class="sk sk-line"></div>
        <div class="sk sk-card"></div>
      </div>

      <EmptyState v-else-if="!prediction" title="Prediction not found" message="This tipster prediction may have been removed or is no longer available." icon="⌕">
        <template #action><RouterLink to="/" class="btn">Back to home</RouterLink></template>
      </EmptyState>

      <template v-else>
        <RouterLink to="/" class="back-soft">← Back to weekly predictions</RouterLink>

        <section v-if="prediction.locked" class="premium-access-shell">
          <div class="premium-access-hero">
            <div class="premium-lock-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M7 10V7.5A5 5 0 0 1 12 2.5a5 5 0 0 1 5 5V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="15.5" r="1.2" fill="currentColor"/><path d="M12 16.7v1.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            </div>
            <span class="premium-kicker">BraTipsters Premium</span>
            <h1>Unlock this tipster's premium prediction</h1>
            <p>Get the full selection, quoted odds and analyst reasoning through your Premium membership.</p>

            <div class="premium-fixture-card">
              <div class="fixture-date">PREMIUM WEEKLY PICK</div>
              <div class="fixture-teams">
                <div><TeamLogo :src="home.logo" :name="home.name" size="lg"/><strong>{{ home.name || 'Home team' }}</strong></div>
                <span>VS</span>
                <div><TeamLogo :src="away.logo" :name="away.name" size="lg"/><strong>{{ away.name || 'Away team' }}</strong></div>
              </div>
              <div class="fixture-meta">{{ fixture }}</div>
              <div class="locked-selection"><span>Premium selection</span><b>••••••••</b><em>LOCKED</em></div>
            </div>

            <div class="premium-benefits">
              <div><span>✓</span><div><b>Full selection</b><small>Reveal the exact market and outcome.</small></div></div>
              <div><span>✓</span><div><b>Quoted odds</b><small>See the odds attached to the published pick.</small></div></div>
              <div><span>✓</span><div><b>Analyst reasoning</b><small>Read the tipster's supporting analysis.</small></div></div>
            </div>

            <RouterLink to="/subscription" class="btn premium-cta">View Premium plans <span>→</span></RouterLink>
            <p class="premium-note">Already a member? <RouterLink to="/login">Sign in</RouterLink> to continue.</p>
          </div>
        </section>

        <template v-else>
          <section class="tipster-prediction-hero"><div><span class="eyebrow">Tipster prediction</span><h1>{{ prediction.prediction }}</h1><p>{{ fixture }}</p></div><div class="tipster-prediction-result"><span>{{ prediction.status || 'published' }}</span><strong>{{ formatOdds(prediction.odds) }}</strong><small>Quoted odds</small></div></section>
          <div class="tipster-prediction-layout"><main>
            <section class="pro-panel tipster-prediction-card"><div class="tipster-prediction-match"><div><TeamLogo :src="home.logo" :name="home.name" size="lg"/><b>{{ home.name || 'Home' }}</b></div><span>VS</span><div><TeamLogo :src="away.logo" :name="away.name" size="lg"/><b>{{ away.name || 'Away' }}</b></div></div><div class="tipster-prediction-kpis"><div><span>Market</span><b>{{ prediction.prediction }}</b></div><div><span>Odds</span><b>{{ formatOdds(prediction.odds) }}</b></div><div><span>Confidence</span><b>{{ prediction.confidence || '—' }}{{ prediction.confidence ? '%' : '' }}</b></div></div></section>
            <section class="pro-panel"><div class="pro-section-head"><div><span class="eyebrow">Analyst reasoning</span><h2>Why this pick?</h2></div></div><p class="tipster-analysis">{{ prediction.analysis || 'This tipster did not publish additional reasoning for this selection.' }}</p></section>
          </main><aside><section class="pro-panel"><span class="eyebrow">Published by</span><h2>@{{ prediction.tipsterId?.name || 'Tipster' }}</h2><p class="muted">Review the tipster's public record before following this selection.</p><RouterLink to="/tipsters" class="btn btn-wide">Explore tipsters</RouterLink></section></aside></div>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { api } from '../services/api'
import { formatOdds } from '../utils/formatters'
import EmptyState from '../components/EmptyState.vue'
import TeamLogo from '../components/TeamLogo.vue'
const route=useRoute(),prediction=ref<any>(null),loading=ref(true)
const home=computed(()=>prediction.value?.matchId?.homeTeamId||{}),away=computed(()=>prediction.value?.matchId?.awayTeamId||{})
const fixture=computed(()=>prediction.value?.fixture||`${home.value.name||'Home'} vs ${away.value.name||'Away'}`)
onMounted(async()=>{try{prediction.value=(await api.get(`/predictions/${route.params.id}`)).data}catch{}finally{loading.value=false}})
</script>
<style scoped>
.premium-detail-page{padding:28px 0 60px}.back-soft{display:inline-block;margin-bottom:16px;color:#66758a;font-size:12px;font-weight:800}.premium-access-shell{max-width:900px;margin:0 auto}.premium-access-hero{position:relative;overflow:hidden;text-align:center;padding:42px 34px 32px;border:1px solid #eadce2;border-radius:24px;background:linear-gradient(145deg,#fff 0%,#fff8fa 55%,#f7f2f6 100%);box-shadow:0 22px 55px rgba(25,32,49,.09)}.premium-access-hero:before{content:"";position:absolute;width:360px;height:360px;border-radius:50%;background:rgba(233,72,118,.07);top:-210px;right:-120px}.premium-lock-mark{position:relative;z-index:1;width:62px;height:62px;margin:0 auto 14px;display:grid;place-items:center;border-radius:18px;background:#ffe4ec;color:#d93669;box-shadow:inset 0 0 0 1px #f7c5d5}.premium-lock-mark svg{width:31px;height:31px}.premium-kicker{position:relative;z-index:1;color:#d93669;font-size:11px;font-weight:950;letter-spacing:.13em;text-transform:uppercase}.premium-access-hero h1{position:relative;z-index:1;max-width:650px;margin:8px auto 9px;color:#17243d;font-size:34px;line-height:1.15}.premium-access-hero>p{position:relative;z-index:1;max-width:610px;margin:0 auto;color:#6d788b;line-height:1.7}.premium-fixture-card{position:relative;z-index:1;max-width:700px;margin:27px auto 20px;padding:20px;border:1px solid #e6e9ef;border-radius:18px;background:#fff;text-align:left;box-shadow:0 10px 30px rgba(20,31,51,.05)}.fixture-date{font-size:10px;font-weight:950;color:#d93669;letter-spacing:.12em}.fixture-teams{display:grid;grid-template-columns:1fr 42px 1fr;align-items:center;text-align:center;margin:16px 0}.fixture-teams>div{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0}.fixture-teams strong{color:#1b2943;font-size:14px;max-width:100%;overflow:hidden;text-overflow:ellipsis}.fixture-teams>span{font-size:10px;font-weight:900;color:#98a2b1}.fixture-meta{text-align:center;color:#7b8697;font-size:11px;padding-bottom:15px;border-bottom:1px solid #edf0f4}.locked-selection{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:12px;padding-top:14px}.locked-selection span{font-size:11px;color:#7b8697}.locked-selection b{font-size:15px;letter-spacing:3px;color:#aeb6c2}.locked-selection em{font-style:normal;font-size:9px;font-weight:950;color:#d93669;background:#fff0f4;padding:6px 8px;border-radius:7px}.premium-benefits{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:700px;margin:0 auto 22px;text-align:left}.premium-benefits>div{display:flex;gap:9px;padding:13px;border:1px solid #e9ebf0;border-radius:12px;background:rgba(255,255,255,.8)}.premium-benefits span{display:grid;place-items:center;width:22px;height:22px;flex:0 0 22px;border-radius:50%;background:#e8f8f0;color:#188a58;font-weight:900}.premium-benefits b,.premium-benefits small{display:block}.premium-benefits b{font-size:11px;color:#24334e}.premium-benefits small{margin-top:3px;color:#8791a0;font-size:10px;line-height:1.4}.premium-cta{position:relative;z-index:1;display:inline-flex!important;align-items:center;justify-content:center;gap:18px;min-width:220px}.premium-cta span{font-size:17px}.premium-note{position:relative!important;z-index:1;margin-top:13px!important;font-size:11px!important;color:#8993a1!important}.premium-note a{color:#d93669;font-weight:850}.premium-skeleton{max-width:900px;margin:30px auto;padding:38px;border:1px solid #e8ebf0;border-radius:24px;background:#fff}.sk{border-radius:9px;background:linear-gradient(90deg,#eef1f5 25%,#f7f8fa 50%,#eef1f5 75%);background-size:200% 100%;animation:shimmer 1.3s infinite}.sk-eyebrow{width:130px;height:12px;margin:auto}.sk-title{width:65%;height:38px;margin:15px auto}.sk-line{width:55%;height:14px;margin:0 auto 28px}.sk-card{height:230px;width:85%;margin:auto;border-radius:18px}@keyframes shimmer{to{background-position:-200% 0}}.tipster-prediction-hero{display:flex;justify-content:space-between;gap:24px;align-items:center;padding:28px;border-radius:18px;background:linear-gradient(135deg,#17243b,#26385b 65%,#3b2037);color:#fff}.tipster-prediction-hero h1{margin:8px 0;font-size:34px}.tipster-prediction-hero p{margin:0;color:#c5cfdd}.tipster-prediction-result{text-align:right}.tipster-prediction-result span,.tipster-prediction-result strong,.tipster-prediction-result small{display:block}.tipster-prediction-result span{color:#ff91ae;font-size:10px;font-weight:900;text-transform:uppercase}.tipster-prediction-result strong{margin:5px 0;font-size:30px}.tipster-prediction-result small{color:#b9c5d7;font-size:10px}.tipster-prediction-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px;margin-top:16px}.tipster-prediction-layout main,.tipster-prediction-layout aside{display:grid;gap:16px;align-content:start}.tipster-prediction-match{display:grid;grid-template-columns:1fr 45px 1fr;align-items:center;text-align:center}.tipster-prediction-match>div{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0}.tipster-prediction-match b{max-width:100%;overflow:hidden;text-overflow:ellipsis}.tipster-prediction-match>span{color:#8793a4;font-size:11px;font-weight:900}.tipster-prediction-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-top:16px;border-top:1px solid #edf0f3}.tipster-prediction-kpis span,.tipster-prediction-kpis b{display:block}.tipster-prediction-kpis span{color:#8993a4;font-size:10px}.tipster-prediction-kpis b{margin-top:4px;color:#182842;font-size:13px;overflow:hidden;text-overflow:ellipsis}.tipster-analysis{margin:0;color:#5e6c80;line-height:1.9;font-size:14px}@media(max-width:760px){.premium-detail-page{padding:18px 0 40px}.premium-access-hero{padding:30px 16px 24px;border-radius:18px}.premium-access-hero h1{font-size:27px}.premium-fixture-card{padding:16px}.premium-benefits{grid-template-columns:1fr}.locked-selection{grid-template-columns:1fr auto}.locked-selection em{grid-column:2;grid-row:1}.premium-skeleton{padding:24px 16px}.sk-card{width:100%;height:210px}.tipster-prediction-hero{display:block;padding:22px}.tipster-prediction-hero h1{font-size:27px}.tipster-prediction-result{margin-top:18px;text-align:left}.tipster-prediction-layout{grid-template-columns:1fr}.tipster-prediction-kpis{grid-template-columns:1fr 1fr}.tipster-prediction-kpis div:last-child{grid-column:1/-1}}
</style>
