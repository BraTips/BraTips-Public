<template>
  <div class="odds-page page-animate"><div class="wrap"><div class="page-head professional-head"><span class="eyebrow">Market intelligence</span><h1>Dropping Odds</h1><p class="muted">Track football prices that have moved lower since our last recorded snapshot.</p></div>
    <div class="odds-toolbar"><button v-for="x in filters" :key="x.v" class="filter-btn" :class="{selected:minDrop===x.v}" @click="minDrop=x.v">{{x.l}}</button><button class="ghost refresh-btn" @click="load">↻ Refresh</button></div>
    <div class="notice-strip"><b>How to read this:</b><span> A negative percentage means the decimal price has dropped. Price movement is a market signal, not a guarantee.</span></div>
    <div v-if="loading" class="odds-board"><div v-for="n in 5" :key="n" class="skeleton-row"></div></div>
    <div v-else-if="error" class="error">{{error}} <button class="ghost" @click="load">Try again</button></div>
    <div v-else-if="rows.length" class="odds-board">
      <RouterLink v-for="row in rows" :key="row._id" :to="`/matches/${row.matchId._id}`" class="drop-row">
        <div class="drop-match"><span class="small muted">{{row.matchId.leagueId?.name||'Football'}}</span><b>{{row.matchId.homeTeamId?.name}} <span class="muted">vs</span> {{row.matchId.awayTeamId?.name}}</b><span class="small muted">{{format(row.matchId.kickoff)}}</span></div>
        <div class="drop-market"><span class="small muted">{{row.marketName||'Market'}}</span><b>{{row.label}}</b></div>
        <div class="drop-price"><span class="old">{{row.previousValue?Number(row.previousValue).toFixed(2):'—'}}</span><strong>{{Number(row.value).toFixed(2)}}</strong></div>
        <div class="drop-move">{{Number(row.movementPct).toFixed(1)}}%</div><span class="arrow">→</span>
      </RouterLink>
    </div>
    <div v-else class="panel empty">No recorded drops yet. Odds movement appears after the odds sync has captured more than one price for a selection.</div>
  </div></div>
</template>
<script setup lang="ts">import {onMounted,ref,watch} from 'vue';import {RouterLink} from 'vue-router';import {api} from '../services/api';const filters=[{v:0,l:'Any drop'},{v:5,l:'5%+'},{v:10,l:'10%+'}],minDrop=ref(0),rows=ref<any[]>([]),loading=ref(false),error=ref('');const format=(v:any)=>v?new Date(v).toLocaleString([],{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'—';async function load(){loading.value=true;error.value='';try{const d=await api.get(`/dropping-odds?minDrop=${minDrop.value}`);rows.value=d.data||[]}catch(e:any){error.value=e.message||'Unable to load odds movement.'}finally{loading.value=false}}watch(minDrop,load);onMounted(load)</script>
