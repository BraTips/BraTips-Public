<template>
  <div class="tipster-work-page">
    <section class="td-page-hero">
      <div>
        <span class="eyebrow">Publishing pipeline</span>
        <div class="td-page-title-row">
          <div>
            <h1>My Predictions</h1>
            <p>Track every submission from review to publication in one place.</p>
          </div>
          <RouterLink to="/tipster-dashboard/create-prediction" class="btn td-primary-action">+ New prediction</RouterLink>
        </div>
      </div>
      <div class="td-summary-chips">
        <span><b>{{ predictions.length }}</b> total</span>
        <span><b>{{ pendingCount }}</b> pending</span>
        <span><b>{{ publishedCount }}</b> published</span>
      </div>
    </section>

    <section class="bt-card predictions-card">
      <div class="bt-card-head">
        <div class="bt-card-heading">
          <span class="section-kicker">SUBMISSIONS</span>
          <h2>Prediction history</h2>
          <p>Pending selections remain private until approved. Published selections are already live.</p>
        </div>
      </div>

      <div v-if="predictions.length" class="predictions-table">
        <div class="predictions-table-head"><span>Fixture</span><span>Selection</span><span>Odds</span><span>Status</span><span></span></div>
        <RouterLink v-for="p in predictions" :key="p._id" :to="p.matchId ? `/matches/${p.matchId}` : `/predictions/${p._id}`" class="prediction-table-row">
          <div class="prediction-fixture"><b>{{ p.fixture || 'Football match' }}</b><small>{{ formatDate(p.publishedAt || p.createdAt) }}</small></div>
          <span class="prediction-selection">{{ p.prediction }}</span>
          <strong>{{ Number(p.odds || 0).toFixed(2) }}</strong>
          <em :class="'td-status-pill '+p.status">{{ statusLabel(p.status) }}</em>
          <span class="prediction-arrow">→</span>
        </RouterLink>
      </div>
      <div v-else class="bt-empty">
        <div class="bt-empty-icon">＋</div><h3>No predictions yet</h3>
        <p>Create your first football selection and submit it for review.</p>
        <RouterLink to="/tipster-dashboard/create-prediction" class="btn bt-empty-action">Create prediction</RouterLink>
      </div>
    </section>

    <section class="bt-card published-record-card">
      <div class="bt-card-head">
        <div class="bt-card-heading"><span class="section-kicker">LIVE RECORD</span><h2>Published Tipster Picks</h2><p>Approved selections are already on BraTipsters — they do not need to be submitted again.</p></div>
        <RouterLink to="/tipsters" class="text-action">View public tipsters →</RouterLink>
      </div>
      <div v-if="published.length" class="published-pick-grid">
        <RouterLink v-for="p in published" :key="p._id" :to="p.matchId ? `/matches/${p.matchId}` : `/predictions/${p._id}`" class="published-pick-card">
          <div class="published-pick-top"><span>Published</span><b>{{ Number(p.odds || 0).toFixed(2) }}</b></div>
          <h3>{{ p.fixture || 'Football match' }}</h3>
          <div class="published-pick-bottom"><span>{{ p.prediction }}</span><em :class="'td-status-pill '+p.status">{{ statusLabel(p.status) }}</em></div>
        </RouterLink>
      </div>
      <div v-else class="bt-empty bt-empty--compact"><h3>No published picks yet</h3><p>Approved selections will appear here automatically.</p></div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';
const predictions = ref<any[]>([]);
const published = computed(() => predictions.value.filter(x => ['published','won','lost','void'].includes(x.status)));
const pendingCount = computed(() => predictions.value.filter(x => ['pending','under_review'].includes(x.status)).length);
const publishedCount = computed(() => published.value.length);
function statusLabel(v:string){ return v==='published'?'Published':v==='won'?'Won':v==='lost'?'Lost':v==='void'?'Void':'Pending'; }
onMounted(async()=>{ try { predictions.value=(await api.get('/me/tipster')).data.predictions||[]; } catch {} });
</script>
