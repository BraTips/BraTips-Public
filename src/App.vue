<template>
  <div class="app">
    <header v-if="!minimalChrome" class="top">
      <div class="wrap nav">
        <RouterLink to="/" class="brand" aria-label="BraTipsters home">
          <img src="/logo.svg" alt="BraTipsters" />
        </RouterLink>

        <nav class="desktop-nav" aria-label="Primary navigation" ref="desktopNavEl">
          <RouterLink to="/matches">Matches</RouterLink>

          <div class="nav-menu" :class="{open: openMenu==='tips'}">
            <button type="button" class="nav-menu-trigger" :aria-expanded="openMenu==='tips'" @click="toggleMenu('tips')">Tips <span>⌄</span></button>
            <transition name="dropdown">
              <div v-if="openMenu==='tips'" class="nav-dropdown" @click="closeMenu">
                <RouterLink to="/picks">Latest Tips</RouterLink>
                <RouterLink to="/bet-of-the-day">Bet of the Day</RouterLink>
                <RouterLink to="/history">Tip History</RouterLink>
              </div>
            </transition>
          </div>

          <div class="nav-menu" :class="{open: openMenu==='tipsters'}">
            <button type="button" class="nav-menu-trigger" :aria-expanded="openMenu==='tipsters'" @click="toggleMenu('tipsters')">Tipsters <span>⌄</span></button>
            <transition name="dropdown">
              <div v-if="openMenu==='tipsters'" class="nav-dropdown" @click="closeMenu">
                <RouterLink to="/tipsters">All Tipsters</RouterLink>
                <RouterLink to="/tipster-rankings">Monthly Rankings</RouterLink>
                <RouterLink to="/tipster-signup">Become a Tipster</RouterLink>
              </div>
            </transition>
          </div>

          <div class="nav-menu" :class="{open: openMenu==='tools'}">
            <button type="button" class="nav-menu-trigger" :aria-expanded="openMenu==='tools'" @click="toggleMenu('tools')">Tools <span>⌄</span></button>
            <transition name="dropdown">
              <div v-if="openMenu==='tools'" class="nav-dropdown" @click="closeMenu">
                <RouterLink to="/dropping-odds">Dropping Odds</RouterLink>
                <RouterLink to="/how-to-use">How to Use</RouterLink>
                <RouterLink to="/faq">FAQ</RouterLink><RouterLink to="/whats-new">What's New</RouterLink>
              </div>
            </transition>
          </div>

          <RouterLink to="/premium-features" class="premium-nav">Premium</RouterLink>
        </nav>

        <div class="actions">
          <template v-if="auth.isLoggedIn">
            <RouterLink to="/dashboard" class="avatar" :title="auth.user.name">{{auth.user.name?.[0]}}</RouterLink>
            <NotificationBell/>
            <button class="ghost nav-logout" @click="auth.logout">Log out</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="ghost nav-login">Log in</RouterLink>
            <RouterLink to="/signup" class="btn nav-signup">Sign up</RouterLink>
          </template>
          <button class="mobile-nav-toggle" type="button" aria-label="Open navigation" @click="mobileOpen=!mobileOpen">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div v-if="mobileOpen" class="mobile-nav-panel">
        <div class="wrap mobile-nav-inner">
          <RouterLink to="/matches" @click="closeMobile">Matches</RouterLink>
          <RouterLink to="/picks" @click="closeMobile">Latest Tips</RouterLink>
          <RouterLink to="/bet-of-the-day" @click="closeMobile">Bet of the Day</RouterLink>
          <RouterLink to="/tipsters" @click="closeMobile">Tipsters</RouterLink>
          <RouterLink to="/tipster-rankings" @click="closeMobile">Monthly Rankings</RouterLink>
          <RouterLink to="/dropping-odds" @click="closeMobile">Dropping Odds</RouterLink>
          <RouterLink to="/history" @click="closeMobile">Tip History</RouterLink>
          <RouterLink to="/how-to-use" @click="closeMobile">How to Use</RouterLink>
          <RouterLink to="/whats-new" @click="closeMobile">What's New</RouterLink>
          <RouterLink to="/faq" @click="closeMobile">FAQ</RouterLink>
          <RouterLink to="/premium-features" class="mobile-premium" @click="closeMobile">Premium</RouterLink>
          <RouterLink v-if="!auth.isLoggedIn" to="/tipster-signup" @click="closeMobile">Become a Tipster</RouterLink>
        </div>
      </div>
    </header>

    <main><RouterView/></main>

    <footer v-if="!minimalChrome">
      <div class="wrap foot">
        <div><img src="/logo-footer.svg" class="foot-logo" alt="BraTipsters"/><p>Football predictions, tipsters and performance you can follow.</p><div class="responsible"><img class="gambleaware-badge" src="https://www.betshoot.com/images4/c3/gambleaware260b.png" alt="BeGambleAware"/><b>BeGambleAware</b><p>Betting-related content is intended for users aged 18 or over, or the legal betting age in their country. Please bet responsibly.</p><p>If betting is causing problems, please seek help from a responsible gambling support organisation in your country.</p></div></div>
        <div><b>Explore</b><RouterLink to="/picks">Latest picks</RouterLink><RouterLink to="/bet-of-the-day">Bet of the Day</RouterLink><RouterLink to="/tipsters">Tipsters</RouterLink><RouterLink to="/tipster-rankings">Monthly rankings</RouterLink><RouterLink to="/premium-features" class="premium-nav">Premium features</RouterLink><RouterLink to="/how-to-use">How to use</RouterLink><RouterLink to="/whats-new">What's New</RouterLink><RouterLink to="/faq">FAQ</RouterLink></div>
        <div><b>Information</b><RouterLink to="/about">About BraTipsters</RouterLink><RouterLink to="/editorial-policy">Editorial Policy</RouterLink><RouterLink to="/results-tracking-policy">Results Tracking Policy</RouterLink><RouterLink to="/betting-guides">Betting Guides</RouterLink><RouterLink to="/glossary">Glossary</RouterLink><RouterLink to="/blog">Blog</RouterLink><RouterLink to="/terms-of-use">Terms of Use</RouterLink><RouterLink to="/privacy-policy">Privacy & Cookie Policy</RouterLink><RouterLink to="/contact">Contact BraTipsters</RouterLink></div>
      </div>
      <div class="footer-disclaimer"><div class="wrap"><strong>Disclaimer:</strong> Past performance does not guarantee future results. BraTipsters tips and analysis are manually written and reviewed. <RouterLink to="/editorial-policy">Read more in our Editorial Policy.</RouterLink><br/><b>Gamble responsibly</b> · 18+ only. Betting can be addictive — please play within your limits.</div></div>
      <div class="copyright">© {{new Date().getFullYear()}} BraTipsters. Predictions are for information only.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {RouterLink,RouterView,useRoute} from 'vue-router';
