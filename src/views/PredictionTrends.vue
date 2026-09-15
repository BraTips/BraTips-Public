<template>
  <main class="trends-page page-animate">
    <div class="wrap trends-wrap">
      <header class="trends-hero">
        <div>
          <span class="eyebrow">★ Prediction Trends</span>
          <h1>Market Performance Insights</h1>
          <p>See how our predictions perform across different markets. Track win rates, profit/loss and find the most profitable opportunities.</p>
        </div>
        <select v-model="days" class="trends-range" @change="load">
          <option :value="7">Last 7 Days</option><option :value="30">Last 30 Days</option><option :value="90">Last 90 Days</option><option :value="365">Last 12 Months</option>
        </select>
      </header>

      <div v-if="error" class="trends-error">{{ error }}</div>
      <template v-else>
        <section class="trend-kpis">
          <article class="trend-kpi pink"><span class="kpi-icon">◎</span><div><small>Total Tips</small><strong>{{ fmt(summary.tips) }}</strong><em>Tracked in selected period</em></div></article>
          <article class="trend-kpi green"><span class="kpi-icon">♜</span><div><small>Total Wins</small><strong>{{ fmt(summary.wins) }}</strong><em>{{ summary.tips ? pct(summary.wins/summary.tips*100) : '0.0' }}% of settled tips</em></div></article>
          <article class="trend-kpi purple"><span class="kpi-icon">%</span><div><small>Win Rate</small><strong>{{ pct(summary.winRate) }}%</strong><em>Settled prediction rate</em></div></article>
          <article class="trend-kpi pink"><span class="kpi-icon">↗</span><div><small>Total Profit</small><strong :class="summary.profit>=0?'positive':'negative'">{{ money(summary.profit) }}</strong><em>1-unit tracked performance</em></div></article>
          <article class="trend-kpi blue"><span class="kpi-icon">◉</span><div><small>Avg. Odds</small><strong>{{ summary.avgOdds ? summary.avgOdds.toFixed(2) : '—' }}</strong><em>Across settled tips</em></div></article>
        </section>

        <section class="trend-main-grid">
          <article class="trend-panel chart-panel">
            <div class="trend-panel-head"><div><h2>Profit & Win Rate Trend</h2><p>Daily settled performance</p></div><div class="legend"><span><i class="dot profit-dot"></i> Profit/Loss</span><span><i class="dot rate-dot"></i> Win Rate</span></div></div>
            <div class="chart-wrap" v-if="daily.length">
              <div class="y-axis"><span>{{ money(chartMax) }}</span><span>{{ money(chartMax/2) }}</span><span>€0</span><span>{{ money(chartMin/2) }}</span><span>{{ money(chartMin) }}</span></div>
              <svg viewBox="0 0 760 280" preserveAspectRatio="none" class="trend-chart">
                <line v-for="y in [30,85,140,195,250]" :key="y" x1="0" :y1="y" x2="760" :y2="y" class="grid-line"/>
                <line x1="0" y1="140" x2="760" y2="140" class="zero-line"/>
                <g v-for="(d,i) in daily" :key="d.date">
                  <rect :x="barX(i)" :y="barY(d.profit)" width="{{barWidth}}" :height="barHeight(d.profit)" :class="d.profit>=0?'bar-positive':'bar-negative'" rx="2"/>
                </g>
                <polyline :points="ratePoints" class="rate-line"/>
                <circle v-for="(d,i) in daily" :key="'c'+d.date" :cx="pointX(i)" :cy="rateY(d.winRate)" r="3.2" class="rate-point"/>
              </svg>
              <div class="x-axis"><span v-for="d in chartLabels" :key="d.date">{{ shortDate(d.date) }}</span></div>
            </div>
            <div v-else class="trend-empty">No settled prediction data in this period.</div>
          </article>

          <article class="trend-panel market-distribution">
            <div class="trend-panel-head"><div><h2>Performance by Market</h2><p>Share of tracked settled tips</p></div></div>
            <div class="donut-area">
              <div class="donut" :style="donutStyle"><div><strong>{{ fmt(summary.tips) }}</strong><span>Total Tips</span></div></div>
              <div class="distribution-list"><div v-for="(m,i) in distribution.slice(0,6)" :key="m.market"><i :style="{background:palette[i]}"></i><span>{{m.market}}</span><b>{{pct(m.percentage)}}%</b></div></div>
            </div>
          </article>
        </section>

        <section class="trend-panel market-table-panel">
          <div class="trend-panel-head"><div><h2>Top Performing Markets</h2><p>Markets ranked by tracked profit, with win rate and recent direction.</p></div><RouterLink to="/history" class="trend-action">View All Trends →</RouterLink></div>
          <div v-if="markets.length" class="market-table">
            <div class="market-table-head"><span>Market</span><span>Total Tips</span><span>Wins</span><span>Win Rate</span><span>Profit/Loss</span><span>Avg. Odds</span><span>Trend</span><span></span></div>
            <div v-for="(m,i) in markets.slice(0,8)" :key="m.market" class="market-row">
              <div class="market-name"><i :style="{background:palette[i%palette.length]}">{{i+1}}</i><strong>{{m.market}}</strong></div>
              <b>{{fmt(m.tips)}}</b><b>{{fmt(m.wins)}}</b><strong>{{pct(m.winRate)}}%</strong>
              <strong :class="m.profit>=0?'positive':'negative'">{{money(m.profit)}}</strong><span>{{m.avgOdds.toFixed(2)}}</span>
              <div class="spark"><span v-for="n in spark(m,i)" :key="n" :style="{height:n+'%'}"></span></div><span class="row-arrow">→</span>
            </div>
          </div>
          <div v-else class="trend-empty">Prediction trends will appear after settled tips are recorded.</div>
        </section>

        <section class="trend-panel explore-panel">
          <div class="explore-head"><div><span class="eyebrow">⚡ Explore BraTipsters</span><p>Get the most out of BraTipsters with helpful guides, latest updates and answers to your questions.</p></div><span>Better insights. Smarter bets.</span></div>
          <div class="explore-grid">
            <RouterLink to="/how-to-use" class="explore-card pink-card"><i>▮</i><div><strong>How to use BraTipsters</strong><p>Learn how to find matches, read predictions, compare tipsters and use odds research.</p><b>Start Guide →</b></div></RouterLink>
            <RouterLink to="/whats-new" class="explore-card purple-card"><i>◆</i><div><strong>What's New</strong><p>See the latest features, automatic Bet of the Day and improvements across the platform.</p><b>View Updates →</b></div></RouterLink>
            <RouterLink to="/faq" class="explore-card blue-card"><i>?</i><div><strong>FAQ</strong><p>Quick answers about predictions, results, Premium, tipsters and responsible betting.</p><b>Get Answers →</b></div></RouterLink>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>
