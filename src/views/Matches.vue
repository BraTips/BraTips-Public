<template>
  <div class="pro-page football-page page-animate">
    <div class="wrap">
      <section class="football-centre-hero">
        <div class="football-centre-hero-main">
          <div class="football-centre-kicker"><span class="football-ball">⚽</span> BRATIPSTERS FOOTBALL CENTRE</div>
          <h1>Matches, scores &amp; predictions</h1>
          <p>Today's football, live scores, bookmaker odds and BraTipsters model picks — all in one place.</p>
        </div>
        <div class="football-centre-hero-stats">
          <div><strong>{{ matches.length }}</strong><span>Matches</span></div>
          <div><strong>{{ predictionCount }}</strong><span>Predictions</span></div>
          <div class="live-stat"><i></i><strong>{{ liveCount }}</strong><span>Live now</span></div>
        </div>
      </section>

      <section class="football-controls">
        <div class="football-day-tabs" role="tablist" aria-label="Match view">
          <button v-for="x in tabs" :key="x.v" :class="['football-day-tab', {active:tab===x.v}]" @click="tab=x.v">
            <span class="day-icon">{{x.icon}}</span>{{x.l}}
          </button>
        </div>
        <div class="football-selects">
          <select v-model="leagueFilter" aria-label="Competition filter">
            <option value="all">All competitions</option>
            <option v-for="league in leagues" :key="league" :value="league">{{league}}</option>
          </select>
          <select v-model="marketFilter" aria-label="Market filter">
            <option value="all">All markets</option>
            <option v-for="market in markets" :key="market" :value="market">{{market}}</option>
          </select>
          <RouterLink to="/dropping-odds" class="football-price-link">↘ Price drops</RouterLink>
        </div>
      </section>

      <section class="football-live-strip">
        <div class="football-live-copy">
          <span class="live-pulse"></span>
          <div><strong>Football intelligence</strong><small>Scores, prices and model picks update automatically.</small></div>
        </div>
        <div class="live-strip-item"><b>{{ visibleMatches.length }}</b><span>Showing</span></div>
        <div class="live-strip-item"><b>{{ premiumCount }}</b><span>Premium</span></div>
        <RouterLink to="/predictions">Explore predictions →</RouterLink>
      </section>

      <section v-if="tab==='live'" class="live-centre-panel">
        <div class="live-centre-heading"><div><span class="football-section-kicker">LIVE CENTRE</span><h2>Scores in play</h2><p>Live fixtures, current scores and match intelligence from the backend feed.</p></div><button class="live-centre-refresh" type="button" @click="load" :disabled="loading">↻ {{ loading ? 'Refreshing…' : 'Refresh scores' }}</button></div>
        <div class="live-centre-stats"><div><strong>{{ liveCount }}</strong><span>Matches live</span></div><div><strong>{{ liveGoals }}</strong><span>Goals scored</span></div><div><strong>{{ liveWithPredictions }}</strong><span>With predictions</span></div><div><strong>{{ lastLiveUpdate ? time(lastLiveUpdate) : '—' }}</strong><span>Last update</span></div></div>
      </section>

      <div v-if="loading" class="prediction-card-grid football-card-grid">
        <div v-for="n in 6" :key="n" class="prediction-match-card skeleton-card"></div>
      </div>
      <div v-else-if="error" class="pro-panel error">{{error}} <button class="ghost" @click="load">Try again</button></div>
      <template v-else>
        <div class="football-section-head">
          <div>
            <span class="football-section-kicker">{{ tab==='live' ? 'LIVE NOW' : tab==='finished' ? 'RECENT RESULTS' : 'TODAY\'S FOOTBALL' }}</span>
            <h2>{{ tab==='live' ? 'Matches in play' : tab==='finished' ? 'Completed matches' : tab==='scheduled' ? 'Upcoming fixtures' : 'Today\'s matches' }}</h2>
          </div>
          <span>{{ filteredMatches.length }} match{{ filteredMatches.length===1?'':'es' }}</span>
        </div>

        <section class="prediction-card-grid football-card-grid">
          <RouterLink v-for="m in filteredMatches" :key="m._id" :to="`/matches/${m._id}`" class="prediction-match-card football-match-card">
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
              <div class="pmc-prediction-head"><span>✦ BRATIPSTERS PICK</span><b v-if="predictionFor(m._id)?.isPremium">PREMIUM</b></div>
              <template v-if="predictionFor(m._id) && !predictionFor(m._id).locked">
                <div class="pmc-pick"><strong>{{predictionFor(m._id).prediction}}</strong><span>{{price(predictionFor(m._id).odds)}} odds</span></div>
                <div class="pmc-metrics">
                  <span><small>Confidence</small><b>{{predictionFor(m._id).confidence ? Number(predictionFor(m._id).confidence).toFixed(0)+'%' : '—'}}</b></span>
                  <span><small>Model score</small><b>{{predictionFor(m._id).modelScore ? Number(predictionFor(m._id).modelScore).toFixed(0)+'%' : '—'}}</b></span>
                  <span><small>Value</small><b>{{predictionFor(m._id).expectedValue ? (Number(predictionFor(m._id).expectedValue)*100).toFixed(1)+'%' : '—'}}</b></span>
                </div>
              </template>
              <template v-else-if="predictionFor(m._id)?.locked">
                <div class="pmc-locked"><span>🔒</span><div><strong>Premium pick locked</strong><small>Subscribe to reveal selection and odds.</small></div></div>
              </template>
              <template v-else>
                <div class="pmc-preparing"><span>✦</span><div><strong>Prediction being prepared</strong><small>Open the match centre for the latest model.</small></div></div>
              </template>
            </div>

            <div class="pmc-footer"><span>{{oddsCount(m._id)}} market prices</span><b>Match centre <span>→</span></b></div>
          </RouterLink>
          <div v-if="!filteredMatches.length" class="pro-panel empty football-empty"><strong>{{ tab==='live' ? 'No live matches right now' : 'No matches match these filters.' }}</strong><span>{{ tab==='live' ? 'The live feed is connected and will refresh automatically when fixtures are in play.' : 'Try changing the competition or market filter.' }}</span></div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed,onMounted,onUnmounted,ref,watch} from 'vue';import {RouterLink} from 'vue-router';import {api} from '../services/api';import TeamLogo from '../components/TeamLogo.vue';import {formatTime,formatDate,formatOdds} from '../utils/formatters';
