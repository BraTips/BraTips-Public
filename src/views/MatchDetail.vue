<template>
  <div class="match-centre page-animate">
    <div class="match-centre-top">
      <div class="wrap">
        <RouterLink to="/matches" class="back-link">← Matches</RouterLink>
        <div v-if="match" class="mc-header">
          <div class="mc-league">
            <span>{{ leagueName }}</span>
            <span class="dot">•</span>
            <span>{{ formatDate(match.kickoff) }}</span>
            <span v-if="match.status === 'live'" class="live-pill">LIVE</span>
          </div>
          <div class="mc-teams">
            <div class="mc-team">
              <TeamLogo :src="home.logo" :name="home.name" size="lg" />
              <strong>{{ home.name }}</strong>
              <small>{{ home.shortName || 'HOME' }}</small>
            </div>
            <div class="mc-score">
              <span class="mc-status">{{ statusLabel }}</span>
              <b>{{ scoreLabel }}</b>
              <small>{{ time(match.kickoff) }} · {{ match.venue?.name || 'Venue TBC' }}</small>
            </div>
            <div class="mc-team">
              <TeamLogo :src="away.logo" :name="away.name" size="lg" />
              <strong>{{ away.name }}</strong>
              <small>{{ away.shortName || 'AWAY' }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="wrap mc-loading">
      <div class="mc-skeleton hero"></div><div class="mc-skeleton"></div><div class="mc-skeleton"></div>
    </div>

    <main v-else-if="match" class="wrap mc-layout">
      <div class="mc-main">
        <nav class="mc-tabs">
          <button v-for="tab in tabs" :key="tab.id" :class="{active: activeTab === tab.id}" @click="activeTab = tab.id">{{ tab.label }}</button>
        </nav>

        <section v-if="activeTab === 'overview'" class="mc-grid">
          <div class="mc-panel featured-panel">
            <div class="mc-panel-head"><div><span class="eyebrow">Market intelligence</span><h2>Best available odds</h2></div><RouterLink to="/dropping-odds" class="text-link">Dropping odds →</RouterLink></div>
            <div v-if="odds.length" class="market-grid">
              <div v-for="group in topMarkets" :key="group.name" class="market-card">
                <div class="market-title"><b>{{ group.name }}</b><span>{{ group.items.length }} prices</span></div>
                <div v-for="o in group.items.slice(0, 3)" :key="oddKey(o)" class="market-line">
                  <span>{{ o.label }}</span><strong>{{ price(o.value) }}</strong><span :class="movementClass(o.movementPct)">{{ movement(o.movementPct) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty compact">Odds are not available for this match yet.</div>
          </div>

          <div class="mc-panel">
            <div class="mc-panel-head"><div><span class="eyebrow">BraTips insight</span><h2>Predictions</h2></div></div>
            <RouterLink v-for="p in predictions" :key="p._id" :to="predictionPath(p._id)" class="tip-row">
              <div><b>{{ p.prediction }}</b><span>{{ p.tipsterId?.name || 'BraTips tipster' }}</span></div><strong>{{ price(p.odds) }}</strong>
            </RouterLink>
            <div v-if="!predictions.length" class="empty compact">No published BraTips prediction for this fixture.</div>
          </div>

          <div class="mc-panel">
            <div class="mc-panel-head"><div><span class="eyebrow">Expected goals</span><h2>xG</h2></div></div>
            <div class="xg-box">
              <div><span>{{ home.name }}</span><b>{{ xg.home ?? '—' }}</b></div>
              <div class="xg-track"><i :style="{width: xgWidth + '%'}"></i></div>
              <div><span>{{ away.name }}</span><b>{{ xg.away ?? '—' }}</b></div>
            </div>
            <p class="muted small">Expected goals are model/data signals, not guarantees.</p>
          </div>

          <div class="mc-panel">
            <div class="mc-panel-head"><div><span class="eyebrow">Form guide</span><h2>Last 5</h2></div></div>
            <div class="form-columns">
              <FormList :team="home.name" :rows="research.recent?.home || []" />
              <FormList :team="away.name" :rows="research.recent?.away || []" />
            </div>
          </div>
        </section>

        <section v-else-if="activeTab === 'stats'" class="mc-panel">
          <div class="mc-panel-head"><div><span class="eyebrow">Match data</span><h2>Statistics</h2></div><span class="muted small">Live when available</span></div>
          <div v-if="statRows.length" class="stat-table">
            <div class="stat-head"><span>{{ home.shortName || home.name }}</span><b>STAT</b><span>{{ away.shortName || away.name }}</span></div>
            <div v-for="s in statRows" :key="s.name" class="stat-line"><b>{{ s.home }}</b><span>{{ s.name }}</span><b>{{ s.away }}</b></div>
          </div>
          <div v-else class="empty">Detailed statistics are not available for this fixture yet.</div>
        </section>

        <section v-else-if="activeTab === 'h2h'" class="mc-panel">
          <div class="mc-panel-head"><div><span class="eyebrow">Head to head</span><h2>Previous meetings</h2></div></div>
          <div v-if="research.h2h?.length" class="h2h-list">
            <div v-for="row in research.h2h" :key="row.id" class="h2h-row"><div><b>{{ row.name }}</b><span>{{ formatDate(row.starting_at) }}</span></div><strong>{{ row.result_info || 'Scheduled' }}</strong></div>
          </div>
          <div v-else class="empty">No recent head-to-head data is available.</div>
        </section>

        <section v-else-if="activeTab === 'events'" class="mc-panel">
          <div class="mc-panel-head"><div><span class="eyebrow">Timeline</span><h2>Match events</h2></div></div>
          <div v-if="research.events?.length" class="event-list">
            <div v-for="(event, index) in research.events" :key="event.id || index" class="event-row"><span>{{ event.minute || event.time?.minute || '—' }}'</span><b>{{ event.type?.name || event.type?.developer_name || 'Event' }}</b><span>{{ event.player?.name || event.participant?.name || event.result || '' }}</span></div>
          </div>
          <div v-else class="empty">No events have been recorded.</div>
        </section>

        <section v-else-if="activeTab === 'table'" class="mc-panel">
          <div class="mc-panel-head"><div><span class="eyebrow">League context</span><h2>Standings</h2></div></div>
          <div v-if="research.standings?.length" class="standings-mini"><div v-for="row in research.standings" :key="row.participantId" class="standing-row"><span>#{{ row.position }}</span><b>{{ row.participant || standingName(row.participantId) }}</b><strong>{{ row.points }} pts</strong></div></div><div v-else class="empty">Standings are not available for this competition.</div>
        </section>
      </div>

      <aside class="mc-side">
        <div class="mc-panel quick-panel">
          <span class="eyebrow">Match centre</span><h3>At a glance</h3>
          <div class="quick-row"><span>League</span><b>{{ leagueName }}</b></div>
          <div class="quick-row"><span>Kick-off</span><b>{{ formatDate(match.kickoff) }}</b></div>
          <div class="quick-row"><span>Venue</span><b>{{ match.venue?.name || 'TBC' }}</b></div>
          <div class="quick-row"><span>Status</span><b>{{ statusLabel }}</b></div>
        </div>
        <div class="mc-panel drop-cta"><span class="eyebrow">Market watch</span><h3>Watch the price</h3><p class="muted">Find selections where the latest recorded price has moved lower.</p><RouterLink to="/dropping-odds" class="btn btn-wide">Open Dropping Odds</RouterLink></div>
        <div class="mc-panel disclaimer"><b>Responsible betting</b><p>Odds and predictions are informational. Prices can change quickly and no prediction guarantees a result.</p></div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { api } from '../services/api';
import TeamLogo from '../components/TeamLogo.vue';
import FormList from '../components/FormList.vue';

const route = useRoute();
const match = ref<any>(null);
const odds = ref<any[]>([]);
const predictions = ref<any[]>([]);
const research = ref<any>({});
const loading = ref(true);
const activeTab = ref('overview');
let refreshTimer:any=null;
const tabs = [{id:'overview',label:'Overview'},{id:'stats',label:'Stats'},{id:'h2h',label:'H2H'},{id:'events',label:'Events'},{id:'table',label:'Standings'}];

const home = computed(() => match.value?.homeTeamId || {});
const away = computed(() => match.value?.awayTeamId || {});
const leagueName = computed(() => match.value?.leagueId?.name || 'Football');
const statusLabel = computed(() => match.value?.status === 'live' ? 'LIVE' : String(match.value?.status || 'scheduled').toUpperCase());
const scoreLabel = computed(() => match.value?.status === 'live' || match.value?.status === 'finished' ? `${match.value?.homeScore ?? 0} - ${match.value?.awayScore ?? 0}` : 'VS');
const xg = computed(() => {
  const rows = Array.isArray(research.value.xg) ? research.value.xg : [];
  const out:any = {home:null,away:null};
  rows.forEach((x:any) => { const value = x.data?.value ?? x.value; if (String(x.location).toLowerCase() === 'home') out.home = value != null ? Number(value).toFixed(2) : null; if (String(x.location).toLowerCase() === 'away') out.away = value != null ? Number(value).toFixed(2) : null; });
  return out;
});
const xgWidth = computed(() => { const a=Number(xg.value.home||0), b=Number(xg.value.away||0), total=a+b; return total ? Math.max(8,Math.min(92,a/total*100)) : 50; });
const topMarkets = computed(() => { const groups:any[]=[]; const map=new Map<string,any>(); odds.value.forEach(o=>{const name=o.marketName||'Market';if(!map.has(name)){const g={name,items:[]};map.set(name,g);groups.push(g);}map.get(name).items.push(o);});return groups.slice(0,4); });
const statRows = computed(() => {
  const rows = Array.isArray(research.value.statistics) ? research.value.statistics : [];
  const map=new Map<string,any>();
  rows.forEach((r:any)=>{const name=r.type?.name || r.type?.developer_name || 'Statistic'; const value=r.data?.value ?? r.value ?? r.amount ?? '—'; const side=String(r.location||'').toLowerCase(); if(!map.has(name))map.set(name,{name,home:'—',away:'—'}); if(side==='home')map.get(name).home=formatStat(value); if(side==='away')map.get(name).away=formatStat(value);});
  return Array.from(map.values()).slice(0,24);
});
function formatStat(v:any){if(v==null)return '—';if(typeof v==='object')return v.value ?? v.count ?? '—';return String(v);}
function formatDate(v:any){return v?new Date(v).toLocaleDateString([],{weekday:'short',day:'numeric',month:'short',year:'numeric'}):'—'}
function time(v:any){return v?new Date(v).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'—'}
function price(v:any){return Number(v)>0?Number(v).toFixed(2):'—'}
function movement(v:any){return v==null?'—':`${Number(v)>0?'+':''}${Number(v).toFixed(1)}%`}
function movementClass(v:any){return v==null?'muted':Number(v)<0?'move-down':'move-up'}
function oddKey(o:any){return `${o.bookmakerId||0}-${o.marketId||0}-${o.label}`}
function predictionPath(id:string){return `/predictions/${id}`}
function standingName(id:any){return id===home.value.externalId?home.value.name:id===away.value.externalId?away.value.name:'Team'}
async function load(){
  loading.value=true;
  try{
    const id=String(route.params.id);
    const [m,o,p,r]=await Promise.all([api.get(`/matches/${id}`),api.get(`/matches/${id}/odds`),api.get('/predictions?limit=100'),api.get(`/matches/${id}/research`)]);
    match.value=m.data; odds.value=o.data||[]; predictions.value=(p.data||[]).filter((x:any)=>String(x.matchId?._id||x.matchId)===id); research.value=r.data||{};
  } catch(e){ match.value=null; } finally { loading.value=false; }
}
onMounted(async () => { await load(); refreshTimer = window.setInterval(async () => { if (match.value?.status === 'live') { try { const id=String(route.params.id); const [m,o]=await Promise.all([api.get(`/matches/${id}`),api.get(`/matches/${id}/odds?mode=inplay`)]); match.value=m.data; if ((o.data||[]).length) odds.value=o.data; } catch {} } }, 30000); });
onUnmounted(() => { if (refreshTimer) window.clearInterval(refreshTimer); });
</script>
