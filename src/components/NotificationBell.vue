<template>
  <div v-if="auth.isLoggedIn" ref="notificationRoot" class="notif-wrap">
    <button class="notification notification-trigger" type="button" :aria-expanded="open" aria-label="Notifications" title="Notifications" @click.stop="open = !open">
      <span class="notification-glyph" aria-hidden="true"></span><span v-if="unread" class="notif-count">{{ unread > 9 ? '9+' : unread }}</span>
    </button>
    <Transition name="notification-popover">
      <div v-if="open" class="notif-pop" role="dialog" aria-label="Notifications" @click.stop>
        <div class="notif-head"><div><span class="notif-kicker">ACCOUNT UPDATES</span><b>Notifications</b></div><button v-if="unread" class="notif-mark-read" type="button" @click="markAll">Mark all read</button></div>
        <div v-if="items.length" class="notif-list"><button v-for="n in items" :key="n._id" type="button" class="notice" :class="{unread:!n.read}" @click="read(n)"><span class="notice-mark">{{ n.read ? '✓' : '•' }}</span><span class="notice-copy"><b>{{ n.title }}</b><span>{{ n.message }}</span><small>{{ formatDateTime(n.createdAt) }}</small></span><span class="notice-arrow">›</span></button></div>
        <EmptyState v-else title="No notifications yet" message="New account, prediction and result updates will appear here." icon="•" compact />
        <RouterLink class="notif-footer-link" :to="auth.isTipster ? '/tipster-dashboard/notifications' : '/dashboard/notifications'" @click="open = false">View all notifications →</RouterLink>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../stores/auth'
import { api } from '../services/api'
import { formatDateTime } from '../utils/formatters'
import { useToast } from '../composables/feedback'
import EmptyState from './EmptyState.vue'
const auth=useAuth(),open=ref(false),notificationRoot=ref<HTMLElement|null>(null),items=ref<any[]>([]),unread=ref(0),{show:toast}=useToast()
async function load(){try{const d=await api.get('/me/notifications');items.value=d.data||[];unread.value=d.unread||0}catch{toast('Notifications could not be loaded.','error','Notifications')}}
async function read(n:any){if(!n.read){try{await api.patch(`/me/notifications/${n._id}/read`,{});n.read=true;unread.value=Math.max(0,unread.value-1)}catch{toast('We could not mark this notification as read.','error','Notification')}}}
async function markAll(){try{await api.patch('/me/notifications/read-all',{});items.value.forEach(n=>n.read=true);unread.value=0}catch{toast('We could not update your notifications.','error','Notifications')}}
function closeOnOutside(event:MouseEvent){if(open.value&&notificationRoot.value&&!notificationRoot.value.contains(event.target as Node))open.value=false}
function closeOnEscape(event:KeyboardEvent){if(event.key==='Escape')open.value=false}
onMounted(()=>{load();document.addEventListener('click',closeOnOutside);document.addEventListener('keydown',closeOnEscape)})
onUnmounted(()=>{document.removeEventListener('click',closeOnOutside);document.removeEventListener('keydown',closeOnEscape)})
</script>