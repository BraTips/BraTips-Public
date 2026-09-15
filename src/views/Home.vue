<template>
  <div class="pro-home page-animate">
    <section class="home-shell wrap">
      <aside class="home-sidebar">
        <div class="side-title">BraTipsters</div>
        <RouterLink class="side-item active" to="/picks"><span>▣</span> Featured Tips</RouterLink>
        <RouterLink class="side-item" to="/dropping-odds"><span>↓</span> Dropping Odds <b>{{ dropCount }}</b></RouterLink>
        <RouterLink class="side-item" to="/matches"><span>◉</span> Matches & Odds <b>{{ matches.length }}</b></RouterLink>
        <RouterLink class="side-item" to="/bet-of-the-day"><span>✦</span> Bet of the Day <b>{{ bot.length }}</b></RouterLink>
        <RouterLink class="side-item" to="/picks"><span>⌁</span> Acca Tips</RouterLink>
        <RouterLink class="side-item" to="/picks"><span>◎</span> Over 2.5 Tips</RouterLink>
        <RouterLink class="side-item" to="/picks"><span>◌</span> BTTS Tips</RouterLink>
        <RouterLink class="side-item" to="/matches"><span>⚑</span> Corners</RouterLink>
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

        <section class="feature-feed">
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
                <span v-if="p.odds">{{ Number(p.odds).toFixed(2) }}</span>
              </div>
              <div class="row-arrow">›</div>
            </RouterLink>
            <div v-if="!bot.length" class="empty-state">No Bet of the Day picks have been published yet.</div>
          </template>
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
                <div class="compact-tip" v-if="firstOdd(m)"><small>{{ firstOdd(m).marketName || 'Market' }}</small><b>{{ firstOdd(m).label }}</b><strong>{{ Number(firstOdd(m).value).toFixed(2) }}</strong></div>
                <div class="compact-icons"><span v-if="m.odds && m.odds.length">ODDS</span><span v-if="m.status === 'live'" class="live-dot">●</span><b>›</b></div>
              </RouterLink>
              <div v-if="!displayMatches.length" class="empty-state">No matches available right now.</div>
            </template>
          </div>
        </section>

        <section class="home-panel trend-panel">
          <div class="panel-head"><div><span class="eyebrow">Market intelligence</span><h2>Prediction Trends</h2></div><RouterLink to="/picks" class="text-link">Explore tips →</RouterLink></div>
          <div v-if="trends.length" class="trend-grid">
            <RouterLink v-for="(t,i) in trends" :key="t.prediction" to="/picks" class="trend-card">
              <div class="trend-rank">#{{ i+1 }}</div><div class="trend-main"><b>{{ t.prediction }}</b><span>{{ t.tips }} settled tips · {{ Math.round(t.winRate) }}% win rate</span></div><strong :class="Number(t.profit)>=0?'positive':'negative'">{{ Number(t.profit)>=0?'+':'' }}{{ Number(t.profit).toFixed(1) }}</strong>
            </RouterLink>
          </div>
          <div v-else class="empty-state">Prediction trends will appear as tracked tips accumulate.</div>
        </section>

        <section class="tool-grid">
          <RouterLink to="/dropping-odds" class="tool-card drop-tool"><span class="tool-icon">↓</span><div><small>Market signal</small><h3>Dropping Odds</h3><p>Find selections whose prices are moving lower.</p></div><b>→</b></RouterLink>
          <RouterLink to="/bet-of-the-day" class="tool-card"><span class="tool-icon">✦</span><div><small>Daily feature</small><h3>Bet of the Day</h3><p>Follow today's highlighted BraTipsters selections.</p></div><b>→</b></RouterLink>
          <RouterLink to="/history" class="tool-card"><span class="tool-icon">↗</span><div><small>Track record</small><h3>Prediction History</h3><p>See settled picks and the public record.</p></div><b>→</b></RouterLink>
          <RouterLink to="/subscription" class="tool-card premium-tool"><span class="tool-icon">★</span><div><small>Premium</small><h3>Unlock BraTipsters</h3><p>Access deeper market and prediction research.</p></div><b>→</b></RouterLink>
        </section>
        <section class="home-info-grid">
          <RouterLink to="/how-to-use" class="home-info-card"><span class="tool-icon">?</span><div><small>Getting started</small><h3>How to use BraTipsters</h3><p>Learn how to find matches, read predictions, compare tipsters and use odds research.</p></div><b>→</b></RouterLink>
          <RouterLink to="/whats-new" class="home-info-card"><span class="tool-icon">✦</span><div><small>Latest updates</small><h3>What's New</h3><p>See the newest features, automatic Bet of the Day and improvements across the platform.</p></div><b>→</b></RouterLink>
          <RouterLink to="/faq" class="home-info-card"><span class="tool-icon">Q&A</span><div><small>Need answers?</small><h3>FAQ</h3><p>Quick answers about predictions, results, Premium, tipsters and responsible betting.</p></div><b>→</b></RouterLink>
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../services/api'
import TeamLogo from '../components/TeamLogo.vue'

