<template>
  <div class="wrap page-animate">
    <div class="page-head reveal"><span class="eyebrow light">Daily feature</span><h1>Bet of the Day</h1><p class="muted">Today's featured selections, with clear market labels and tracked results.</p></div>
    <div v-if="items.length" class="grid2">
      <RouterLink v-for="p in items" :key="p._id" :to="betPath(p)" class="card featured lift-in featured-link">
        <div class="featured-top"><span class="tag">{{ p.risk || 'Featured' }}</span><span v-if="p.status==='won'" class="result win">WON</span><span v-else-if="p.status==='lost'" class="result loss">LOST</span><span v-else-if="p.status==='void'" class="result">VOID</span></div>
        <div class="bot-match"><div class="team-block"><TeamLogo :src="p.matchId?.homeTeamId?.logo" :name="p.matchId?.homeTeamId?.name" size="lg"/><b>{{ p.matchId?.homeTeamId?.name || 'Home team' }}</b></div><span class="vs">VS</span><div class="team-block"><TeamLogo :src="p.matchId?.awayTeamId?.logo" :name="p.matchId?.awayTeamId?.name" size="lg"/><b>{{ p.matchId?.awayTeamId?.name || 'Away team' }}</b></div></div>
        <div class="prediction">{{ displayPrediction(p.prediction) }}</div>
        <div v-if="p.odds" class="bot-odds">Reference odds <b>{{ Number(p.odds).toFixed(2) }}</b></div>
        <div class="kpis"><div class="stat"><span class="muted small">Confidence</span><b>{{ p.confidence }}%</b></div><div class="stat"><span class="muted small">Model</span><b style="font-size:15px">{{ p.model || 'AI model' }}</b></div></div>
        <p class="muted analysis">{{ p.analysis }}</p><span class="btn btn-wide">Open match centre →</span>
      </RouterLink>
    </div>
    <div v-else class="card empty reveal">No Bet of the Day has been published yet.</div>

    <section class="section recent-bod">
      <div class="section-head"><div><span class="eyebrow">Track record</span><h2>Recently played Bet of the Day</h2><p class="muted">See whether previous featured predictions WON, LOST or were VOID.</p></div><RouterLink to="/history" class="small">Full history →</RouterLink></div>
      <div v-if="recent.length" class="recent-list">
        <RouterLink v-for="p in recent" :key="p._id" :to="betPath(p)" class="recent-row">
          <div class="recent-teams"><TeamLogo :src="p.matchId?.homeTeamId?.logo" :name="p.matchId?.homeTeamId?.name" size="sm"/><b>{{p.matchId?.homeTeamId?.shortName || p.matchId?.homeTeamId?.name || 'Home'}}</b><span>vs</span><b>{{p.matchId?.awayTeamId?.shortName || p.matchId?.awayTeamId?.name || 'Away'}}</b><TeamLogo :src="p.matchId?.awayTeamId?.logo" :name="p.matchId?.awayTeamId?.name" size="sm"/></div>
          <div class="recent-pick"><b>{{displayPrediction(p.prediction)}}</b><small>{{date(p.date)}}</small></div>
          <strong :class="p.status==='won'?'win':p.status==='lost'?'loss':''">{{p.status.toUpperCase()}}</strong><span class="arrow">→</span>
        </RouterLink>
      </div>
      <div v-else class="empty compact">No settled Bet of the Day results yet.</div>
    </section>
  </div>
</template>
<script setup lang="ts">
import {onMounted,ref} from 'vue';import {RouterLink} from 'vue-router';import {api} from '../services/api';import TeamLogo from '../components/TeamLogo.vue';
const items=ref<any[]>([]),recent=ref<any[]>([]);
const betPath=(p:any)=>p?.matchId?._id?`/matches/${p.matchId._id}`:'/bet-of-the-day';
const displayPrediction=(v:any)=>{const s=String(v||'').trim();return /^double\s*chance$/i.test(s)?'Double Chance — selection not specified':'Double Chance 1X'===s?'Double Chance · 1X':s==='Double Chance X2'?'Double Chance · X2':s};
const date=(v:any)=>v?new Date(v).toLocaleDateString([],{day:'2-digit',month:'short',year:'numeric'}):'—';
onMounted(async()=>{try{const d=await api.get('/bet-of-day');items.value=d.data||[]}catch{items.value=[]}try{const d=await api.get('/bet-of-day/recent?limit=12');recent.value=d.data||[]}catch{recent.value=[]}})
</script>
