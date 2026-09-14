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
        </section>

        <section class="home-panel">
          <div class="panel-head"><div><span class="eyebrow">Live & upcoming</span><h2>More Tips, Stats & Live Scores</h2></div><RouterLink to="/matches" class="text-link">View all matches →</RouterLink></div>
          <div class="match-list">
            <RouterLink v-for="m in displayMatches" :key="m._id" :to="'/matches/' + m._id" class="compact-match">
              <div class="compact-time" :class="{ live: m.status === 'live' }"><b>{{ m.status === 'live' ? 'LIVE' : kickoff(m.kickoff) }}</b><small v-if="m.status === 'live'">{{ m.homeScore }}:{{ m.awayScore }}</small></div>
              <div class="compact-teams"><span><TeamLogo :src="teamLogo(m.homeTeamId)" :name="teamName(m.homeTeamId)" size="sm"/>{{ teamName(m.homeTeamId) }}</span><span><TeamLogo :src="teamLogo(m.awayTeamId)" :name="teamName(m.awayTeamId)" size="sm"/>{{ teamName(m.awayTeamId) }}</span></div>
              <div class="compact-tip" v-if="firstOdd(m)"><small>{{ firstOdd(m).marketName || 'Market' }}</small><b>{{ firstOdd(m).label }}</b><strong>{{ Number(firstOdd(m).value).toFixed(2) }}</strong></div>
              <div class="compact-icons"><span v-if="m.odds && m.odds.length">ODDS</span><span v-if="m.status === 'live'" class="live-dot">●</span><b>›</b></div>
            </RouterLink>
            <div v-if="!displayMatches.length" class="empty-state">No matches available right now.</div>
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
        <RouterLink v-for="t in topTipsters" :key="t._id" :to="'/tipsters/' + t.username" class="tipster-stat-card">
          <div class="tipster-avatar">{{ initials(t.username) }}</div>
          <div class="tipster-info"><b>{{ t.username }}</b><small>{{ t.wins || 0 }} wins · {{ t.losses || 0 }} losses</small><div class="streak"><span v-for="i in streakDots(t)" :key="i" :class="i <= Number(t.currentStreak || 0) ? 'w' : 'l'">{{ i <= Number(t.currentStreak || 0) ? 'W' : '·' }}</span></div></div>
          <strong :class="Number(t.roi || 0) >= 0 ? 'positive' : 'negative'">{{ Number(t.roi || 0) >= 0 ? '+' : '' }}{{ Number(t.roi || 0).toFixed(1) }}%</strong>
        </RouterLink>
        <div v-if="!topTipsters.length" class="empty-state">Tipster performance will appear here as results accumulate.</div>
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

const matches=ref<any[]>([]), liveMatches=ref<any[]>([]), bot=ref<any[]>([]), topTipsters=ref<any[]>([]), dropCount=ref(0), settledWinRate=ref(0)
const displayMatches=computed(()=>[...liveMatches.value,...matches.value.filter(x=>x.status!=='live')].slice(0,8))
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
function streakDots(t:any){return Array.from({length:10},(_,i)=>i+1)}
onMounted(async()=>{
  const [m,l,b,t,h]=await Promise.allSettled([api.get('/matches/today'),api.get('/matches/live'),api.get('/bet-of-day'),api.get('/tipsters'),api.get('/prediction-history?limit=1')])
  if(m.status==='fulfilled')matches.value=m.value.data||[]
  if(l.status==='fulfilled')liveMatches.value=l.value.data||[]
  if(b.status==='fulfilled')bot.value=b.value.data||[]
  if(t.status==='fulfilled')topTipsters.value=(t.value.data||[]).slice(0,6)
  if(h.status==='fulfilled')settledWinRate.value=Math.round(Number(h.value.stats?.winRate||0))
  try{const d=await api.get('/dropping-odds?minDrop=5');dropCount.value=(d.data||[]).length}catch{}
})
</script>
