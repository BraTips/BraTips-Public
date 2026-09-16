<template>
  <div class="pro-page page-animate subscription-pro">
    <div class="wrap subscription-wrap">
      <section class="subscription-hero-new">
        <div class="subscription-hero-copy">
          <span class="eyebrow">BraTipsters Premium</span>
          <h1>More football insight.<br><strong>Less guesswork.</strong></h1>
          <p>Unlock the research workspace, market intelligence and premium prediction content built around the matches you care about.</p>
          <div class="subscription-hero-points"><span>✓ Live market context</span><span>✓ Premium predictions</span><span>✓ Match research</span></div>
        </div>
        <div class="subscription-security"><div class="security-icon">↗</div><b>Secure billing</b><span>Checkout is handled by Stripe.</span><small>Your card details are not stored by BraTipsters.</small></div>
      </section>

      <div v-if="success" class="subscription-alert success-box"><b>Payment received</b><span>Stripe is confirming your subscription. Your account will update after the billing webhook is received.</span></div>
      <div v-if="canceled" class="subscription-alert notice-strip"><b>Checkout canceled</b><span>Your plan has not changed. You can choose a plan whenever you're ready.</span></div>

      <section v-if="auth.isLoggedIn && current" class="current-membership">
        <div class="membership-status"><span>Current membership</span><strong>{{ current.plan }}</strong><em>{{ current.status }}</em></div>
        <button class="ghost" @click="portal" :disabled="busy">{{ busy ? 'Opening…' : 'Manage billing →' }}</button>
      </section>

      <div class="subscription-heading"><div><span class="section-kicker">CHOOSE YOUR ACCESS</span><h2>Pick the workspace that fits you</h2><p>Both plans use the same secure Stripe checkout and the same BraTipsters account.</p></div></div>

      <section class="plans-grid-new">
        <article v-for="option in planOptions" :key="`${option.plan.id}-${option.interval}`" class="subscription-plan" :class="{featured:option.plan.id==='premium', 'yearly-plan':option.interval==='year'}">
          <div v-if="option.plan.id==='premium' && option.interval==='month'" class="popular-ribbon">MOST POPULAR</div>
          <div class="plan-head"><span class="plan-tier">{{ option.plan.id==='premium' ? 'Premium workspace' : 'Lite workspace' }}</span><span class="plan-mark">{{ option.plan.id==='premium' ? 'P' : 'L' }}</span></div>
          <h3>{{ option.plan.name || (option.plan.id==='premium' ? 'Premium' : 'Lite') }} {{ option.interval==='year' ? 'Yearly' : 'Monthly' }}</h3>
          <p class="plan-description">{{ option.plan.description }}</p>
          <div class="plan-billing"><div><strong>{{ priceLabel(option.plan, option.interval) }}</strong><span>{{ option.interval==='year' ? 'yearly billing' : 'monthly billing' }}</span></div><span class="stripe-chip">Stripe</span></div>
          <ul class="plan-features"><li>Football odds & market context</li><li>Live scores and match centre</li><li>Transparent prediction history</li><li>Dropping Odds intelligence</li><li v-if="option.plan.id==='premium'">Premium prediction content</li><li v-if="option.plan.id==='premium'">Deeper research workspace</li></ul>
          <div class="plan-actions"><button class="btn" :disabled="busy||!isConfigured(option.plan,option.interval)" @click="checkout(option.plan.id,option.interval)">{{ !auth.isLoggedIn ? 'Create a member account' : isConfigured(option.plan,option.interval) ? `Subscribe ${option.interval==='year'?'yearly':'monthly'}` : 'Coming soon' }}</button></div>
        </article>
      </section>

      <section class="subscription-value-grid">
        <div><span>01</span><div><b>Live market monitoring</b><p>Track price movement and football odds signals around active fixtures.</p></div></div>
        <div><span>02</span><div><b>Automatic results</b><p>Completed predictions move into the transparent public record.</p></div></div>
        <div><span>03</span><div><b>Secure Stripe billing</b><p>Hosted checkout and customer portal for subscriptions.</p></div></div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed,onMounted,ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { api } from '../services/api';
import { useAuth } from '../stores/auth';
import { useConfirm,useToast } from '../composables/feedback';
const auth=useAuth(),{ask}=useConfirm(),{show:toast}=useToast(),route=useRoute(),router=useRouter(),plans=ref<any[]>([]),current=ref<any>(null),busy=ref(false);
const success=computed(()=>route.query.success==='1'),canceled=computed(()=>route.query.canceled==='1');
const planOptions=computed(()=>plans.value.flatMap((plan:any)=>[{plan,interval:'month' as const},{plan,interval:'year' as const}]));
const isConfigured=(p:any,i:'month'|'year'='month')=>i==='year'?Boolean(p.yearlyConfigured):Boolean(p.monthlyConfigured);
function priceLabel(p:any,i:'month'|'year'='month'){const value=i==='year'?(p.yearlyPrice??p.yearlyAmount):(p.monthlyPrice??p.monthlyAmount??p.price);if(typeof value==='number'&&value>0)return `${p.currency||'USD'} ${value}`;return isConfigured(p,i)?'Available':'Not configured';}
async function checkout(plan:string,interval:'month'|'year'){if(!auth.isLoggedIn){router.push({path:'/signup',query:{redirect:'/subscription'}});return}busy.value=true;try{const d=await api.post('/billing/checkout',{plan,interval,successUrl:location.origin+'/subscription?success=1',cancelUrl:location.origin+'/subscription?canceled=1'});if(d.data?.url)location.href=d.data.url}catch(e:any){await ask({title:'BraTipsters checkout',message:e?.message||'Unable to start checkout.',confirmText:'Close',cancelText:'Dismiss',danger:true})}finally{busy.value=false}}
async function portal(){busy.value=true;try{const d=await api.post('/billing/portal',{returnUrl:location.origin+'/subscription'});if(d.data?.url)location.href=d.data.url}catch(e:any){await ask({title:'BraTipsters billing',message:e?.message||'Unable to open billing portal.',confirmText:'Close',cancelText:'Dismiss',danger:true})}finally{busy.value=false}}
onMounted(async()=>{try{plans.value=(await api.get('/billing/plans')).data||[]}catch{toast('Premium plans could not be loaded. Please refresh and try again.','error','Premium')}if(auth.isLoggedIn)try{current.value=(await api.get('/billing/me')).data?.subscription||null}catch{toast('Your current subscription could not be checked.','error','Premium')}});
</script>
