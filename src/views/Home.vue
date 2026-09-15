<template>
  <div class="pro-home page-animate">
    <section class="home-shell wrap">
      <aside class="home-sidebar">
        <div class="side-title">BraTipsters</div>
        <RouterLink class="side-item active" to="/matches"><span>◉</span> Today's Matches <b>{{ matches.length }}</b></RouterLink>
        <RouterLink class="side-item" to="/matches"><span>●</span> Live Matches <b>{{ liveMatches.length }}</b></RouterLink>
        <RouterLink class="side-item" to="/picks"><span>▣</span> Latest Tips</RouterLink>
        <RouterLink class="side-item" to="/dropping-odds"><span>↓</span> Dropping Odds <b>{{ dropCount }}</b></RouterLink>
        <RouterLink class="side-item" to="/bet-of-the-day"><span>✦</span> Bet of the Day <b>{{ bot.length }}</b></RouterLink>
        <RouterLink class="side-item" to="/tipsters"><span>♙</span> Tipsters</RouterLink>
        <div class="side-divider"></div>
        <RouterLink class="side-mini" to="/history">Prediction history</RouterLink>
        <RouterLink class="side-mini" to="/subscription">Premium access</RouterLink>
      </aside>

      <main class="home-main">
        <div class="home-heading">
          <div>
            <span class="eyebrow">Football intelligence</span>
            <h1>Today's Football Matches</h1>
            <p>Live scores, fixtures, odds and BraTipsters predictions — all connected to the match centre.</p>
          </div>
          <RouterLink to="/matches" class="date-pill">Full match board <span>→</span></RouterLink>
        </div>

        <div class="signal-bar">
          <span><i class="signal-up">↗</i> <b>{{ settledWinRate }}%</b> settled win rate</span>
          <span><b>{{ liveMatches.length }}</b> live now</span>
          <span><b>{{ matches.length }}</b> today's fixtures</span>
          <span class="signal-live"><i></i> Updated live</span>
        </div>

        <section class="home-panel home-matches-panel">
          <div class="panel-head">
            <div><span class="eyebrow">Live first</span><h2>{{ liveMatches.length ? 'Live & today' : "Today's fixtures" }}</h2></div>
            <RouterLink to="/matches" class="text-link">View all matches →</RouterLink>
          </div>

          <template v-if="loading.matches">
            <div class="match-list"><div class="compact-match skeleton-row" v-for="i in 5" :key="'skm-'+i"><div class="skel skel-time"></div><div class="skel skel-teams"></div><div class="skel skel-pick"></div></div></div>
          </template>
          <template v-else>
            <div class="match-list">
              <RouterLink v-for="m in displayMatches" :key="m._id" :to="matchPath(m)" class="compact-match home-match-card">
                <div class="compact-time" :class="{ live: m.status === 'live' }">
                  <b>{{ m.status === 'live' ? 'LIVE' : kickoff(m.kickoff) }}</b>
                  <small v-if="m.status === 'live'">{{ m.homeScore ?? 0 }}:{{ m.awayScore ?? 0 }}</small>
                  <small v-else>{{ dateLabel(m.kickoff) }}</small>
                </div>
                <div class="compact-teams">
                  <span><TeamLogo :src="teamLogo(m.homeTeamId)" :name="teamName(m.homeTeamId)" size="sm"/><b>{{ teamName(m.homeTeamId) }}</b></span>
                  <span><TeamLogo :src="teamLogo(m.awayTeamId)" :name="teamName(m.awayTeamId)" size="sm"/><b>{{ teamName(m.awayTeamId) }}</b></span>
                </div>
                <div class="compact-tip" v-if="firstOdd(m)"><small>{{ firstOdd(m).marketName || 'Market' }}</small><b>{{ firstOdd(m).label }}</b><strong>{{ price(firstOdd(m).value) }}</strong></div>
                <div class="compact-icons"><span v-if="m.odds?.length">ODDS</span><span v-if="m.status === 'live'" class="live-dot">●</span><b>›</b></div>
              </RouterLink>
              <div v-if="!displayMatches.length" class="empty-state">No football matches are available right now. Check the full match board for upcoming fixtures.</div>
            </div>
          </template>
        </section>

        <section class="feature-feed home-picks">
          <div class="panel-head"><div><span class="eyebrow">Match-linked predictions</span><h2>Featured Tips</h2></div><RouterLink to="/picks" class="text-link">All tips →</RouterLink></div>
          <template v-if="loading.bot">
            <div class="feature-row skeleton-row" v-for="i in 3" :key="'sk-'+i"><div class="skel skel-time"></div><div class="skel skel-teams"></div><div class="skel skel-pick"></div></div>
          </template>
          <template v-else>
            <RouterLink v-for="p in botWithMatches" :key="p._id" :to="matchPathFromPick(p)" class="feature-row">
              <div class="feature-time"><b>{{ kickoffTime(p) }}</b><small>{{ leagueName(p) }}</small></div>
              <div class="feature-teams"><div><TeamLogo :src="homeLogo(p)" :name="homeName(p)" size="sm"/><b>{{ homeName(p) }}</b></div><span>vs</span><div><b>{{ awayName(p) }}</b><TeamLogo :src="awayLogo(p)" :name="awayName(p)" size="sm"/></div></div>
              <div class="feature-pick"><small>Featured pick</small><b>{{ p.prediction }}</b><span v-if="p.odds">{{ price(p.odds) }}</span></div>
              <div class="row-arrow">›</div>
            </RouterLink>
            <div v-if="!botWithMatches.length" class="empty-state">No featured match-linked predictions have been published yet.</div>
          </template>
        </section>

        <section class="tool-grid">
          <RouterLink to="/dropping-odds" class="tool-card drop-tool"><span class="tool-icon">↓</span><div><small>Market signal</small><h3>Dropping Odds</h3><p>Find selections whose prices are moving lower.</p></div><b>→</b></RouterLink>
          <RouterLink to="/bet-of-the-day" class="tool-card"><span class="tool-icon">✦</span><div><small>Daily feature</small><h3>Bet of the Day</h3><p>Follow today's highlighted selections.</p></div><b>→</b></RouterLink>
          <RouterLink to="/history" class="tool-card"><span class="tool-icon">↗</span><div><small>Track record</small><h3>Prediction History</h3><p>See settled picks and the public record.</p></div><b>→</b></RouterLink>
          <RouterLink to="/subscription" class="tool-card premium-tool"><span class="tool-icon">★</span><div><small>Premium</small><h3>Unlock Research</h3><p>Access deeper market and prediction research.</p></div><b>→</b></RouterLink>
        </section>
      </main>

      <aside class="home-right">
        <div class="right-heading"><div><span class="eyebrow">Performance</span><h2>Top Tipsters</h2></div><RouterLink to="/tipsters">All →</RouterLink></div>
        <template v-if="loading.tipsters"><div class="tipster-stat-card skeleton-row" v-for="i in 4" :key="'skt-'+i"><div class="skel skel-avatar"></div><div class="skel skel-teams"></div></div></template>
        <template v-else>
          <RouterLink v-for="t in topTipsters" :key="t._id" :to="'/tipsters/' + t.username" class="tipster-stat-card">
            <div class="tipster-avatar">{{ initials(t.username) }}</div>
            <div class="tipster-info"><b>{{ t.username }}</b><small>{{ t.wins || 0 }} wins · {{ t.losses || 0 }} losses</small><div class="streak"><span v-for="(isWin, i) in winLossDots(t)" :key="i" :class="isWin ? 'w' : 'l'">{{ isWin ? 'W' : 'L' }}</span></div></div>
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
import {computed,onMounted,ref} from 'vue'
import {RouterLink} from 'vue-router'
import {api} from '../services/api'
import TeamLogo from '../components/TeamLogo.vue'