const tabs=[{v:'today',l:'Today',icon:'●'},{v:'live',l:'Live',icon:'◉'},{v:'scheduled',l:'Upcoming',icon:'→'},{v:'finished',l:'Results',icon:'✓'}];
const tab=ref('today'),matches=ref<any[]>([]),predictions=ref<any[]>([]),loading=ref(true),error=ref(''),leagueFilter=ref('all'),marketFilter=ref('all'),lastLiveUpdate=ref('');let refreshTimer:number|undefined;
const time=(v:string)=>formatTime(v);
const dateLabel=(v:string)=>formatDate(v);
const price=(v:any)=>formatOdds(v);
const predictionFor=(id:any)=>predictions.value.find((p:any)=>String(p.matchId?._id||p.matchId)===String(id));
const oddsCount=(id:any)=>{const m=matches.value.find(x=>String(x._id)===String(id));return m?.odds?.length||0};
const leagues=computed(()=>Array.from(new Set(matches.value.map(m=>m.leagueId?.name).filter(Boolean))).sort() as string[]);
const markets=computed(()=>Array.from(new Set(predictions.value.map(p=>p.prediction).filter(Boolean))).sort() as string[]);
const predictionCount=computed(()=>matches.value.filter(m=>!!predictionFor(m._id)).length);
const premiumCount=computed(()=>matches.value.filter(m=>predictionFor(m._id)?.isPremium).length);
const liveCount=computed(()=>matches.value.filter(m=>m.status==='live').length);
const liveGoals=computed(()=>matches.value.filter(m=>m.status==='live').reduce((total,m)=>total+Number(m.homeScore||0)+Number(m.awayScore||0),0));
const liveWithPredictions=computed(()=>matches.value.filter(m=>m.status==='live'&&predictionFor(m._id)).length);
const visibleMatches=computed(()=>matches.value);
const filteredMatches=computed(()=>matches.value.filter(m=>leagueFilter.value==='all'||m.leagueId?.name===leagueFilter.value).filter(m=>marketFilter.value==='all'||predictionFor(m._id)?.prediction===marketFilter.value));
function startPolling(){if(refreshTimer)window.clearInterval(refreshTimer);const ms=tab.value==='live'?15000:tab.value==='today'?60000:300000;refreshTimer=window.setInterval(load,ms)}
async function load(){loading.value=matches.value.length===0;error.value='';try{const d=tab.value==='today'?await api.get('/matches/today'):tab.value==='live'?await api.get('/matches/live'):await api.get(`/matches?status=${tab.value}&limit=100`);matches.value=d.data||[];if(tab.value==='live')lastLiveUpdate.value=new Date().toISOString();const p=await api.get('/predictions?limit=100');predictions.value=(p.data||[]).filter((x:any)=>x.systemGenerated||!x.tipsterId);}catch(e:any){if(!matches.value.length)error.value=e?.message||'Unable to load football matches.'}finally{loading.value=false}}
watch(tab,async()=>{leagueFilter.value='all';marketFilter.value='all';await load();startPolling()});onMounted(async()=>{await load();startPolling()});onUnmounted(()=>{if(refreshTimer)window.clearInterval(refreshTimer)});
</script>
