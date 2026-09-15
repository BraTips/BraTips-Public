<template>
  <div class="pro-page page-animate"><div class="wrap">
    <section class="football-hero page-hero-compact"><div><span class="eyebrow">BraTipsters market</span><h1>{{ title }}</h1><p>{{ description }}</p></div><RouterLink to="/predictions" class="hero-action">All predictions →</RouterLink></section>
    <section class="signal-strip"><div><span class="pulse-dot"></span><b>{{ title }}</b><small>Published selections for this market.</small></div><div><b>{{ picks.length }}</b><small>visible picks</small></div><RouterLink to="/subscription">Premium access →</RouterLink></section>
    <div v-if="loading" class="grid3"><div v-for="n in 6" :key="n" class="tip-skeleton"></div></div>
    <div v-else-if="error" class="pro-panel error">{{ error }} <button class="ghost" @click="load">Try again</button></div>
    <div v-else class="grid3"><PickCard v-for="p in picks" :key="p._id" :pick="p" @play="play"/><EmptyState v-if="!picks.length" title="No selections yet" :message="`No published ${title.toLowerCase()} selections are available yet. Check back when new fixtures are published.`" icon="✦" /></div>
  </div></div>
</template>
<script setup lang="ts">
import {computed,onMounted,ref} from 'vue';import {RouterLink,useRouter} from 'vue-router';import {api} from '../services/api';import PickCard from '../components/PickCard.vue';import EmptyState from '../components/EmptyState.vue';
const props=defineProps<{market:string}>();const router=useRouter(),data=ref<any[]>([]),loading=ref(true),error=ref('');
const meta:any={
  'over-2-5':{title:'Over 2.5 Tips',description:'Predictions focused on matches expected to finish with three or more total goals.'},
  'btts':{title:'BTTS Tips',description:'Predictions for both teams to score, with Premium selections clearly marked.'},
  'corners':{title:'Corners Tips',description:'Corner-market selections when a corresponding corner prediction is published.'},
  'double-chance':{title:'Double Chance Tips',description:'1X, X2 and 12 selections designed around the double-chance market.'}
};
const title=computed(()=>meta[props.market]?.title||'Market Tips'),description=computed(()=>meta[props.market]?.description||'BraTipsters market selections.');const picks=computed(()=>data.value);
async function load(){loading.value=true;error.value='';try{const r=await api.get(`/predictions?limit=50&market=${props.market}`);data.value=r.data||[]}catch(e:any){error.value=e?.message||'Unable to load market predictions.'}finally{loading.value=false}}function play(){router.push('/login')}onMounted(load)
</script>
