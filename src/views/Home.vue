<template>
  <div class="pro-home page-animate">
    <section class="home-shell wrap">
      <aside class="home-sidebar">
        <div class="side-title">BraTipsters</div>
        <RouterLink class="side-item active" to="/picks"><span>▣</span> Featured Tips</RouterLink>
        <RouterLink class="side-item" to="/dropping-odds"><span>↓</span> Dropping Odds <b>{{ dropCount }}</b></RouterLink>
        <RouterLink class="side-item" to="/matches"><span>◉</span> Matches & Odds <b>{{ matches.length }}</b></RouterLink>
        <RouterLink class="side-item" to="/bet-of-the-day"><span>✦</span> Bet of the Day <b>{{ bot.length }}</b></RouterLink>
        <RouterLink class="side-item" to="/acca-tips"><span>⌁</span> Acca Tips</RouterLink>
        <RouterLink class="side-item" to="/over-2-5-tips"><span>◎</span> Over 2.5 Tips</RouterLink>
        <RouterLink class="side-item" to="/double-chance-tips"><span>◇</span> Double Chance</RouterLink>
        <RouterLink class="side-item" to="/btts-tips"><span>◌</span> BTTS Tips</RouterLink>
        <RouterLink class="side-item" to="/corners-tips"><span>⚑</span> Corners</RouterLink>
        <RouterLink class="side-item" to="/tipsters"><span>♙</span> Tipsters</RouterLink>
        <div class="side-divider"></div>
        <RouterLink class="side-mini" to="/history">Prediction history</RouterLink>
        <RouterLink class="side-mini" to="/subscription">Premium access</RouterLink>
      </aside>

      <main class="home-main">
        <div class="home-heading">
          <div>
            <span class="eyebrow">Football intelligence</span>
            <h1>Featured Football Tips</h1>
            <p>Live matches, odds movement and transparent prediction records.</p>
          </div>
          <RouterLink to="/matches" class="date-pill">Today <span>→</span></RouterLink>
        </div>

        <div class="signal-bar">
          <span><i class="signal-up">↗</i> <b>{{ settledWinRate }}%</b> settled win rate</span>
          <span><b>{{ liveMatches.length }}</b> live now</span>
          <span><b>{{ bot.length }}</b> featured today</span>
          <span class="signal-live"><i></i> Updated live</span>
        </div>

        <section class="home-panel tipster-predictions-panel">
          <div class="panel-head">
            <div><span class="eyebrow">From our tipsters</span><h2>Tipster Predictions</h2><p class="panel-subcopy">Selections published by approved tipsters. Premium picks are clearly marked and locked for non-subscribers.</p></div>
            <RouterLink to="/tipsters" class="text-link">Explore tipsters →</RouterLink>
          </div>
          <div v-if="loading.tipstersPredictions" class="weekly-prediction-list">
            <div class="weekly-prediction-row skeleton-row" v-for="i in 4" :key="'sktp-'+i"><div class="skel skel-time"></div><div class="skel skel-teams"></div><div class="skel skel-pick"></div></div>
          </div>
          <div v-else-if="tipsterPredictions.length" class="weekly-prediction-list">
            <RouterLink v-for="p in tipsterPredictions" :key="p._id" :to="`/tipster-predictions/${p._id}`" class="weekly-prediction-row">
              <div class="weekly-date"><b>{{ predictionDate(p) }}</b><small>{{ predictionTime(p) }}</small></div>
              <div class="weekly-fixture">
                <div><TeamLogo :src="predictionHomeLogo(p)" :name="predictionHomeName(p)" size="sm"/><b>{{ predictionHomeName(p) }}</b></div>
                <span>vs</span>
                <div><b>{{ predictionAwayName(p) }}</b><TeamLogo :src="predictionAwayLogo(p)" :name="predictionAwayName(p)" size="sm"/></div>
                <small>{{ p.tipsterId?.name || 'Tipster' }} · {{ p.league || p.matchId?.leagueId?.name || 'Football' }}</small>
              </div>
              <div class="weekly-pick" :class="{locked:p.locked}">
                <span :class="{ 'premium-badge': p.isPremium }">{{ p.isPremium ? '♛ PREMIUM' : 'TIPSTER PICK' }}</span>
                <b>{{ p.locked ? 'Premium prediction' : p.prediction }}</b>
                <strong v-if="!p.locked && p.odds">{{ formatOdds(p.odds) }}</strong>
                <strong v-else>🔒</strong>
              </div>
              <div class="weekly-arrow">›</div>
            </RouterLink>
            <div class="weekly-more"><RouterLink to="/predictions">View all published predictions →</RouterLink></div>
          </div>
          <div v-else class="empty-state">No upcoming tipster predictions have been published yet.</div>
        </section>

        <section class="home-panel bot-home-panel">
          <div class="panel-head">
            <div><span class="eyebrow">Daily feature</span><h2>Bet of the Day</h2><p class="panel-subcopy">Today's highlighted selection from BraTipsters, with the market, odds and fixture clearly shown.</p></div>
            <RouterLink to="/bet-of-the-day" class="text-link">View Bet of the Day →</RouterLink>
          </div>
          <div class="feature-feed">
          <template v-if="loading.bot">
            <div class="feature-row skeleton-row" v-for="i in 3" :key="'sk-'+i">
              <div class="skel skel-time"></div><div class="skel skel-teams"></div><div class="skel skel-pick"></div>
            </div>
          </template>
          <template v-else>
            <RouterLink v-for="p in bot" :key="p._id" :to="'/matches/' + matchId(p)" class="feature-row">
              <div class="feature-time">
                <b>{{ kickoffTime(p) }}</b>
                <small>{{ leagueName(p) }}</small>
              </div>
              <div class="feature-teams">
                <div><TeamLogo :src="homeLogo(p)" :name="homeName(p)" size="sm"/><b>{{ homeName(p) }}</b></div>
                <span>vs</span>
                <div><b>{{ awayName(p) }}</b><TeamLogo :src="awayLogo(p)" :name="awayName(p)" size="sm"/></div>
              </div>
              <div class="feature-pick">
                <small>Bet of the Day</small>
                <b>{{ p.prediction }}</b>
                <span v-if="p.odds">{{ formatOdds(p.odds) }}</span>
              </div>
              <div class="row-arrow">›</div>
            </RouterLink>
            <div v-if="!bot.length" class="empty-state">No Bet of the Day picks have been published yet.</div>
          </template>
          </div>
        </section>

        <section class="home-panel weekly-predictions-panel">
          <div class="panel-head">
            <div><span class="eyebrow">This week</span><h2>All Weekly Predictions</h2><p class="panel-subcopy">Staff/model picks for this week's fixtures. Premium selections stay locked until you subscribe.</p></div>
            <RouterLink to="/predictions" class="text-link">View all predictions →</RouterLink>
          </div>
          <div v-if="loading.weekly" class="weekly-prediction-list">
            <div class="weekly-prediction-row skeleton-row" v-for="i in 6" :key="'skw-'+i"><div class="skel skel-time"></div><div class="skel skel-teams"></div><div class="skel skel-pick"></div></div>
          </div>
          <div v-else-if="weeklyPredictions.length" class="weekly-prediction-list">
            <RouterLink v-for="p in weeklyPredictions" :key="p._id" :to="`/tipster-predictions/${p._id}`" class="weekly-prediction-row">
              <div class="weekly-date"><b>{{ predictionDate(p) }}</b><small>{{ predictionTime(p) }}</small></div>
              <div class="weekly-fixture">
                <div><TeamLogo :src="predictionHomeLogo(p)" :name="predictionHomeName(p)" size="sm"/><b>{{ predictionHomeName(p) }}</b></div>
                <span>vs</span>
                <div><b>{{ predictionAwayName(p) }}</b><TeamLogo :src="predictionAwayLogo(p)" :name="predictionAwayName(p)" size="sm"/></div>
                <small>{{ p.league || p.matchId?.leagueId?.name || 'Football' }}</small>
              </div>
              <div class="weekly-pick" :class="{locked:p.locked}">
                <span :class="{ 'premium-badge': p.isPremium }">{{ p.isPremium ? '♛ PREMIUM' : (p.systemGenerated ? 'BRATIPSTERS MODEL' : 'TIPSTER PICK') }}</span>
                <b>{{ p.locked ? 'Premium prediction' : p.prediction }}</b>
                <strong v-if="!p.locked && p.odds">{{ formatOdds(p.odds) }}</strong>
                <strong v-else>🔒</strong>
              </div>
              <div class="weekly-arrow">›</div>
            </RouterLink>
            <div class="weekly-more">{{ weeklyPredictions.length }} predictions scheduled for this week. <RouterLink to="/predictions">Open the full prediction feed →</RouterLink></div>
          </div>
          <div v-else class="empty-state">No published predictions are available for this week's fixtures yet. The feed will populate automatically as weekly predictions are generated.</div>
        </section>

        <section class="home-panel">
          <div class="panel-head"><div><span class="eyebrow">Live & upcoming</span><h2>More Tips, Stats & Live Scores</h2></div><RouterLink to="/matches" class="text-link">View all matches →</RouterLink></div>
          <div class="match-list">
            <template v-if="loading.matches">
              <div class="compact-match skeleton-row" v-for="i in 4" :key="'skm-'+i">
                <div class="skel skel-time"></div><div class="skel skel-teams"></div><div class="skel skel-pick"></div>
              </div>
            </template>
            <template v-else>
              <RouterLink v-for="m in displayMatches" :key="m._id" :to="'/matches/' + m._id" class="compact-match">
                <div class="compact-time" :class="{ live: m.status === 'live' }"><b>{{ m.status === 'live' ? 'LIVE' : kickoff(m.kickoff) }}</b><small v-if="m.status === 'live'">{{ m.homeScore }}:{{ m.awayScore }}</small></div>
                <div class="compact-teams"><span><TeamLogo :src="teamLogo(m.homeTeamId)" :name="teamName(m.homeTeamId)" size="sm"/>{{ teamName(m.homeTeamId) }}</span><span><TeamLogo :src="teamLogo(m.awayTeamId)" :name="teamName(m.awayTeamId)" size="sm"/>{{ teamName(m.awayTeamId) }}</span></div>
                <div class="compact-tip" v-if="firstOdd(m)"><small>{{ m.status === 'live' ? 'BraTipsters Odds' : (firstOdd(m).marketName || 'Market') }}</small><b>{{ firstOdd(m).label }}</b><strong>{{ formatOdds(firstOdd(m).value) }}</strong></div>
                <div class="compact-icons"><span v-if="m.odds && m.odds.length">ODDS</span><span v-if="m.status === 'live'" class="live-dot">●</span><b>›</b></div>
              </RouterLink>
              <div v-if="!displayMatches.length" class="empty-state">No matches available right now.</div>
            </template>
          </div>
        </section>

        <section class="tool-grid">
          <RouterLink to="/dropping-odds" class="tool-card drop-tool"><span class="tool-icon">↓</span><div><small>Market signal</small><h3>Dropping Odds</h3><p>Find selections whose prices are moving lower.</p></div><b>→</b></RouterLink>
          <RouterLink to="/bet-of-the-day" class="tool-card"><span class="tool-icon">✦</span><div><small>Daily feature</small><h3>Bet of the Day</h3><p>Follow today's highlighted BraTipsters selections.</p></div><b>→</b></RouterLink>
          <RouterLink to="/history" class="tool-card"><span class="tool-icon">↗</span><div><small>Track record</small><h3>Prediction History</h3><p>See settled picks and the public record.</p></div><b>→</b></RouterLink>
          <RouterLink to="/subscription" class="tool-card premium-tool"><span class="tool-icon">★</span><div><small>Premium</small><h3>Unlock BraTipsters</h3><p>Access deeper market and prediction research.</p></div><b>→</b></RouterLink>
        </section>
      </main>

      <aside class="home-right">
        <div class="right-heading"><div><span class="eyebrow">Performance</span><h2>Tipster Stats</h2></div><RouterLink to="/tipsters">All →</RouterLink></div>
        <template v-if="loading.tipsters">
          <div class="tipster-stat-card skeleton-row" v-for="i in 4" :key="'skt-'+i">
            <div class="skel skel-avatar"></div><div class="skel skel-teams"></div>
          </div>
        </template>
        <template v-else>
          <RouterLink v-for="t in topTipsters" :key="t._id" :to="'/tipsters/' + t.username" class="tipster-stat-card">
            <div class="tipster-avatar">{{ initials(t.username) }}</div>
            <div class="tipster-info"><b>{{ t.username }}</b><small>{{ t.wins || 0 }} wins · {{ t.losses || 0 }} losses</small><div class="streak" :title="(t.wins||0)+' wins, '+(t.losses||0)+' losses'"><span v-for="(isWin, i) in winLossDots(t)" :key="i" :class="isWin ? 'w' : 'l'">{{ isWin ? 'W' : 'L' }}</span></div></div>
            <strong :class="Number(t.roi || 0) >= 0 ? 'positive' : 'negative'">{{ Number(t.roi || 0) >= 0 ? '+' : '' }}{{ Number(t.roi || 0).toFixed(1) }}%</strong>
          </RouterLink>
          <div v-if="!topTipsters.length" class="empty-state">Tipster performance will appear here as results accumulate.</div>
        </template>
        <div class="premium-callout"><span>★</span><div><b>Go deeper with Premium</b><p>Match research, market intelligence and premium picks.</p><RouterLink to="/subscription">See plans →</RouterLink></div></div>
      </aside>
    </section>

    <section class="home-explore wrap" aria-labelledby="explore-bratipsters-title">
      <div class="home-explore-head">
        <div>
          <span class="eyebrow">⚡ Explore BraTipsters</span>
          <h2 id="explore-bratipsters-title">Get more from BraTipsters</h2>
          <p>Helpful guides, the latest updates and quick answers to help you get the most out of the platform.</p>
        </div>
        <span class="home-explore-tag">Better insights. Smarter bets.</span>
      </div>
      <div class="home-explore-grid">
        <RouterLink to="/how-to-use" class="home-explore-card explore-pink">
          <span class="home-explore-icon">▮</span>
          <div><strong>How to use BraTipsters</strong><p>Learn how to find matches, read predictions, compare tipsters and use odds research.</p><b>Start Guide →</b></div>
        </RouterLink>
        <RouterLink to="/whats-new" class="home-explore-card explore-purple">
          <span class="home-explore-icon">◆</span>
          <div><strong>What's New</strong><p>See the latest features, automatic Bet of the Day and improvements across the platform.</p><b>View Updates →</b></div>
        </RouterLink>
        <RouterLink to="/faq" class="home-explore-card explore-blue">
          <span class="home-explore-icon">?</span>
          <div><strong>FAQ</strong><p>Quick answers about predictions, results, Premium, tipsters and responsible betting.</p><b>Get Answers →</b></div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../services/api'