import {useAuth} from './stores/auth';
import NotificationBell from './components/NotificationBell.vue';
const auth=useAuth();
const route=useRoute();
const mobileOpen=ref(false);
const closeMobile=()=>{mobileOpen.value=false};

// Desktop "Tips / Tipsters / Tools" dropdowns.
// Only one can be open at a time; clicking the trigger again, picking a link,
// navigating, pressing Escape, or clicking anywhere outside all close it.
const openMenu=ref<string|null>(null);
const desktopNavEl=ref<HTMLElement|null>(null);
function toggleMenu(name:string){openMenu.value = openMenu.value===name ? null : name}
function closeMenu(){openMenu.value=null}
function onDocClick(e:MouseEvent){
  if(!openMenu.value) return;
  if(desktopNavEl.value && !desktopNavEl.value.contains(e.target as Node)) closeMenu();
}
function onKeydown(e:KeyboardEvent){ if(e.key==='Escape') closeMenu(); }
onMounted(()=>{document.addEventListener('click', onDocClick); document.addEventListener('keydown', onKeydown)});
onUnmounted(()=>{document.removeEventListener('click', onDocClick); document.removeEventListener('keydown', onKeydown)});

watch(()=>route.path, ()=>{closeMobile(); closeMenu();});
const minimalChrome=computed(()=>['/login','/signup','/tipster-signup'].includes(route.path));
</script>
