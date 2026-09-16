<template>
  <div class="tipster-work-page analytics-page">
    <section class="td-page-hero analytics-hero">
      <div><span class="eyebrow">Performance intelligence</span><h1>Analytics</h1><p>Measure your published record, consistency and returns from the selections stored on your tipster profile.</p></div>
      <div class="analytics-hero-badge"><span>RECORD</span><b>{{ winRate }}%</b><small>win rate</small></div>
    </section>

    <section class="analytics-kpis">
      <div class="analytics-kpi"><span>Total tips</span><b>{{ tipster?.totalTips || 0 }}</b><small>published selections</small></div>
      <div class="analytics-kpi"><span>Win rate</span><b>{{ winRate }}%</b><small>{{ tipster?.wins || 0 }} wins · {{ tipster?.losses || 0 }} losses</small></div>
      <div class="analytics-kpi"><span>Current streak</span><b>{{ tipster?.currentStreak || 0 }}</b><small>consecutive wins</small></div>
      <div class="analytics-kpi"><span>ROI</span><b>{{ formatPercent(tipster?.roi) }}</b><small>recorded return</small></div>
    </section>

    <div class="analytics-layout">
      <section class="bt-card analytics-record-card">
        <div class="bt-card-heading"><span class="section-kicker">PERFORMANCE</span><h2>Record breakdown</h2><p>A simple view of your settled performance.</p></div>
        <div class="record-stat-grid">
          <div><span>Wins</span><strong class="positive">{{ tipster?.wins || 0 }}</strong></div>
          <div><span>Losses</span><strong class="negative">{{ tipster?.losses || 0 }}</strong></div>
          <div><span>Longest streak</span><strong>{{ tipster?.longestStreak || 0 }}</strong></div>
          <div><span>Current streak</span><strong>{{ tipster?.currentStreak || 0 }}</strong></div>
          <div class="record-stat-wide"><span>Profit</span><strong>{{ formatProfit(tipster?.profit) }}</strong></div>
        </div>
        <div class="performance-bar-wrap"><div><span>Win rate</span><b>{{ winRate }}%</b></div><div class="performance-bar"><i :style="{width: winRate+'%'}"></i></div></div>
      </section>

      <section class="bt-card analytics-recent-card">
        <div class="bt-card-head"><div class="bt-card-heading"><span class="section-kicker">SETTLED TIPS</span><h2>Recent results</h2></div><RouterLink to="/tipster-dashboard/results" class="text-action">View all →</RouterLink></div>
        <div v-if="settled.length" class="analytics-result-list">
          <RouterLink v-for="p in settled.slice(0,6)" :key="p._id" :to="p.matchId ? `/matches/${p.matchId}` : `/predictions/${p._id}`" class="analytics-result-row">
            <div><b>{{ p.fixture || 'Football match' }}</b><small>{{ p.prediction }}</small></div><strong>{{ Number(p.odds||0).toFixed(2) }}</strong><em :class="'td-status-pill '+p.status">{{ p.status }}</em>
          </RouterLink>
        </div>
        <div v-else class="bt-empty bt-empty--compact"><div class="bt-empty-icon">✓</div><h3>No settled tips yet</h3><p>Once predictions are settled, your recent results will appear here.</p></div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { api } from '../services/api';
import { formatPercent, formatProfit } from '../utils/formatters';
const tipster=ref<any>(null), predictions=ref<any[]>([]);
const settled=computed(()=>predictions.value.filter(x=>['won','lost','void'].includes(x.status)));
const winRate=computed(()=>{const w=Number(tipster.value?.wins||0),l=Number(tipster.value?.losses||0);return w+l?Math.round(w/(w+l)*100):0});
onMounted(async()=>{try{const d=await api.get('/me/tipster');tipster.value=d.data.profile;predictions.value=d.data.predictions||[]}catch{}});
</script>