const matches=ref<any[]>([]),liveMatches=ref<any[]>([]),bot=ref<any[]>([]),topTipsters=ref<any[]>([]),dropCount=ref(0),settledWinRate=ref(0)
const loading=ref({bot:true,matches:true,tipsters:true})
const displayMatches=computed(()=>[...liveMatches.value,...matches.value.filter(x=>x.status!=='live')].filter(x=>x?._id).slice(0,10))
const botWithMatches=computed(()=>bot.value.filter(p=>matchId(p)))
function teamName(t:any){return t?.name||'Team'}
function teamLogo(t:any){return t?.logo||''}
function homeTeam(p:any){return p?.matchId?.homeTeamId||{}}
function awayTeam(p:any){return p?.matchId?.awayTeamId||{}}
function homeName(p:any){return teamName(homeTeam(p))}
function awayName(p:any){return teamName(awayTeam(p))}
function homeLogo(p:any){return teamLogo(homeTeam(p))}
function awayLogo(p:any){return teamLogo(awayTeam(p))}
function matchId(p:any){return String(p?.matchId?._id||p?.matchId||'').trim()}
function matchPath(p:any){return p?._id?`/matches/${encodeURIComponent(String(p._id))}`:'/matches'}
function matchPathFromPick(p:any){const id=matchId(p);return id?`/matches/${encodeURIComponent(id)}`:'/picks'}
function leagueName(p:any){return p?.matchId?.leagueId?.name||p?.league||'Football'}
function kickoff(v:any){return v?new Date(v).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'—'}
function dateLabel(v:any){return v?new Date(v).toLocaleDateString([], {weekday:'short',day:'2-digit',month:'short'}):'—'}
function kickoffTime(p:any){return kickoff(p?.matchId?.kickoff)}
function firstOdd(m:any){return Array.isArray(m?.odds)&&m.odds.length?m.odds[0]:null}
function price(v:any){return Number(v)>0?Number(v).toFixed(2):'—'}
function initials(v:string){return (v||'BT').slice(0,2).toUpperCase()}
function winLossDots(t:any){const total=10,wins=Number(t.wins||0),losses=Number(t.losses||0),played=wins+losses,greenCount=played>0?Math.round((wins/played)*total):0;return Array.from({length:total},(_,i)=>i<greenCount)}
onMounted(async()=>{
  api.getSWR('/matches/today',(d:any)=>{matches.value=(d.data||[]).filter((m:any)=>m?._id)}).then((d:any)=>{matches.value=(d.data||[]).filter((m:any)=>m?._id)}).catch(()=>{}).finally(()=>loading.value.matches=false)
  api.getSWR('/bet-of-day',(d:any)=>{bot.value=d.data||[]}).then((d:any)=>{bot.value=d.data||[]}).catch(()=>{}).finally(()=>loading.value.bot=false)
  api.getSWR('/tipsters',(d:any)=>{topTipsters.value=(d.data||[]).slice(0,6)}).then((d:any)=>{topTipsters.value=(d.data||[]).slice(0,6)}).catch(()=>{}).finally(()=>loading.value.tipsters=false)
  api.get('/matches/live').then((d:any)=>{liveMatches.value=(d.data||[]).filter((m:any)=>m?._id)}).catch(()=>{})
  api.get('/prediction-history?limit=1').then((d:any)=>{settledWinRate.value=Math.round(Number(d.stats?.winRate||0))}).catch(()=>{})
  api.get('/dropping-odds?minDrop=5').then((d:any)=>{dropCount.value=(d.data||[]).length}).catch(()=>{})
})
</script>
