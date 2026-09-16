<template>
  <section class="pro-panel td-simple-page">
    <div class="pro-section-head td-page-head"><div><span class="eyebrow">Updates</span><h1>Notifications</h1><p>Prediction review, publishing, result and account updates appear here.</p></div><button class="ghost" @click="markAll">{{ unread ? `Mark all read · ${unread}` : 'All read' }}</button></div>
    <div v-if="notifications.length" class="td-notification-list"><button v-for="n in notifications" :key="n._id" type="button" :class="['td-notification-item',{unread:!n.read}]" @click="read(n)"><span class="td-notification-icon">{{ n.read ? '✓' : '•' }}</span><span class="td-notification-copy"><b>{{ n.title }}</b><p>{{ n.message }}</p><small>{{ formatDateTime(n.createdAt) }}</small></span><span class="td-notification-arrow">→</span></button></div><div v-else class="td-empty-panel"><div>🔔</div><h2>No notifications yet</h2><p>New prediction review, publishing and account updates will appear here.</p></div>
  </section>
</template>
<script setup lang="ts">import{onMounted,ref}from'vue';import{api}from'../services/api';import{formatDateTime}from'../utils/formatters';const notifications=ref<any[]>([]),unread=ref(0);async function load(){try{const d=await api.get('/me/notifications');notifications.value=d.data||[];unread.value=d.unread||0}catch{}}async function read(n:any){if(n.read)return;try{await api.patch(`/me/notifications/${n._id}/read`,{});n.read=true;unread.value=Math.max(0,unread.value-1)}catch{}}async function markAll(){try{await api.patch('/me/notifications/read-all',{});notifications.value.forEach(n=>n.read=true);unread.value=0}catch{}}onMounted(load)</script>
<style scoped>
.td-simple-page{padding:24px;overflow:hidden}
.td-page-head{align-items:center;margin-bottom:20px}
.td-page-head h1{margin:5px 0 6px;font-size:30px}
.td-page-head p{margin:0;color:#748196;font-size:13px;line-height:1.6}
.td-page-head>.ghost{flex:none;white-space:nowrap}
.td-notification-list{display:grid;gap:9px}
.td-notification-item{width:100%;display:grid;grid-template-columns:38px minmax(0,1fr) 24px;gap:13px;align-items:center;padding:16px 17px;border:1px solid #dfe5ed;border-radius:13px;background:#fff;color:#182842;text-align:left;cursor:pointer;box-shadow:0 6px 20px rgba(16,26,46,.035);transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease}
.td-notification-item:hover{border-color:#cbd5e2;box-shadow:0 10px 25px rgba(16,26,46,.07);transform:translateY(-1px)}
.td-notification-item.unread{border-left:3px solid #ed275f;background:#fffafb}
.td-notification-icon{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:#eef3f8;color:#69788e;font-size:18px;font-weight:900}
.td-notification-item.unread .td-notification-icon{background:#fff0f4;color:#ed275f}
.td-notification-copy{min-width:0}
.td-notification-copy b{display:block;font-size:13px;line-height:1.35;overflow-wrap:anywhere}
.td-notification-copy p{margin:4px 0 5px;color:#6f7d91;font-size:12px;line-height:1.55;overflow-wrap:anywhere}
.td-notification-copy small{display:block;color:#98a3b2;font-size:10px}
.td-notification-arrow{color:#9ba6b5;font-size:19px;text-align:right}
.td-empty-panel{min-height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px 22px;border:1px dashed #d4dce7;border-radius:15px;background:linear-gradient(180deg,#fbfcfe,#f7f9fc);text-align:center}
.td-empty-panel>div{width:48px;height:48px;display:grid;place-items:center;margin-bottom:12px;border-radius:14px;background:#fff0f4;color:#ed275f;font-size:22px}
.td-empty-panel h2{margin:0;color:#24324e;font-size:18px}
.td-empty-panel p{max-width:390px;margin:7px 0 0;color:#7b8799;font-size:12px;line-height:1.6}
@media(max-width:620px){.td-simple-page{padding:16px}.td-page-head{display:block}.td-page-head h1{font-size:26px}.td-page-head>.ghost{display:block;width:100%;margin-top:14px;text-align:center}.td-notification-item{grid-template-columns:34px minmax(0,1fr);gap:10px;padding:14px 12px}.td-notification-arrow{display:none}.td-notification-icon{width:31px;height:31px}.td-notification-copy b{font-size:12px}.td-notification-copy p{font-size:11px}}
</style>
