<template>
  <div class="pro-page tipster-dashboard page-animate">
    <div class="dashboard-shell">
      <aside class="dashboard-nav">
        <div class="dashboard-brand-row"><div class="dashboard-brand-row"><div class="dashboard-brand">TIPSTER<br><b>WORKSPACE</b></div><NotificationBell /></div><NotificationBell /></div>
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to" class="dashboard-nav-link">{{ item.label }}</RouterLink>
        <RouterLink to="/" class="dashboard-nav-link dashboard-back">← Back to site</RouterLink>
      </aside>
      <main class="dashboard-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import NotificationBell from '../components/NotificationBell.vue';

const nav = [
  { label: 'Overview', to: '/tipster-dashboard' },
  { label: 'My Predictions', to: '/tipster-dashboard/predictions' },
  { label: 'Create Prediction', to: '/tipster-dashboard/create-prediction' },
  { label: 'Prediction Results', to: '/tipster-dashboard/results' },
  { label: 'Analytics', to: '/tipster-dashboard/analytics' },
  { label: 'Earnings & Revenue', to: '/tipster-dashboard/earnings' },
  { label: 'Withdrawals', to: '/tipster-dashboard/withdrawals' },
  { label: 'Premium', to: '/tipster-dashboard/premium' },
  { label: 'Public Profile', to: '/tipster-dashboard/profile' },
  { label: 'Profile Settings', to: '/tipster-dashboard/settings' },
  { label: 'Notifications', to: '/tipster-dashboard/notifications' },
];
</script>

<style scoped>
.dashboard-shell{display:grid;grid-template-columns:248px minmax(0,1fr);gap:24px;align-items:start;max-width:1420px;margin:0 auto;padding:24px 24px 48px}.dashboard-nav{position:sticky;top:100px;display:flex;flex-direction:column;gap:5px;padding:16px;border:1px solid var(--border);border-radius:20px;background:var(--surface,#fff);box-shadow:0 10px 30px rgba(0,0,0,.06)}.dashboard-brand-row{min-height:54px;display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.dashboard-brand{padding:12px 14px 20px;font-size:12px;letter-spacing:.14em;color:var(--muted)}.dashboard-brand b{font-size:16px;color:var(--text)}.dashboard-brand-row .notif-wrap{display:block}.dashboard-nav-link{padding:11px 13px;border-radius:10px;color:var(--text);font-weight:600;text-decoration:none}.dashboard-nav-link:hover,.dashboard-nav-link.router-link-active{background:rgba(109,40,217,.1);color:#6d28d9}.dashboard-back{margin-top:10px;border-top:1px solid var(--border);padding-top:18px}.dashboard-content{min-width:0}.dashboard-content>.dash-page,.dashboard-content>.pro-panel{width:100%;max-width:1280px;margin:0 auto}.dashboard-nav .notif-wrap{display:block}@media(max-width:900px){.dashboard-shell{display:block;padding:16px 16px 0}.dashboard-nav{position:relative;top:auto;display:flex;flex-direction:row;overflow:auto;margin-bottom:18px;white-space:nowrap}.dashboard-brand-row{display:none}.dashboard-brand{display:none}.dashboard-nav-link{flex:0 0 auto}.dashboard-back{margin-top:0;border-top:0;padding-top:11px}}
</style>
