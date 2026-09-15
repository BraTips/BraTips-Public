<template>
  <div class="pro-page football-page page-animate">
    <div class="wrap">
      <section class="football-hero page-hero-compact football-hero-redesign">
        <div>
          <span class="eyebrow">BraTipsters Football Centre</span>
          <h1>Matches & predictions</h1>
          <p>Every scheduled fixture gets a BraTipsters model pick, with odds, confidence and match intelligence.</p>
        </div>
        <RouterLink to="/predictions" class="hero-action">View all predictions →</RouterLink>
      </section>

      <div class="football-filter-bar">
        <div class="page-tabs-shell football-tabs">
          <button v-for="x in tabs" :key="x.v" :class="['page-tab', {active:tab===x.v}]" @click="tab=x.v"><span>{{x.icon}}</span>{{x.l}}</button>
        </div>
        <RouterLink to="/dropping-odds" class="football-market-link">Price drops →</RouterLink>
      </div>

      <div v-if="loading" class="prediction-card-grid">
        <div v-for="n in 6" :key="n" class="prediction-match-card skeleton-card"></div>
      </div>
      <div v-else-if="error" class="pro-panel error">{{error}} <button class="ghost" @click="load">Try again</button></div>
      <section v-else class="prediction-card-grid">
        <RouterLink v-for="m in matches" :key="m._id" :to="`/matches/${m._id}`" class="prediction-match-card">
          <div class="pmc-head">
            <div class="pmc-league"><span class="pmc-league-dot"></span>{{m.leagueId?.name || 'Football'}}</div>
            <span :class="['status-badge',m.status]">{{m.status==='live'?'● LIVE':m.status==='finished'?'FINAL':'UPCOMING'}}</span>
          </div>

          <div class="pmc-time">{{m.status==='scheduled' ? dateLabel(m.kickoff)+' · '+time(m.kickoff) : dateLabel(m.kickoff)}}</div>

          <div class="pmc-teams">
            <div><TeamLogo :src="m.homeTeamId?.logo" :name="m.homeTeamId?.name" size="md"/><b>{{m.homeTeamId?.name||'Home'}}</b><small>HOME</small></div>
            <div class="pmc-score">
              <strong v-if="m.status==='live'||m.status==='finished'">{{m.homeScore ?? 0}} - {{m.awayScore ?? 0}}</strong>
              <strong v-else>VS</strong>
              <span>{{m.status==='live'?'In play':m.status==='finished'?'Full time':time(m.kickoff)}}</span>
            </div>
            <div><TeamLogo :src="m.awayTeamId?.logo" :name="m.awayTeamId?.name" size="md"/><b>{{m.awayTeamId?.name||'Away'}}</b><small>AWAY</small></div>
          </div>

          <div class="pmc-prediction" :class="{premium:predictionFor(m._id)?.isPremium}">
            <div class="pmc-prediction-head"><span>BRATIPSTERS PREDICTION</span><b v-if="predictionFor(m._id)?.isPremium">★ PREMIUM</b></div>
            <template v-if="predictionFor(m._id) && !predictionFor(m._id).locked">
              <div class="pmc-pick"><strong>{{predictionFor(m._id).prediction}}</strong><span>{{price(predictionFor(m._id).odds)}} odds</span></div>
              <div class="pmc-metrics"><span><small>Confidence</small><b>{{predictionFor(m._id).confidence ? Number(predictionFor(m._id).confidence).toFixed(0)+'%' : '—'}}</b></span><span><small>Model score</small><b>{{predictionFor(m._id).modelScore ? Number(predictionFor(m._id).modelScore).toFixed(0)+'%' : '—'}}</b></span></div>
            </template>
            <template v-else-if="predictionFor(m._id)?.locked">
              <div class="pmc-locked"><span>🔒</span><div><strong>Premium prediction locked</strong><small>Subscribe to reveal the selection and odds.</small></div></div>
            </template>
            <template v-else>
              <div class="pmc-preparing"><span>◎</span><div><strong>Model prediction preparing</strong><small>Open the match centre to refresh intelligence.</small></div></div>
            </template>
          </div>

          <div class="pmc-footer"><span>{{oddsCount(m._id)}} market prices</span><b>Open match centre →</b></div>
        </RouterLink>
        <div v-if="!matches.length" class="pro-panel empty">No football fixtures are available for this view yet.</div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted,onUnmounted,ref,watch} from 'vue';import {RouterLink} from 'vue-router';import {api} from '../services/api';import TeamLogo from '../components/TeamLogo.vue';
const tabs=[{v:'today',l:'Today',icon:'◷'},{v:'live',l:'Live',icon:'●'},{v:'scheduled',l:'Upcoming',icon:'→'},{v:'finished',l:'Results',icon:'✓'}];
const tab=ref('today'),matches=ref<any[]>([]),predictions=ref<any[]>([]),loading=ref(true),error=ref('');let refreshTimer:number|undefined;
const time=(v:string)=>v?new Date(v).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'—';const dateLabel=(v:string)=>v?new Date(v).toLocaleDateString([],{weekday:'short',day:'2-digit',month:'short'}):'';
const price=(v:any)=>Number(v)>0?Number(v).toFixed(2):'—';
const predictionFor=(id:any)=>predictions.value.find((p:any)=>String(p.matchId?._id||p.matchId)===String(id));
const oddsCount=(id:any)=>{const m=matches.value.find(x=>String(x._id)===String(id));return m?.odds?.length||0};
function startPolling(){if(refreshTimer)window.clearInterval(refreshTimer);const ms=tab.value==='live'?15000:tab.value==='today'?60000:300000;refreshTimer=window.setInterval(load,ms)}
async function load(){loading.value=matches.value.length===0;error.value='';try{const d=tab.value==='today'?await api.get('/matches/today'):tab.value==='live'?await api.get('/matches/live'):await api.get(`/matches?status=${tab.value}&limit=100`);matches.value=d.data||[];const p=await api.get('/predictions?limit=100');predictions.value=(p.data||[]).filter((x:any)=>x.systemGenerated||!x.tipsterId);}catch(e:any){if(!matches.value.length)error.value=e?.message||'Unable to load football matches.'}finally{loading.value=false}}
watch(tab,async()=>{await load();startPolling()});onMounted(async()=>{await load();startPolling()});onUnmounted(()=>{if(refreshTimer)window.clearInterval(refreshTimer)});
</script>
