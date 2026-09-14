<template>
  <div class="history-page page-animate"><div class="wrap">
    <section class="history-title"><span class="eyebrow">BraTips football intelligence</span><h1>Tip History</h1><p>Review settled football tips, compare outcomes and inspect the record behind every selection.</p></section>

    <section class="history-filter-card">
      <div class="history-filter-grid">
        <label><span>Tipster</span><select v-model="filters.tipster"><option value="">All tipsters</option><option v-for="t in tipsters" :key="t" :value="t">{{t}}</option></select></label>
        <label><span>Sport</span><select v-model="filters.sport"><option value="football">Football</option></select></label>
        <label><span>Type</span><select v-model="filters.type"><option value="all">Free and premium</option><option value="free">Free tips</option><option value="premium">Premium tips</option></select></label>
        <label><span>Outcome</span><select v-model="filters.outcome"><option value="">All outcomes</option><option value="won">Won</option><option value="lost">Lost</option><option value="void">Void</option></select></label>
      </div>
      <button class="history-reset" type="button" @click="resetFilters">Reset</button>
    </section>

    <div class="history-count"><strong>{{filteredItems.length}}</strong> tips match the current filters</div>

    <section class="history-list-card">
      <div class="history-list-head"><span>Date</span><span>Fixture</span><span>Selection</span><span>Tipster</span><span>Result</span><span>Odds</span></div>
      <article v-for="p in filteredItems" :key="p._id" class="history-row">
        <div class="history-date">{{date(p.resultAt||p.createdAt)}}</div>
        <RouterLink v-if="p.matchId?._id" :to="`/matches/${p.matchId._id}`" class="history-fixture-pro">
          <div class="history-teams"><TeamLogo :src="p.matchId?.homeTeamId?.logo" :name="p.matchId?.homeTeamId?.name" size="sm"/><span>{{p.matchId?.homeTeamId?.name||homeName(p)}}</span><b>vs</b><span>{{p.matchId?.awayTeamId?.name||awayName(p)}}</span><TeamLogo :src="p.matchId?.awayTeamId?.logo" :name="p.matchId?.awayTeamId?.name" size="sm"/></div>
          <small>{{p.matchId?.leagueId?.name||p.league||'Football'}}</small>
        </RouterLink>
        <div v-else class="history-fixture-pro"><div class="history-fixture-text">{{p.fixture}}</div><small>{{p.league||'Football'}}</small></div>
        <div class="history-selection"><span v-if="p.isPremium" class="premium-tip">🔒 PREMIUM TIP</span><strong v-else>{{p.prediction}}</strong><small v-if="p.isPremium">{{p.prediction}}</small></div>
        <RouterLink v-if="p.tipsterId?.name" :to="`/tipsters/${p.tipsterId.name}`" class="history-tipster">@{{p.tipsterId.name}}</RouterLink><span v-else class="history-tipster">@tipster</span>
        <span :class="['history-outcome',p.status]">{{statusLabel(p.status)}}</span>
        <div class="history-odds">{{Number(p.odds||0).toFixed(2)}}</div>
      </article>
      <div v-if="loading" class="history-loading"><span></span><span></span><span></span></div>
      <div v-if="!loading && !filteredItems.length" class="empty">No settled predictions match the current filters.</div>
    </section>

    <section class="history-summary">
      <div><span>Settled tips</span><strong>{{stats.total||0}}</strong></div><div><span>Win rate</span><strong>{{Number(stats.winRate||0).toFixed(1)}}%</strong></div><div><span>Total profit</span><strong :class="Number(stats.profit||0)>=0?'positive':'negative'">{{Number(stats.profit||0)>=0?'+':''}}{{Number(stats.profit||0).toFixed(2)}}</strong></div><div><span>Automatic settlement</span><strong>Live</strong></div>
    </section>
  </div></div>
</template>
<script setup lang="ts">
import {computed,onMounted,reactive,ref} from 'vue';
import {RouterLink} from 'vue-router';
import {api} from '../services/api';
import TeamLogo from '../components/TeamLogo.vue';
const items=ref<any[]>([]),loading=ref(true),stats=ref<any>({total:0,winRate:0,profit:0});
const filters=reactive({tipster:'',sport:'football',type:'all',outcome:''});
const tipsters=computed(()=>Array.from(new Set(items.value.map(x=>x.tipsterId?.name).filter(Boolean))).sort());
const filteredItems=computed(()=>items.value.filter(p=>{const premium=Boolean(p.isPremium);return (!filters.tipster||p.tipsterId?.name===filters.tipster)&&(!filters.outcome||p.status===filters.outcome)&&(filters.type==='all'||(filters.type==='premium'?premium:!premium));}));
const date=(v:any)=>v?new Date(v).toLocaleDateString([],{day:'2-digit',month:'2-digit'}):'—';
const homeName=(p:any)=>String(p.fixture||'').split(/\s+vs\s+/i)[0]||'Home';
const awayName=(p:any)=>String(p.fixture||'').split(/\s+vs\s+/i)[1]||'Away';
const statusLabel=(s:string)=>s==='won'?'WON':s==='lost'?'LOST':'VOID';
function resetFilters(){filters.tipster='';filters.sport='football';filters.type='all';filters.outcome='';}
onMounted(async()=>{try{const d=await api.get('/prediction-history?limit=200');items.value=d.data||[];stats.value=d.stats||stats.value;}finally{loading.value=false;}});
</script>
