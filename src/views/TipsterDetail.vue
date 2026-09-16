<template>
  <div class="pro-page page-animate">
    <div class="wrap">
      <div v-if="loading" class="pro-panel pro-loading"><div class="loading-avatar"></div><div><span></span><span></span><span></span></div></div>
      <div v-else-if="error" class="pro-panel error">{{ error }} <RouterLink class="btn" to="/tipsters">Back to tipsters</RouterLink></div>
      <template v-else-if="profile">
        <div class="pro-profile-hero">
          <div class="pro-profile-main">
            <div class="profile-big">{{ profile.username?.[0]?.toUpperCase() }}</div>
            <div><span class="eyebrow">Verified performance profile</span><h1>@{{ profile.username }}</h1><p>{{ profile.bio || 'Football analysis and transparent prediction history.' }}</p><div class="profile-actions"><RouterLink v-if="isOwnProfile" class="btn" to="/tipster-dashboard/profile">Edit Profile</RouterLink><button v-else class="btn" @click="toggleFollow">{{ following ? 'Following ✓' : 'Follow tipster' }}</button><RouterLink class="ghost" to="/history">Public history</RouterLink></div></div>
          </div>
          <div class="profile-record"><span>Current streak</span><b>{{ profile.currentStreak || 0 }}</b><small>Best {{ profile.longestStreak || 0 }}</small></div>
        </div>

        <div v-if="recentForm.length" class="recent-form-row">
          <span>Recent form</span>
          <div class="streak" title="Last settled results, oldest to newest (left to right)">
            <span v-for="(isWin, i) in recentForm" :key="i" :class="isWin ? 'w' : 'l'">{{ isWin ? 'W' : 'L' }}</span>
          </div>
        </div>

        <div class="pro-stat-strip profile-stats">
          <div><span>Total tips</span><b>{{ profile.totalTips || 0 }}</b></div>
          <div><span>Wins</span><b>{{ profile.wins || 0 }}</b></div>
          <div><span>Win rate</span><b>{{ rate }}%</b></div>
          <div><span>ROI</span><b :class="Number(profile.roi || 0) >= 0 ? 'positive' : 'negative'">{{ Number(profile.roi || 0).toFixed(1) }}%</b></div>
        </div>

        <div class="pro-section-head"><div><span class="eyebrow">Prediction feed</span><h2>Published picks</h2></div><span>{{ picks.length }} tracked picks</span></div>
        <div class="grid2">
          <PickCard v-for="p in picks" :key="p._id" :pick="p" @play="play" />
        </div>
        <EmptyState v-if="!picks.length" title="No published picks yet" message="This tipster has not published any visible selections yet." icon="✦" />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import {useConfirm,useToast} from '../composables/feedback';
import EmptyState from '../components/EmptyState.vue';
import { api } from '../services/api';
import { useAuth } from '../stores/auth';
import PickCard from '../components/PickCard.vue';
const {ask}=useConfirm();const {show:toast}=useToast();

const route=useRoute(), router=useRouter(), auth=useAuth();
const profile=ref<any>(null), picks=ref<any[]>([]), following=ref(false), loading=ref(true), error=ref('');
const currentUserId=computed(()=>auth.user?._id || auth.user?.id || '');
const isOwnProfile=computed(()=>Boolean(currentUserId.value && profile.value?.userId && String(currentUserId.value)===String(profile.value.userId)));
const rate=computed(()=>profile.value?.totalTips ? Math.round(profile.value.wins/profile.value.totalTips*1000)/10 : 0);
// Real recent-form strip (not an estimate): this tipster's actual last 8 settled
// (won/lost) picks, oldest to newest left-to-right. `picks` already comes sorted
// most-recent-first from the API, so take the first 8 and reverse for display order.
const recentForm=computed(()=>picks.value.filter((p:any)=>p.status==='won'||p.status==='lost').slice(0,8).reverse().map((p:any)=>p.status==='won'));
function play(){ if(auth.isLoggedIn) router.push('/dashboard'); else router.push({path:'/login',query:{redirect:route.fullPath}}); }
async function loadFollow(){
  following.value=false;
  if(!auth.isLoggedIn || !profile.value?.userId || isOwnProfile.value) return;
  try { const d=await api.get('/me/follows'); following.value=(d.data||[]).some((x:any)=>String(x.tipsterId?._id||x.tipsterId)===String(profile.value.userId)); } catch { toast('Your follow status could not be refreshed.','error','Tipster') }
}
async function load(){
  loading.value=true; error.value=''; profile.value=null; picks.value=[];
  try { const d=await api.get(`/tipsters/${encodeURIComponent(String(route.params.username))}`); profile.value=d.data.profile; picks.value=d.data.predictions || []; await loadFollow(); }
  catch(e:any){ error.value=e?.message || 'Unable to load this tipster.'; }
  finally { loading.value=false; }
}
async function toggleFollow(){
  if(isOwnProfile.value) return;
  if(!auth.isLoggedIn){ router.push({path:'/login',query:{redirect:route.fullPath}}); return; }
  try { if(following.value){ await api.delete(`/me/follows/${profile.value.userId}`); following.value=false; } else { await api.post(`/me/follows/${profile.value.userId}`,{}); following.value=true; } }
  catch(e:any){ await ask({title:'BraTipsters',message:e?.message||'Unable to complete this action.',confirmText:'Close',cancelText:'Dismiss',danger:true}); }
}
watch(()=>route.params.username, load, { immediate:true });
</script>
