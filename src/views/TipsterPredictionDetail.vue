<template>
  <div class="pro-page page-animate"><div class="wrap tipster-prediction-detail">
    <div v-if="loading" class="pro-panel detail-loading">Loading tipster prediction…</div>
    <EmptyState v-else-if="!prediction" title="Prediction not found" message="This tipster prediction may have been removed or is no longer available." icon="⌕"><template #action><RouterLink to="/" class="btn">Back to home</RouterLink></template></EmptyState>
    <template v-else>
      <RouterLink to="/" class="back-soft">← Back to home</RouterLink>
      <section v-if="prediction.locked" class="pro-panel tipster-prediction-locked"><span class="eyebrow">Tipster prediction</span><h1>Premium selection locked</h1><p>{{ fixture }}</p><p class="muted">Subscribe to Premium to reveal this tipster's selection and quoted odds.</p><RouterLink to="/subscription" class="btn">Unlock Premium</RouterLink></section>
      <template v-else>
        <section class="tipster-prediction-hero"><div><span class="eyebrow">Tipster prediction</span><h1>{{ prediction.prediction }}</h1><p>{{ fixture }}</p></div><div class="tipster-prediction-result"><span>{{ prediction.status || 'published' }}</span><strong>{{ formatOdds(prediction.odds) }}</strong><small>Quoted odds</small></div></section>
        <div class="tipster-prediction-layout"><main>
          <section class="pro-panel tipster-prediction-card"><div class="tipster-prediction-match"><div><TeamLogo :src="home.logo" :name="home.name" size="lg"/><b>{{ home.name || 'Home' }}</b></div><span>VS</span><div><TeamLogo :src="away.logo" :name="away.name" size="lg"/><b>{{ away.name || 'Away' }}</b></div></div><div class="tipster-prediction-kpis"><div><span>Market</span><b>{{ prediction.prediction }}</b></div><div><span>Odds</span><b>{{ formatOdds(prediction.odds) }}</b></div><div><span>Confidence</span><b>{{ prediction.confidence || '—' }}{{ prediction.confidence ? '%' : '' }}</b></div></div></section>
          <section class="pro-panel"><div class="pro-section-head"><div><span class="eyebrow">Analyst reasoning</span><h2>Why this pick?</h2></div></div><p class="tipster-analysis">{{ prediction.analysis || 'This tipster did not publish additional reasoning for this selection.' }}</p></section>
        </main><aside><section class="pro-panel"><span class="eyebrow">Published by</span><h2>@{{ prediction.tipsterId?.name || 'Tipster' }}</h2><p class="muted">Review the tipster's public record before following this selection.</p><RouterLink to="/tipsters" class="btn btn-wide">Explore tipsters</RouterLink></section><section v-if="prediction.matchId?._id" class="pro-panel"><span class="eyebrow">More match context</span><h3>Open Match Centre</h3><p class="muted">View live score, events, cards, goals, odds and other match research.</p><RouterLink :to="`/matches/${prediction.matchId._id}`" class="ghost btn-wide">Match Centre →</RouterLink></section></aside></div>
      </template>
    </template>
  </div></div>
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
.tipster-prediction-detail{padding-top:28px}.back-soft{display:inline-block;margin-bottom:16px;color:#66758a;font-size:12px;font-weight:800}.tipster-prediction-hero{display:flex;justify-content:space-between;gap:24px;align-items:center;padding:28px;border-radius:18px;background:linear-gradient(135deg,#17243b,#26385b 65%,#3b2037);color:#fff;box-shadow:0 16px 38px rgba(16,26,46,.14)}.tipster-prediction-hero h1{margin:8px 0;font-size:34px}.tipster-prediction-hero p{margin:0;color:#c5cfdd}.tipster-prediction-result{text-align:right}.tipster-prediction-result span,.tipster-prediction-result strong,.tipster-prediction-result small{display:block}.tipster-prediction-result span{color:#ff91ae;font-size:10px;font-weight:900;text-transform:uppercase}.tipster-prediction-result strong{margin:5px 0;font-size:30px}.tipster-prediction-result small{color:#b9c5d7;font-size:10px}.tipster-prediction-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px;margin-top:16px}.tipster-prediction-layout main,.tipster-prediction-layout aside{display:grid;gap:16px;align-content:start}.tipster-prediction-match{display:grid;gap:20px}.tipster-prediction-match{display:grid;grid-template-columns:1fr 45px 1fr;align-items:center;text-align:center}.tipster-prediction-match>div{display:flex;flex-direction:column;align-items:center;gap:8px;min-width:0}.tipster-prediction-match b{max-width:100%;overflow:hidden;text-overflow:ellipsis}.tipster-prediction-match>span{color:#8793a4;font-size:11px;font-weight:900}.tipster-prediction-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-top:16px;border-top:1px solid #edf0f3}.tipster-prediction-kpis div{min-width:0}.tipster-prediction-kpis span,.tipster-prediction-kpis b{display:block}.tipster-prediction-kpis span{color:#8993a4;font-size:10px}.tipster-prediction-kpis b{margin-top:4px;color:#182842;font-size:13px;overflow:hidden;text-overflow:ellipsis}.tipster-analysis{margin:0;color:#5e6c80;line-height:1.9;font-size:14px}.tipster-prediction-locked{margin-top:20px;padding:35px}.tipster-prediction-locked h1{margin:8px 0}.tipster-prediction-locked p{color:#6f7d91}.tipster-prediction-locked .btn{display:inline-block;margin-top:10px}@media(max-width:760px){.tipster-prediction-detail{padding-top:18px}.tipster-prediction-hero{display:block;padding:22px}.tipster-prediction-hero h1{font-size:27px}.tipster-prediction-result{margin-top:18px;text-align:left}.tipster-prediction-layout{grid-template-columns:1fr}.tipster-prediction-kpis{grid-template-columns:1fr 1fr}.tipster-prediction-kpis div:last-child{grid-column:1/-1}}
</style>