const matches=ref<any[]>([]), liveMatches=ref<any[]>([]), bot=ref<any[]>([]), topTipsters=ref<any[]>([]), trends=ref<any[]>([]), dropCount=ref(0), settledWinRate=ref(0)
const displayMatches=computed(()=>[...liveMatches.value,...matches.value.filter(x=>x.status!=='live')].slice(0,8))
// Per-section loading flags: only true until that section has SOME data (cached or
// fresh) to show, so a repeat visit renders instantly from cache with no skeleton flash,
// while a first-ever visit still gets a skeleton instead of an empty page.
const loading=ref({bot:true, matches:true, tipsters:true})
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
function kickoff(v:any){return v?new Date(v).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'—'}
function kickoffTime(p:any){return kickoff(p?.matchId?.kickoff)}
function firstOdd(m:any){return Array.isArray(m?.odds)&&m.odds.length?m.odds[0]:null}
function initials(v:string){return (v||'BT').slice(0,2).toUpperCase()}
// Small win/loss strip next to each tipster: proportion of green (win) vs red (loss)
// boxes reflects their actual wins/losses ratio, not an unrelated "current streak".
function winLossDots(t:any){
  const total=10
  const wins=Number(t.wins||0), losses=Number(t.losses||0), played=wins+losses
  const greenCount=played>0 ? Math.round((wins/played)*total) : 0
  return Array.from({length:total},(_,i)=>i<greenCount)
}
onMounted(async()=>{
  // Bet of the Day + today's matches: stale-while-revalidate. Any cached copy renders
  // instantly (no skeleton), and if the background refetch comes back different, the
  // view quietly swaps it in — no reload, no flash.
  api.getSWR('/bet-of-day', (fresh:any)=>{bot.value=fresh.data||[]})
    .then((r:any)=>{bot.value=r.data||[]}).catch(()=>{}).finally(()=>{loading.value.bot=false})

  api.getSWR('/matches/today', (fresh:any)=>{matches.value=fresh.data||[]})
    .then((r:any)=>{matches.value=r.data||[]}).catch(()=>{}).finally(()=>{loading.value.matches=false})

  api.getSWR('/tipsters', (fresh:any)=>{topTipsters.value=(fresh.data||[]).slice(0,6)})
    .then((r:any)=>{topTipsters.value=(r.data||[]).slice(0,6)}).catch(()=>{}).finally(()=>{loading.value.tipsters=false})

  // Live matches, drop count and win rate change constantly, so they're intentionally
  // not cached (see cacheTtl in services/api.ts) and just load in the background.
  api.get('/matches/live').then((r:any)=>{liveMatches.value=r.data||[]}).catch(()=>{})
  api.get('/prediction-history?limit=1').then((r:any)=>{settledWinRate.value=Math.round(Number(r.stats?.winRate||0))}).catch(()=>{})
  api.getSWR('/prediction-trends', (fresh:any)=>{trends.value=fresh.data||[]}).then((r:any)=>{trends.value=r.data||[]}).catch(()=>{})
  api.get('/dropping-odds?minDrop=5').then((r:any)=>{dropCount.value=(r.data||[]).length}).catch(()=>{})
})
</script>
