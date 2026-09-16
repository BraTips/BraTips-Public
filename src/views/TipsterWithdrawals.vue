<template>
  <section class="pro-panel td-simple-page">
    <div class="pro-section-head td-page-head">
      <div><span class="eyebrow">Payout centre</span><h1>Withdrawals</h1><p>Withdraw eligible tipster earnings. Requests are reviewed manually and approved payouts are processed within 1–3 business days.</p></div>
      <span class="td-soft-badge">MANUAL REVIEW</span>
    </div>

    <div class="td-balance-card"><div><span>Available balance</span><strong>{{ formatMoney(available) }}</strong><small>Minimum withdrawal {{ formatMoney(10) }}</small></div><div class="td-balance-mark">$</div></div>

    <div class="td-payout-card">
      <div class="td-card-heading"><div><h2>Request a payout</h2><p>Choose where you want your approved earnings sent.</p></div></div>
      <div class="td-payout-grid">
        <div class="field"><label>Payment method</label><select v-model="method"><option value="mobile_money">Mobile Money</option><option value="bank_transfer">Bank Transfer</option></select></div>
        <div class="field"><label>Account name</label><input v-model="payout.accountName" placeholder="Account name" /></div>
        <div class="field"><label>Mobile number / account number</label><input v-model="payout.accountNumber" placeholder="Mobile number / account number" /></div>
        <div class="field"><label>{{ method==='mobile_money' ? 'Network' : 'Bank name' }}</label><input v-model="payout.institution" :placeholder="method==='mobile_money'?'MTN / Telecel / AirtelTigo':'Bank name'" /></div>
      </div>
      <div class="td-payout-foot"><span>Double-check your payout details before submitting.</span><button class="btn" :disabled="submitting||available<10||!payout.accountName||!payout.accountNumber||!payout.institution" @click="request">{{ submitting ? 'Submitting…' : `Request ${formatMoney(available)} withdrawal` }}</button></div>
      <div v-if="message" :class="messageType" class="mt-3">{{ message }}</div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed,onMounted,reactive,ref } from 'vue'; import { api } from '../services/api'; import { formatMoney } from '../utils/formatters'
const wallet=ref<any>(null), submitting=ref(false), message=ref(''), messageType=ref<'success'|'error'>('success'), method=ref<'mobile_money'|'bank_transfer'>('mobile_money'); const payout=reactive({accountName:'',accountNumber:'',institution:''}); const available=computed(()=>Number(wallet.value?.wallet?.availableBalance||0));
async function load(){try{wallet.value=(await api.get('/me/tipster/wallet')).data}catch{wallet.value=null}} async function request(){submitting.value=true;message.value='';try{const d=await api.post('/me/tipster/wallet/withdraw',{amount:available.value,method:method.value,accountName:payout.accountName,accountNumber:payout.accountNumber,institution:payout.institution});message.value=d.message||'Withdrawal request submitted.';messageType.value='success';await load()}catch(e:any){message.value=e?.message||'Unable to submit withdrawal request.';messageType.value='error'}finally{submitting.value=false}} onMounted(load)
</script>
