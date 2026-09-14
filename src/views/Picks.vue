<template>
  <div class="pro-page page-animate">
    <div class="wrap">
      <section class="football-hero page-hero-compact"><div><span class="eyebrow">Featured football tips</span><h1>Latest predictions</h1><p>Explore published picks, compare odds and open the full match research behind every selection.</p></div><RouterLink to="/tipsters" class="hero-action">Compare tipsters →</RouterLink></section>
      <section class="signal-strip"><div><span class="pulse-dot"></span><b>Prediction feed live</b><small>New published tips appear here automatically.</small></div><div><b>{{filtered.length}}</b><small>visible picks</small></div><div><b>{{wonCount}}</b><small>settled wins</small></div><RouterLink to="/history">View track record →</RouterLink></section>
      <div class="research-toolbar"><div class="search-field"><span>⌕</span><input v-model="search" placeholder="Search team, league or tipster"/></div><div class="segmented"><button v-for="s in statuses" :key="s.v" :class="{active:status===s.v}" @click="status=s.v">{{s.l}}</button></div></div>
      <div v-if="loading" class="grid3"><div v-for="n in 6" :key="n" class="tip-skeleton"></div></div>
      <div v-else-if="error" class="pro-panel error">{{error}} <button class="ghost" @click="load">Try again</button></div>
      <div v-else class="grid3"><PickCard v-for="p in filtered" :key="p._id" :pick="p" @play="play"/><div v-if="!filtered.length" class="pro-panel empty">No published predictions match your filters.</div></div>
      <section class="premium-research"><div class="premium-icon">★</div><div><span class="eyebrow">Premium research</span><h2>Go deeper than the pick</h2><p>Unlock the full BraTipsters research experience, market context and premium prediction content.</p></div><RouterLink to="/subscription" class="btn">Explore Premium</RouterLink></section>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed,onMounted,ref} from 'vue';import {RouterLink,useRouter} from 'vue-router';import {api} from '../services/api';import PickCard from '../components/PickCard.vue';
const data=ref<any[]>([]),search=ref(''),status=ref(''),loading=ref(true),error=ref(''),router=useRouter();const statuses=[{v:'',l:'All'},{v:'published',l:'Published'},{v:'won',l:'Won'},{v:'lost',l:'Lost'}];
const filtered=computed(()=>data.value.filter(p=>(!status.value||p.status===status.value)&&(!search.value||`${p.fixture||''} ${p.league||''} ${p.tipsterId?.name||''} ${p.matchId?.homeTeamId?.name||''} ${p.matchId?.awayTeamId?.name||''}`.toLowerCase().includes(search.value.toLowerCase()))));const wonCount=computed(()=>data.value.filter(p=>p.status==='won').length);function play(){router.push('/login')};async function load(){loading.value=true;try{data.value=(await api.get('/predictions?limit=100')).data||[]}catch(e:any){error.value=e?.message||'Unable to load predictions.'}finally{loading.value=false}}onMounted(load);
</script>