import TeamLogo from '../components/TeamLogo.vue'
import { formatDate, formatOdds, formatTime } from '../utils/formatters'

const matches=ref<any[]>([]), liveMatches=ref<any[]>([]), bot=ref<any[]>([]), tipsterPredictions=ref<any[]>([]), weeklyPredictions=ref<any[]>([]), topTipsters=ref<any[]>([]), dropCount=ref(0), settledWinRate=ref(0)
const displayMatches=computed(()=>[...liveMatches.value,...matches.value.filter(x=>x.status!=='live')].slice(0,8))
// Per-section loading flags: only true until that section has SOME data (cached or
// fresh) to show, so a repeat visit renders instantly from cache with no skeleton flash,
// while a first-ever visit still gets a skeleton instead of an empty page.
const loading=ref({bot:true, matches:true, weekly:true, tipsters:true, tipstersPredictions:true})
function teamName(t:any){return t?.name||'Team'}
function teamLogo(t:any){return t?.logo||''}
function homeTeam(p:any){return p?.matchId?.homeTeamId||{}}
function awayTeam(p:any){return p?.matchId?.awayTeamId||{}}
function homeName(p:any){return teamName(homeTeam(p))}
function awayName(p:any){return teamName(awayTeam(p))}
function homeLogo(p:any){return teamLogo(homeTeam(p))}
function awayLogo(p:any){return teamLogo(awayTeam(p))}
function matchId(p:any){return p?.matchId?._id||''}
function leagueName(p:any){return p?.matchId?.leagueId?.name||p?.league||'Football'}
function kickoff(v:any){return formatTime(v)}
function kickoffTime(p:any){return kickoff(p?.matchId?.kickoff)}
function firstOdd(m:any){return Array.isArray(m?.odds)&&m.odds.length?m.odds[0]:null}
function initials(v:string){return (v||'BT').slice(0,2).toUpperCase()}
// Small win/loss strip next to each tipster: proportion of green (win) vs red (loss)
// boxes reflects their actual wins/losses ratio, not an unrelated "current streak".
function predictionMatch(p:any){return p?.matchId||{}}
function predictionHomeName(p:any){return predictionMatch(p)?.homeTeamId?.shortName||predictionMatch(p)?.homeTeamId?.name||'Home'}
function predictionAwayName(p:any){return predictionMatch(p)?.awayTeamId?.shortName||predictionMatch(p)?.awayTeamId?.name||'Away'}
function predictionHomeLogo(p:any){return predictionMatch(p)?.homeTeamId?.logo||''}
function predictionAwayLogo(p:any){return predictionMatch(p)?.awayTeamId?.logo||''}
function predictionDate(p:any){const d=predictionMatch(p)?.kickoff||p?.kickoff||p?.publishedAt;return formatDate(d)}
function predictionTime(p:any){const d=predictionMatch(p)?.kickoff||p?.kickoff;return d?formatTime(d):'TBC'}
function winLossDots(t:any){
  const total=10
  const wins=Number(t.wins||0), losses=Number(t.losses||0), played=wins+losses
  const greenCount=played>0 ? Math.round((wins/played)*total) : 0
  return Array.from({length:total},(_,i)=>i<greenCount)
}
let liveTimer:number|undefined
async function loadLiveMatches(){try{const r=await api.get('/matches/live');liveMatches.value=r.data||[]}catch{}}
onMounted(async()=>{
  // Bet of the Day + today's matches: stale-while-revalidate. Any cached copy renders
  // instantly (no skeleton), and if the background refetch comes back different, the
  // view quietly swaps it in — no reload, no flash.
  api.getSWR('/bet-of-day', (fresh:any)=>{bot.value=fresh.data||[]})
    .then((r:any)=>{bot.value=r.data||[]}).catch(()=>{}).finally(()=>{loading.value.bot=false})

  api.getSWR('/matches/today', (fresh:any)=>{matches.value=fresh.data||[]})
    .then((r:any)=>{matches.value=r.data||[]}).catch(()=>{}).finally(()=>{loading.value.matches=false})

  api.get('/predictions?limit=50&tipster=true&upcoming=true&refresh=1')
    .then((r:any)=>{tipsterPredictions.value=(r.data||[]).slice(0,8)})
    .catch(()=>{})
    .finally(()=>{loading.value.tipstersPredictions=false})

  api.get('/predictions?limit=50&horizon=weekly&refresh=1')
    .then(async(r:any)=>{
      const first=r.data||[]; weeklyPredictions.value=first;
      const pages=Math.min(Number(r.pagination?.pages||1),5);
      if(pages>1){
        const rest=await Promise.all(Array.from({length:pages-1},(_,i)=>api.get(`/predictions?limit=50&horizon=weekly&page=${i+2}&refresh=1`)).map(x=>x.catch(()=>({data:[]}))));
        weeklyPredictions.value=[...first,...rest.flatMap((x:any)=>x.data||[])];
      }
    }).catch(()=>{}).finally(()=>{loading.value.weekly=false})

  api.getSWR('/tipsters', (fresh:any)=>{topTipsters.value=(fresh.data||[]).slice(0,6)})
    .then((r:any)=>{topTipsters.value=(r.data||[]).slice(0,6)}).catch(()=>{}).finally(()=>{loading.value.tipsters=false})

  // Live matches, drop count and win rate change constantly, so they're intentionally
  // not cached (see cacheTtl in services/api.ts) and just load in the background.
  loadLiveMatches()
  liveTimer=window.setInterval(loadLiveMatches,60_000)
  api.get('/prediction-history?limit=1').then((r:any)=>{settledWinRate.value=Math.round(Number(r.stats?.winRate||0))}).catch(()=>{})
  api.get('/dropping-odds?minDrop=5').then((r:any)=>{dropCount.value=(r.data||[]).length}).catch(()=>{})
})
onUnmounted(()=>{if(liveTimer!==undefined)window.clearInterval(liveTimer)})
</script>
