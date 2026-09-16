<template>
  <div class="pro-page dropping-pro page-animate">
    <div class="wrap">
      <section class="drop-hero">
        <div>
          <div class="drop-kicker"><span class="football-dot">⚽</span> Football market monitor</div>
          <h1>Dropping Odds</h1>
          <p>Live football price movements, grouped by match so you can spot the strongest market signals at a glance.</p>
        </div>
        <div class="drop-live-card"><span class="pulse"></span><div><b>Market monitor</b><small>Automatic refresh · {{ countdown }}s</small></div><button class="drop-refresh" @click="load">↻</button></div>
      </section>

      <section class="drop-summary">
        <div><span>Visible drops</span><strong>{{ grouped.length }}</strong><small>football matches</small></div>
        <div><span>Strongest movement</span><strong>{{ strongestDrop }}%</strong><small>largest recorded price drop</small></div>
        <div><span>Markets tracked</span><strong>{{ marketCount }}</strong><small>1X2 · totals · BTTS</small></div>
        <div><span>Minimum signal</span><strong>{{ minDrop }}%+</strong><small>change your threshold below</small></div>
      </section>

      <section class="drop-filter-panel">
        <div class="drop-filter-title"><span class="filter-icon">☷</span><div><b>Football odds monitor</b><small>Only football fixtures are shown</small></div></div>
        <div class="drop-filters">
          <button v-for="x in filters" :key="x.v" :class="['drop-filter', {active:minDrop===x.v}]" @click="minDrop=x.v">{{ x.l }}</button>
          <select v-model="marketFilter" class="drop-select"><option value="all">All markets</option><option value="1X2">1X2</option><option value="totals">Over / Under</option><option value="BTTS">BTTS</option></select>
          <button class="drop-clear" @click="load">Refresh now</button>
        </div>
      </section>

      <div class="drop-info"><span>↓</span><div><b>How to read the board</b><small>Green means the latest decimal price is lower than the recorded previous price. The movement is information for research, not a betting guarantee.</small></div></div>

      <div v-if="loading" class="drop-table loading-table"><div v-for="n in 6" :key="n" class="drop-skeleton"></div></div>
      <div v-else-if="error" class="pro-panel error">{{ error }} <button class="ghost" @click="load">Try again</button></div>
      <section v-else-if="grouped.length" class="drop-table">
        <div class="drop-table-head"><div>Match</div><div>1</div><div>X</div><div>2</div><div>O 2.5</div><div>U 2.5</div><div>BTTS</div></div>
        <RouterLink v-for="group in grouped" :key="group.id" :to="`/matches/${group.id}`" class="drop-match-row">
          <div class="drop-match-info">
            <span class="drop-league">{{ group.league }}</span>
            <div class="drop-teams"><TeamLogo :src="group.homeLogo" :name="group.home" size="sm"/><b>{{ group.home }}</b><span class="drop-vs">vs</span><b>{{ group.away }}</b><TeamLogo :src="group.awayLogo" :name="group.away" size="sm"/></div>
            <span class="drop-time">{{ format(group.kickoff) }}</span>
          </div>
          <OddsCell :row="group.markets['1']" />
          <OddsCell :row="group.markets['X']" />
          <OddsCell :row="group.markets['2']" />
          <OddsCell :row="group.markets['O 2.5']" />
          <OddsCell :row="group.markets['U 2.5']" />
          <OddsCell :row="group.markets.BTTS" />
        </RouterLink>
      </section>
      <div v-else class="pro-panel empty">No football price drops match the selected threshold yet. The board fills as the odds scheduler records multiple prices.</div>

      <section class="drop-footer-note"><div class="drop-foot-icon">↘</div><div><b>Want deeper movement history?</b><p>Open any match to compare its recorded prices, bookmakers, predictions and research in the Football Match Centre.</p></div><RouterLink to="/matches" class="btn">Open Football Centre →</RouterLink></section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { api } from '../services/api';
import TeamLogo from '../components/TeamLogo.vue';

const filters=[{v:0,l:'Any drop'},{v:5,l:'5%+'},{v:10,l:'10%+'},{v:15,l:'15%+'}];
const minDrop=ref(0), marketFilter=ref('all'), rows=ref<any[]>([]), loading=ref(true), error=ref(''), countdown=ref(30);
const marketKey=(label:string, marketName:string)=>{const s=`${marketName||''} ${label||''}`.toLowerCase();if(s.includes('btts')||s.includes('both teams'))return 'BTTS';if(s.includes('over')&&s.includes('2.5'))return 'O 2.5';if(s.includes('under')&&s.includes('2.5'))return 'U 2.5';if(label==='1'||label.toLowerCase()==='home')return '1';if(label==='x'||label.toLowerCase()==='draw')return 'X';if(label==='2'||label.toLowerCase()==='away')return '2';return null};
const OddsCell=defineComponent({props:{row:{type:Object,default:null}},setup(p){return()=>{const r:any=p.row;if(!r)return h('div',{class:'drop-cell empty-cell'},'—');const pct=Number(r.movementPct||0);return h('div',{class:['drop-cell',pct<0?'is-drop':'',Math.abs(pct)>=15?'strong-drop':'']},[h('span',{class:'drop-old'},Number(r.previousValue||0).toFixed(2)),h('strong',Number(r.value||0).toFixed(2)),h('small',null,`${pct>0?'+':''}${pct.toFixed(1)}%`)]);}}});
const grouped=computed(()=>{const map=new Map<string,any>();for(const r of rows.value){const m=r.matchId;if(!m)continue;const id=String(m._id);if(!map.has(id))map.set(id,{id,league:m.leagueId?.name||'Football',home:m.homeTeamId?.name||'Home',away:m.awayTeamId?.name||'Away',homeLogo:m.homeTeamId?.logo,awayLogo:m.awayTeamId?.logo,kickoff:m.kickoff,markets:{}});const key=marketKey(r.label,r.marketName);if(key&&(!marketFilter.value||marketFilter.value==='all'||(marketFilter.value==='1X2'?['1','X','2'].includes(key):marketFilter.value===key))){map.get(id).markets[key]=r;}}return [...map.values()].filter(x=>Object.keys(x.markets).length).sort((a,b)=>Math.max(...Object.values(b.markets).map((x:any)=>Math.abs(Number(x.movementPct||0))))-Math.max(...Object.values(a.markets).map((x:any)=>Math.abs(Number(x.movementPct||0)))));});
const strongestDrop=computed(()=>{const values=rows.value.map(x=>Number(x.movementPct||0)).filter(x=>x<0);return values.length?Math.abs(Math.min(...values)).toFixed(1):'0.0'});
const marketCount=computed(()=>new Set(rows.value.map(x=>marketKey(x.label,x.marketName)).filter(Boolean)).size);
const format=(v:any)=>v?new Date(v).toLocaleString([],{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'—';
let timer:number|undefined;let refreshTimer:number|undefined;
async function load(){loading.value=true;error.value='';try{const d=await api.get(`/dropping-odds?minDrop=${minDrop.value}`);rows.value=d.data||[];countdown.value=30}catch(e:any){error.value=e?.message||'Unable to load football odds movement.'}finally{loading.value=false}}
watch(minDrop,load);watch(marketFilter,()=>{});onMounted(()=>{load();timer=window.setInterval(()=>{countdown.value=Math.max(0,countdown.value-1)},1000);refreshTimer=window.setInterval(load,30000)});onUnmounted(()=>{if(timer)clearInterval(timer);if(refreshTimer)clearInterval(refreshTimer)});
</script>
