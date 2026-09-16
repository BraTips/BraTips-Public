<template>
  <article class="card tip-card bt-card">
    <div class="tip-top"><span class="tag">{{ pick.league || 'Football' }}</span><div class="tip-status"><span v-if="pick.status === 'won'" class="result-badge won">WON</span><span v-else-if="pick.status === 'lost'" class="result-badge lost">LOST</span><span v-else-if="pick.status === 'void'" class="result-badge void">VOID</span><span v-else class="status-badge published">PUBLISHED</span><span v-if="pick.isPremium" class="confidence premium-lock">PREMIUM TIP</span><span v-else-if="pick.confidence" class="confidence">{{ pick.confidence }}%</span></div></div>
    <div v-if="pick.matchId?.homeTeamId || pick.matchId?.awayTeamId" class="fixture-teams"><div><TeamLogo :src="pick.matchId?.homeTeamId?.logo" :name="pick.matchId?.homeTeamId?.name" size="sm"/><b>{{ pick.matchId?.homeTeamId?.shortName || pick.matchId?.homeTeamId?.name || fixture }}</b></div><span v-if="pick.matchId?.status === 'finished'" class="feed-score">{{ pick.matchId?.homeScore }} : {{ pick.matchId?.awayScore }}</span><span v-else>vs</span><div><b>{{ pick.matchId?.awayTeamId?.shortName || pick.matchId?.awayTeamId?.name || 'Away' }}</b><TeamLogo :src="pick.matchId?.awayTeamId?.logo" :name="pick.matchId?.awayTeamId?.name" size="sm"/></div></div>
    <div v-else class="fixture">{{ fixture }}</div>
    <RouterLink v-if="!pick.locked" :to="`/tipster-predictions/${pick._id}`" class="prediction-link" @click.stop><div class="prediction">{{ pick.prediction }}</div></RouterLink>
    <div v-else class="prediction locked-prediction">Premium prediction locked</div>
    <div class="meta">{{ formatDate(pick.createdAt || pick.publishedAt) }} · @{{ pick.tipsterId?.name || 'tipster' }}</div>
    <div class="tip-bottom"><span class="odds">{{ pick.locked ? 'Premium access required' : `Odds ${formatOdds(pick.odds)}` }}</span><RouterLink v-if="pick.locked" to="/subscription" class="btn" @click.stop>Unlock Premium</RouterLink><button v-else class="btn" @click.stop="handlePlay">{{ auth.isLoggedIn ? 'Play pick' : 'Sign up to play' }}</button></div>
    <div v-if="show" class="play-box" @click.stop><b>Add to My Picks</b><p class="muted small">Choose a virtual stake to track your potential return. No payment is taken here.</p><input v-model.number="stake" type="number" min="1" step="1" placeholder="Stake (USD)"/><div class="small" style="margin:8px 0">Potential return: <b>{{ formatMoney(stake * Number(pick.odds || 1)) }}</b></div><div style="display:flex;gap:8px"><button class="btn" :disabled="busy" @click.stop="save"><BrandedLoader v-if="busy" label="Saving…"/><template v-else>Add pick</template></button><button class="ghost" @click.stop="show = false">Cancel</button></div><div v-if="error" class="error" style="margin-top:8px">{{ error }}</div></div>
  </article>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../stores/auth'
import { api } from '../services/api'
import { useConfirm, useToast } from '../composables/feedback'
import TeamLogo from './TeamLogo.vue'
import BrandedLoader from './BrandedLoader.vue'
import { formatDate, formatMoney, formatOdds } from '../utils/formatters'
const props = defineProps<{pick:any}>()
const auth = useAuth(), show = ref(false), stake = ref(10), busy = ref(false), error = ref('')
const { ask } = useConfirm(); const { show: toast } = useToast()
const fixture = computed(() => props.pick.fixture || 'Upcoming fixture')
function handlePlay(){if(!auth.isLoggedIn){window.location.href=`/login?redirect=${encodeURIComponent('/picks')}`;return}show.value=true}
async function save(){busy.value=true;error.value='';try{const ok=await ask({title:'Add pick to My Picks?',message:`Track ${props.pick.prediction||'this selection'} at odds ${formatOdds(props.pick.odds)} with a virtual stake of ${formatMoney(stake.value)}. No payment is taken.`,confirmText:'Add pick'});if(!ok){busy.value=false;return}await api.post('/me/picks',{predictionId:props.pick._id,stake:stake.value});show.value=false;await ask({title:'Pick added to My Picks',message:`Your ${props.pick.prediction||'selection'} pick has been added successfully. You can track it from My Picks.`,confirmText:'Done',success:true})}catch(e:any){error.value=e?.message||'Unable to add this pick.';toast(error.value,'error','My Picks')}finally{busy.value=false}}
</script>
<style scoped>
.premium-lock{color:#8b4cf6}.locked-prediction{color:#8b4cf6;font-weight:900;padding:8px 0}.tip-status{display:flex;align-items:center;gap:5px}.fixture-teams{display:flex;align-items:center;justify-content:center;gap:10px;margin:15px 0;font-size:13px}.fixture-teams>div{display:flex;align-items:center;gap:6px;min-width:0}.fixture-teams>div b{max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fixture-teams span{color:var(--muted);font-size:11px}.feed-score{font-weight:900;color:#17243b!important;white-space:nowrap}.play-box{margin-top:15px;padding-top:15px;border-top:1px solid var(--line)}.play-box input{width:100%;padding:10px;border:1px solid var(--line);border-radius:9px;margin:8px 0}
</style>
