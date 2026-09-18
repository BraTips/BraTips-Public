<template>
  <div class="pro-page page-animate">
    <div class="wrap">
      <section class="football-hero bot-hero">
        <div>
          <span class="eyebrow">BraTipsters daily intelligence</span>
          <h1>Bet of the Day</h1>
          <p>Featured football selections with explicit markets, model confidence and a direct route into the Match Centre.</p>
        </div>
      </section>

      <section v-if="items.length" class="bot-grid">
        <article v-for="p in items" :key="p._id" class="bot-pro-card">
          <RouterLink :to="betPath(p)" class="bot-card-link">
            <div class="bot-card-top">
              <span class="tag">{{ p.risk || 'Featured' }}</span>
              <span v-if="p.status === 'won'" class="result-badge won">WON</span>
              <span v-else-if="p.status === 'lost'" class="result-badge lost">LOST</span>
              <span v-else class="live-label">FEATURED</span>
            </div>
            <div class="bot-fixture">
              <div>
                <TeamLogo :src="p.matchId?.homeTeamId?.logo" :name="p.matchId?.homeTeamId?.name" size="lg" />
                <b>{{ p.matchId?.homeTeamId?.name || 'Home' }}</b>
              </div>
              <span>VS</span>
              <div>
                <TeamLogo :src="p.matchId?.awayTeamId?.logo" :name="p.matchId?.awayTeamId?.name" size="lg" />
                <b>{{ p.matchId?.awayTeamId?.name || 'Away' }}</b>
              </div>
            </div>
            <div class="bot-selection">
              <small>Recommended market</small>
              <strong>{{ p.prediction }}</strong>
              <span v-if="p.odds">Reference odds <b>{{ formatOdds(p.odds) }}</b></span>
            </div>
            <div class="bot-card-stats">
              <div><span>Confidence</span><b>{{ p.confidence || '-' }}%</b></div>
              <div><span>Model</span><b>{{ p.model || 'AI model' }}</b></div>
              <div><span>Status</span><b>{{ p.status }}</b></div>
            </div>
            <p>{{ p.analysis || 'Featured football selection from the BraTipsters model.' }}</p>
          </RouterLink>
          <div class="bot-card-actions">
            <RouterLink :to="betPath(p)" class="bot-open">Open match intelligence &rarr;</RouterLink>
            <button class="bot-share-button" type="button" @click="shareBet(p)">Share</button>
          </div>
        </article>
      </section>

      <EmptyState v-else title="Bet of the Day is not published yet" message="There is no featured selection available right now. Check back when the next football slate is reviewed." icon="★" />

      <section class="recent-results-card">
        <div class="pro-section-head bot-results-head">
          <div>
            <span class="eyebrow">Recently played</span>
            <h2>Past Bet of the Day results</h2>
            <p>Review the latest settled featured selections and their final scores.</p>
          </div>
          <RouterLink to="/history" class="bot-results-link">All prediction history &rarr;</RouterLink>
        </div>
        <div v-if="recent.length" class="recent-result-grid">
          <RouterLink v-for="p in recent" :key="p._id" :to="betPath(p)" class="recent-result-card">
            <div class="recent-result-card-head">
              <span :class="['result-badge', p.status]">{{ String(p.status).toUpperCase() }}</span>
              <span class="recent-card-arrow">&rarr;</span>
            </div>
            <div class="recent-result-teams">
              <div>
                <TeamLogo :src="p.matchId?.homeTeamId?.logo" :name="p.matchId?.homeTeamId?.name" size="xs" />
                <b>{{ p.matchId?.homeTeamId?.shortName || p.matchId?.homeTeamId?.name || 'Home' }}</b>
              </div>
              <strong v-if="p.matchId?.status === 'finished'" class="recent-score">{{ p.matchId?.homeScore }} : {{ p.matchId?.awayScore }}</strong>
              <span v-else>vs</span>
              <div>
                <b>{{ p.matchId?.awayTeamId?.shortName || p.matchId?.awayTeamId?.name || 'Away' }}</b>
                <TeamLogo :src="p.matchId?.awayTeamId?.logo" :name="p.matchId?.awayTeamId?.name" size="xs" />
              </div>
              <small>{{ p.prediction }}</small>
            </div>
            <div class="recent-result-card-foot">
              <span>Odds</span>
              <strong class="recent-odds">{{ formatOdds(p.odds) }}</strong>
            </div>
          </RouterLink>
        </div>
        <EmptyState v-else title="No Bet of the Day results yet" message="Played featured selections will appear here automatically after results are settled." icon="✓" compact />
      </section>

      <section class="bot-disclaimer">
        <span>i</span>
        <p>Bet of the Day is informational and does not guarantee a result. Always review the full Match Centre before making decisions.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../services/api'
import TeamLogo from '../components/TeamLogo.vue'
import EmptyState from '../components/EmptyState.vue'
import { formatOdds } from '../utils/formatters'
import { useToast } from '../composables/feedback'
import { shareOrCopy } from '../utils/share'

const items = ref<any[]>([])
const recent = ref<any[]>([])
const { show: toast } = useToast()

const betPath = (p: any) => {
  if (!p.matchId?._id) return '/bet-of-the-day'
  return p._id ? `/matches/${p.matchId._id}?prediction=${p._id}` : `/matches/${p.matchId._id}`
}

function fixtureName(p: any) {
  return `${p.matchId?.homeTeamId?.name || 'Home'} vs ${p.matchId?.awayTeamId?.name || 'Away'}`
}

async function shareBet(p: any) {
  try {
    const selection = p.prediction || 'Bet of the Day'
    const odds = p.odds ? ` at odds ${formatOdds(p.odds)}` : ''
    const result = await shareOrCopy({
      title: `BraTipsters Bet of the Day: ${selection}`,
      text: `${fixtureName(p)}: ${selection}${odds}`,
      url: betPath(p),
    })
    if (result === 'copied') toast('Bet of the Day link copied to your clipboard.', 'success', 'Share bet')
  } catch {
    toast('This Bet of the Day link could not be shared.', 'error', 'Share bet')
  }
}

onMounted(async () => {
  try {
    const d = await api.get('/bet-of-day')
    items.value = (d.data || []).filter((x: any) => ['published', 'won', 'lost', 'void'].includes(x.status))
  } catch {
    toast('The featured selection could not be loaded.', 'error', 'Bet of the Day')
  }

  try {
    const d = await api.get('/bet-of-day/recent?limit=8')
    recent.value = d.data || []
  } catch {
    toast('Recent featured results could not be loaded.', 'error', 'Bet of the Day')
  }
})
</script>

<style scoped>
.bot-card-link{display:block;color:inherit}
.bot-card-actions{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px}
.bot-share-button{border:1px solid #dfe5ed;border-radius:9px;background:#fff;color:#4f5d73;cursor:pointer;font-size:12px;font-weight:900;padding:8px 12px}
.bot-share-button:hover{border-color:#ed275f;color:#ed275f}
@media(max-width:600px){
  .bot-card-actions{align-items:stretch;flex-direction:column}
  .bot-share-button{width:100%;min-height:40px}
}
</style>