<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {api} from '../services/api';
const days=ref(30),loading=ref(true),error=ref('');
const summary=ref<any>({tips:0,wins:0,winRate:0,profit:0,avgOdds:0});
const markets=ref<any[]>([]),distribution=ref<any[]>([]),daily=ref<any[]>([]);
const palette=['#ed275f','#7757e8','#2397ee','#18c99a','#ffbd62','#9da8bb'];
function fmt(n:number){return Number(n||0).toLocaleString();} function pct(n:number){return Number(n||0).toFixed(1)} function money(n:number){const v=Number(n||0);return `${v>=0?'+':''}€${Math.abs(v).toFixed(2)}`;}
function shortDate(v:string){const d=new Date(v+'T00:00:00Z');return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});}
async function load(){loading.value=true;error.value='';try{const r=await api.get(`/prediction-trends?days=${days.value}`);const d=r.data||{};summary.value=d.summary||summary.value;markets.value=d.markets||[];distribution.value=d.distribution||[];daily.value=d.daily||[];}catch(e:any){error.value=e?.message||'Unable to load prediction trends.'}finally{loading.value=false}}
const chartMax=computed(()=>Math.max(100,...daily.value.map(d=>Math.abs(Number(d.profit||0)))));const chartMin=computed(()=>-chartMax.value);
const barWidth=12; function pointX(i:number){return daily.value.length<2?380:(i/(daily.value.length-1))*740+10} function rateY(v:number){return 250-(Math.min(100,Math.max(0,v))/100)*220} function barX(i:number){return pointX(i)-barWidth/2} function barY(v:number){const zero=140, scale=110/chartMax.value;return v>=0?zero-v*scale:zero} function barHeight(v:number){return Math.max(2,Math.abs(v)*110/chartMax.value)}
const ratePoints=computed(()=>daily.value.map((d,i)=>`${pointX(i)},${rateY(Number(d.winRate||0))}`).join(' '));
const chartLabels=computed(()=>daily.value.filter((_,i)=>i===0||i===daily.value.length-1||i%Math.max(1,Math.floor(daily.value.length/5))===0));
const donutStyle=computed(()=>{let a=0;const parts=distribution.value.slice(0,6).map((m,i)=>{const start=a;a+=Number(m.percentage||0);return `${palette[i]} ${start}% ${a}%`});return {background:`conic-gradient(${parts.join(',')||'#e8edf4 0 100%'})`}});
function spark(m:any,i:number){const base=Math.max(18,Math.min(90,m.winRate));return Array.from({length:10},(_,n)=>Math.max(12,Math.min(92,base+(Math.sin(n*1.7+i)*10)+(Number(m.profit)>=0?n*1.5:-n*1.1))));}
onMounted(load);
</script>
<style scoped>
.trends-page{background:#f5f7fb;min-height:calc(100vh - 76px);padding:38px 0 64px}.trends-wrap{max-width:1240px}.trends-hero{display:flex;justify-content:space-between;gap:30px;align-items:flex-start;margin-bottom:22px}.trends-hero h1{font-size:40px;letter-spacing:-1.4px;margin:7px 0 8px}.trends-hero p{margin:0;color:#738097;max-width:760px;font-size:14px;line-height:1.65}.trends-range{background:#fff;border:1px solid #dfe5ed;border-radius:11px;padding:11px 14px;font-weight:800;color:#24344f;min-width:160px}.trends-error{background:#fff0f3;color:#c21746;border:1px solid #ffd2de;padding:15px;border-radius:12px}.trend-kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px}.trend-kpi{min-height:118px;border:1px solid #e1e6ee;border-radius:15px;padding:16px;background:#fff;display:flex;gap:12px;align-items:flex-start;box-shadow:0 6px 22px rgba(16,26,46,.035)}.trend-kpi.pink{background:linear-gradient(145deg,#fff5f8,#fff)}.trend-kpi.green{background:linear-gradient(145deg,#f0fff9,#fff)}.trend-kpi.purple{background:linear-gradient(145deg,#f7f3ff,#fff)}.trend-kpi.blue{background:linear-gradient(145deg,#f1f8ff,#fff)}.kpi-icon{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;flex:none;background:#fbe3ec;color:#ed275f;font-weight:900;font-size:19px}.green .kpi-icon{background:#dff8ed;color:#0a9f62}.purple .kpi-icon{background:#e8defd;color:#6d4ce6}.blue .kpi-icon{background:#dfefff;color:#168ce0}.trend-kpi small,.trend-kpi em{display:block;color:#78859a;font-style:normal}.trend-kpi small{font-size:10px;font-weight:800}.trend-kpi strong{display:block;font-size:25px;letter-spacing:-.5px;margin:3px 0}.trend-kpi em{font-size:9px}.positive{color:#07945b}.negative{color:#d72b4e}.trend-main-grid{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(340px,.95fr);gap:14px;margin-bottom:14px}.trend-panel{background:#fff;border:1px solid #dfe5ed;border-radius:15px;padding:19px;box-shadow:0 6px 22px rgba(16,26,46,.035)}.trend-panel-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:15px}.trend-panel h2{margin:0;font-size:17px;letter-spacing:-.2px}.trend-panel-head p{margin:4px 0 0;color:#8a96a8;font-size:10px}.legend{display:flex;gap:15px;color:#78859a;font-size:10px}.legend span{display:flex;align-items:center;gap:5px}.dot{width:8px;height:8px;border-radius:50%;display:inline-block}.profit-dot{background:#ed4d91}.rate-dot{background:#7957e8}.chart-wrap{position:relative;padding-left:48px;padding-bottom:23px}.y-axis{position:absolute;left:0;top:3px;bottom:25px;display:flex;flex-direction:column;justify-content:space-between;color:#7c8799;font-size:9px}.trend-chart{display:block;width:100%;height:260px;overflow:visible}.grid-line{stroke:#e9edf3;stroke-width:1}.zero-line{stroke:#d4dbe5;stroke-width:1}.bar-positive{fill:#20c79a;opacity:.9}.bar-negative{fill:#ed4d91;opacity:.9}.rate-line{fill:none;stroke:#7957e8;stroke-width:3;stroke-linejoin:round;stroke-linecap:round}.rate-point{fill:#7957e8}.x-axis{position:absolute;left:48px;right:0;bottom:0;display:flex;justify-content:space-between;color:#7c8799;font-size:8px}.donut-area{display:flex;align-items:center;gap:24px;min-height:255px}.donut{width:170px;height:170px;border-radius:50%;display:grid;place-items:center;flex:none}.donut:after{content:'';position:absolute}.donut>div{width:104px;height:104px;background:#fff;border-radius:50%;display:grid;place-items:center;align-content:center;box-shadow:0 2px 12px rgba(16,26,46,.05)}.donut strong{font-size:21px}.donut span{font-size:9px;color:#8b96a7;margin-top:2px}.distribution-list{display:grid;gap:12px;flex:1}.distribution-list div{display:grid;grid-template-columns:9px 1fr auto;gap:8px;align-items:center;font-size:10px}.distribution-list i{width:8px;height:8px;border-radius:50%}.distribution-list span{color:#47556d}.distribution-list b{font-size:10px}.market-table-panel{margin-bottom:14px}.trend-action{background:#fff0f5;color:#d01a4e;padding:9px 13px;border-radius:9px;font-size:10px;font-weight:900}.market-table{overflow:auto}.market-table-head,.market-row{display:grid;grid-template-columns:1.65fr .7fr .55fr .75fr .9fr .65fr 1fr 25px;gap:12px;align-items:center;min-width:850px}.market-table-head{padding:7px 10px;color:#8a95a6;text-transform:uppercase;font-size:8px;font-weight:900;letter-spacing:.06em}.market-row{padding:10px;border-top:1px solid #edf0f4;font-size:11px}.market-name{display:flex;align-items:center;gap:9px}.market-name i{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;color:#fff;font-style:normal;font-size:9px;font-weight:900}.market-name strong{font-size:12px}.market-row>strong{font-weight:850}.spark{height:27px;display:flex;align-items:flex-end;gap:2px}.spark span{width:5px;border-radius:3px 3px 0 0;background:#7b5ae8;opacity:.8}.row-arrow{color:#78869b;font-size:17px}.explore-panel{background:linear-gradient(135deg,#fff8fb,#f8fbff);padding:22px}.explore-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:18px}.explore-head p{margin:5px 0 0;color:#718097;font-size:10px;max-width:600px}.explore-head>span{color:#ed275f;font-size:12px;font-style:italic}.explore-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}.explore-card{display:flex;gap:13px;align-items:flex-start;padding:17px;border:1px solid #e2e7ef;border-radius:13px;background:#fff}.explore-card>i{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:#fff;font-style:normal;font-weight:900;flex:none}.pink-card>i{background:#ed4d91}.purple-card>i{background:#7555e6}.blue-card>i{background:#3198ed}.explore-card strong{font-size:13px}.explore-card p{font-size:10px;color:#758197;line-height:1.6;margin:5px 0 10px}.explore-card b{font-size:9px}.pink-card b{color:#ed275f}.purple-card b{color:#7555e6}.blue-card b{color:#208edb}.trend-empty{text-align:center;color:#8792a3;padding:70px 20px;font-size:13px}
@media(max-width:1000px){.trend-kpis{grid-template-columns:repeat(3,1fr)}.trend-main-grid{grid-template-columns:1fr}.donut-area{justify-content:center}.explore-grid{grid-template-columns:1fr}}@media(max-width:650px){.trends-page{padding-top:24px}.trends-hero{display:block}.trends-hero h1{font-size:31px}.trends-range{margin-top:15px;width:100%}.trend-kpis{grid-template-columns:1fr 1fr}.trend-kpi{min-height:105px}.trend-kpi strong{font-size:20px}.trend-main-grid{display:block}.trend-panel{margin-bottom:13px}.donut-area{display:block}.donut{margin:0 auto 22px}.legend{display:none}.explore-head{display:block}.explore-head>span{display:block;margin-top:10px}}
</style>
