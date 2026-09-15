<template>
  <div class="pro-page tipsters-pro page-animate">
    <div class="wrap">
      <section class="tipsters-head-pro">
        <div><span class="eyebrow">Tipster intelligence</span><h1>Tipsters & Performance</h1><p>Compare football tipsters through transparent results, current form, profit and long-term performance.</p></div>
        <RouterLink to="/history" class="head-action">View full history →</RouterLink>
      </section>

      <section class="tip-overview">
        <div class="tip-overview-stats">
          <div class="tip-over-title"><span class="trend-arrow">↗</span><div><b>Overall Performance</b><small>All active tipsters</small></div></div>
          <strong class="big-profit">{{ overallProfit >= 0 ? '+' : '' }}{{ overallProfit.toFixed(2) }}</strong><span class="profit-label">TOTAL TRACKED PROFIT</span>
          <div class="overview-grid"><div><b>{{ settled }}</b><span>SETTLED TIPS</span></div><div><b>{{ overallRate }}%</b><span>WIN RATE</span></div><div><b>{{ bestRoi }}%</b><span>BEST ROI</span></div><div><b>{{ averageOdds }}</b><span>AVG ODDS</span></div></div>
        </div>
        <div class="tip-chart-area"><div class="chart-top"><div><b>Recent profit curve</b><span>Based on settled BraTipsters predictions</span></div><span>{{ chartPoints.length ? chartPoints.length+' periods' : 'Waiting for results' }}</span></div><svg v-if="chartPoints.length" viewBox="0 0 720 230" preserveAspectRatio="none" class="profit-chart" role="img" aria-label="Recent cumulative profit chart"><defs><linearGradient id="profitFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-opacity=".25"/><stop offset="100%" stop-opacity="0"/></linearGradient></defs><path :d="areaPath" fill="url(#profitFill)"/><path :d="linePath" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle v-for="p in chartPoints" :key="p.x" :cx="p.x" :cy="p.y" r="3.5" fill="currentColor"/><line x1="0" :y1="zeroY" x2="720" :y2="zeroY" stroke="currentColor" opacity=".12" stroke-dasharray="5 5"/></svg><div v-else class="chart-empty">Settled prediction data will appear here automatically.</div><div class="chart-labels"><span v-for="p in chartLabels" :key="p">{{p}}</span></div></div>
      </section>

      <section class="tip-controls"><div class="tip-search"><span>⌕</span><input v-model="search" placeholder="Search tipster"/></div><button v-for="f in sortFilters" :key="f.v" :class="['tip-sort', {active:sort===f.v}]" @click="sort=f.v">{{f.l}}</button></section>

      <div class="tip-section-title"><div><span class="eyebrow">Ranked performance</span><h2>Football tipster leaderboard</h2></div><span>{{ filtered.length }} tipsters</span></div>

      <div v-if="loading" class="tip-card-grid"><div v-for="n in 6" :key="n" class="tip-pro-skeleton"></div></div>
      <div v-else-if="error" class="pro-panel error">{{error}} <button class="ghost" @click="load">Try again</button></div>
      <div v-else-if="filtered.length" class="tip-card-grid">
        <RouterLink v-for="(t,i) in filtered" :key="t._id" :to="`/tipsters/${encodeURIComponent(t.username)}`" class="tip-pro-card">
          <div v-if="i===0" class="rank-ribbon">🏆 TOP PERFORMER</div>
          <div class="tip-card-head"><div class="tip-photo"> <img v-if="t.profilePhoto" :src="t.profilePhoto" :alt="t.username"/><span v-else>{{t.username?.[0]?.toUpperCase()}}</span></div><div class="tip-card-name"><b>{{t.username}}</b><small>{{t.country || 'Football tipster'}}</small><div class="mini-form" :title="(t.wins||0)+' wins, '+(t.losses||0)+' losses'"><span v-for="(s,j) in streak(t)" :key="j" :class="s==='W'?'w':'l'">{{s}}</span></div></div><span class="rank-number">#{{i+1}}</span></div>
          <div class="tip-live"><span class="live-dot"></span>{{t.totalTips ? `${t.totalTips} tracked tips` : 'New tipster'}}<b v-if="Number(t.currentStreak||0)>0">{{t.currentStreak}} WIN STREAK</b></div>
          <div class="tip-main-kpi"><div><span>Profit</span><strong :class="Number(t.profit||0)>=0?'positive':'negative'">{{Number(t.profit||0)>=0?'+':''}}{{Number(t.profit||0).toFixed(2)}}</strong></div><div><span>ROI</span><strong :class="Number(t.roi||0)>=0?'positive':'negative'">{{Number(t.roi||0).toFixed(1)}}%</strong></div></div>
          <div class="tip-stats-grid"><div><span>Win rate</span><b>{{rate(t)}}%</b></div><div><span>Wins</span><b>{{t.wins||0}}</b></div><div><span>Losses</span><b>{{t.losses||0}}</b></div><div><span>Best streak</span><b>{{t.longestStreak||0}}</b></div></div>
          <div class="tip-card-bottom"><span>Open performance profile</span><b>→</b></div>
        </RouterLink>
      </div>
      <div v-else class="pro-panel empty">No approved football tipsters match your search.</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { api } from '../services/api';
const items=ref<any[]>([]), settledRows=ref<any[]>([]), loading=ref(true), error=ref(''), search=ref(''), sort=ref('profit');
const sortFilters=[{v:'profit',l:'Most profitable'},{v:'roi',l:'Best ROI'},{v:'winrate',l:'Win rate'},{v:'streak',l:'Current streak'}];
const rate=(t:any)=>t.totalTips?Math.round((Number(t.wins||0)/Number(t.totalTips))*1000)/10:0;
// Small win/loss strip on each card: proportion of green (win) vs red (loss) dots
// reflects the tipster's actual wins/losses record, not their current streak.
const streak=(t:any)=>{const wins=Number(t.wins||0),losses=Number(t.losses||0),played=wins+losses;const greenCount=played>0?Math.round((wins/played)*5):0;return Array.from({length:5},(_,i)=>i<greenCount?'W':'L')};
const filtered=computed(()=>{const q=search.value.trim().toLowerCase();let a=items.value.filter(t=>!q||String(t.username||'').toLowerCase().includes(q)||String(t.country||'').toLowerCase().includes(q));return a.sort((x,y)=>sort.value==='roi'?Number(y.roi||0)-Number(x.roi||0):sort.value==='winrate'?rate(y)-rate(x):sort.value==='streak'?Number(y.currentStreak||0)-Number(x.currentStreak||0):Number(y.profit||0)-Number(x.profit||0))});
const settled=computed(()=>settledRows.value.length);const overallProfit=computed(()=>settledRows.value.reduce((s,x)=>s+Number(x.profit||0),0));const overallRate=computed(()=>settled.value?Math.round(settledRows.value.filter(x=>x.status==='won').length/settled.value*1000)/10:0);const bestRoi=computed(()=>items.value.reduce((m,t)=>Math.max(m,Number(t.roi||0)),0).toFixed(1));const averageOdds=computed(()=>{const v=settledRows.value.map(x=>Number(x.odds)).filter(x=>x>0);return v.length?(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2):'—'});
const chartData=computed(()=>{const sorted=[...settledRows.value].sort((a,b)=>new Date(a.resultAt||a.createdAt||0).getTime()-new Date(b.resultAt||b.createdAt||0).getTime());let total=0;return sorted.slice(-30).map(x=>{total+=Number(x.profit||0);return {date:new Date(x.resultAt||x.createdAt||Date.now()),value:total}})});
const chartPoints=computed(()=>{const d=chartData.value;if(!d.length)return [];const vals=d.map(x=>x.value),min=Math.min(0,...vals),max=Math.max(0,...vals),range=Math.max(1,max-min);return d.map((x,i)=>({x:d.length===1?360:(i/(d.length-1))*720,y:205-((x.value-min)/range)*180,value:x.value}))});const linePath=computed(()=>chartPoints.value.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' '));const zeroY=computed(()=>{const d=chartData.value;if(!d.length)return 205;const vals=d.map(x=>x.value),min=Math.min(0,...vals),max=Math.max(0,...vals),range=Math.max(1,max-min);return 205-((0-min)/range)*180});const areaPath=computed(()=>chartPoints.value.length?`${linePath.value} L 720 205 L 0 205 Z`:'' );const chartLabels=computed(()=>chartData.value.length?chartData.value.filter((_,i)=>i===0||i===Math.floor(chartData.value.length/2)||i===chartData.value.length-1).map(x=>x.date.toLocaleDateString([],{day:'2-digit',month:'short'})):[]);
async function load(){loading.value=true;error.value='';try{const [t,h]=await Promise.all([api.get('/tipsters'),api.get('/prediction-history?limit=200')]);items.value=t.data||[];settledRows.value=h.data||[]}catch(e:any){error.value=e?.message||'Unable to load tipsters.'}finally{loading.value=false}}
onMounted(load);
</script>
