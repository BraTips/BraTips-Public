<template>
  <div class="pro-page football-page page-animate">
    <div class="wrap">
      <section class="football-hero page-hero-compact">
        <div><span class="eyebrow">Football centre</span><h1>Matches, scores & markets</h1><p>Follow live football, upcoming fixtures and completed results with prices and match intelligence in one board.</p></div>
        <RouterLink to="/dropping-odds" class="hero-action">↘ Dropping Odds</RouterLink>
      </section>

      <section class="live-strip">
        <div class="live-strip-title"><span class="pulse-dot"></span><div><b>Football market feed</b><small>Scores and fixture status update automatically</small></div></div>
        <div class="live-strip-stat"><b>{{ matches.length }}</b><span>{{ tab === 'live' ? 'live matches' : tab === 'finished' ? 'results' : tab === 'scheduled' ? 'upcoming' : 'today' }}</span></div>
        <div class="live-strip-stat"><b>24/7</b><span>monitoring</span></div>
      </section>

      <div class="page-tabs-shell">
        <button v-for="x in tabs" :key="x.v" :class="['page-tab', {active:tab===x.v}]" @click="tab=x.v"><span>{{x.icon}}</span>{{x.l}}</button>
        <RouterLink to="/dropping-odds" class="page-tab-special">View price drops →</RouterLink>
      </div>

      <div v-if="loading" class="match-intel-list"><div v-for="n in 7" :key="n" class="match-skeleton"></div></div>
      <div v-else-if="error" class="pro-panel error">{{error}} <button class="ghost" @click="load">Try again</button></div>
      <section v-else class="match-intel-list">
        <RouterLink v-for="m in matches" :key="m._id" :to="`/matches/${m._id}`" class="match-intel-row">
          <div class="match-intel-top"><span>{{m.leagueId?.name || 'Football'}}</span><span :class="['status-badge',m.status]">{{m.status==='live'?'● LIVE':m.status==='finished'?'FINAL':m.status==='scheduled'?'UPCOMING':m.status}}</span></div>
          <div class="match-intel-main">
            <div class="intel-team home"><TeamLogo :src="m.homeTeamId?.logo" :name="m.homeTeamId?.name" size="sm"/><div><b>{{m.homeTeamId?.name||'Home'}}</b><small>Home</small></div></div>
            <div class="intel-centre"><strong v-if="m.status==='live'||m.status==='finished'">{{m.homeScore ?? 0}} - {{m.awayScore ?? 0}}</strong><strong v-else>{{time(m.kickoff)}}</strong><small>{{m.status==='live'?'In play':m.status==='finished'?'Full time':'Kick-off'}}</small></div>
            <div class="intel-team away"><div><b>{{m.awayTeamId?.name||'Away'}}</b><small>Away</small></div><TeamLogo :src="m.awayTeamId?.logo" :name="m.awayTeamId?.name" size="sm"/></div>
          </div>
          <div class="match-intel-bottom"><span>{{dateLabel(m.kickoff)}}</span><div v-if="m.odds?.length" class="odds-pills"><span v-for="o in m.odds.slice(0,4)" :key="o._id"><b>{{o.label}}</b> {{Number(o.value).toFixed(2)}}</span></div><span class="match-open">Match centre →</span></div>
        </RouterLink>
        <div v-if="!matches.length" class="pro-panel empty">No football fixtures are available for this view yet.</div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted,onUnmounted,ref,watch} from 'vue';import {RouterLink} from 'vue-router';import {api} from '../services/api';import TeamLogo from '../components/TeamLogo.vue';
const tabs=[{v:'today',l:'Today',icon:'◷'},{v:'live',l:'Live',icon:'●'},{v:'scheduled',l:'Upcoming',icon:'→'},{v:'finished',l:'Results',icon:'✓'}];const tab=ref('today'),matches=ref<any[]>([]),loading=ref(true),error=ref('');
const time=(v:string)=>v?new Date(v).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'—';const dateLabel=(v:string)=>v?new Date(v).toLocaleDateString([],{weekday:'short',day:'2-digit',month:'short'}):'';
let refreshTimer:number|undefined;
function startPolling(){if(refreshTimer)window.clearInterval(refreshTimer);const ms=tab.value==='live'?15000:tab.value==='today'?60000:300000;refreshTimer=window.setInterval(load,ms)}
async function load(){loading.value=matches.value.length===0;error.value='';try{const d=tab.value==='today'?await api.get('/matches/today'):tab.value==='live'?await api.get('/matches/live'):await api.get(`/matches?status=${tab.value}&limit=100`);matches.value=d.data||[]}catch(e:any){if(!matches.value.length)error.value=e?.message||'Unable to load football matches.'}finally{loading.value=false}}
watch(tab,async()=>{await load();startPolling()});onMounted(async()=>{await load();startPolling()});onUnmounted(()=>{if(refreshTimer)window.clearInterval(refreshTimer)});
</script>
