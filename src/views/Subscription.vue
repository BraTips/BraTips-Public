<template>
  <div class="subscription-page page-animate">
    <div class="wrap subscription-shell">
      <section class="pricing-hero">
        <div class="hero-copy">
          <span class="pricing-eyebrow"><span class="eyebrow-dot"></span> BRATIPSTERS PREMIUM</span>
          <h1>More than a pick.<br><strong>A smarter football workspace.</strong></h1>
          <p>Unlock deeper match research, premium predictions and the market intelligence you need to research football with more context.</p>
          <div class="hero-proof">
            <span><b>✓</b> Live market intelligence</span>
            <span><b>✓</b> Premium predictions</span>
            <span><b>✓</b> Transparent results</span>
          </div>
        </div>
        <div class="hero-visual">
          <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
          <div class="hero-score-card">
            <div class="score-card-top"><span>BRATIPSTERS MODEL</span><i>✦</i></div>
            <div class="score-match"><span>ARS</span><b>1.78</b><span>MUN</span></div>
            <div class="score-bar"><span style="width:72%"></span></div>
            <div class="score-foot"><small>Model confidence</small><strong>72%</strong></div>
          </div>
          <div class="hero-badge badge-top">✦ Premium pick</div>
          <div class="hero-badge badge-bottom">↗ Value signal</div>
        </div>
      </section>

      <div v-if="success" class="notice success-box"><span>✓</span><div><b>Payment received</b><small>Stripe is confirming your subscription. Your account will update after the webhook is received.</small></div></div>
      <div v-if="canceled" class="notice cancel-box"><span>!</span><div><b>Checkout canceled</b><small>No charge was made. You can choose a plan whenever you're ready.</small></div></div>

      <div v-if="auth.isLoggedIn && current" class="membership-bar">
        <div class="membership-status"><span class="status-dot"></span><div><small>Current membership</small><b>{{ current.plan }} <em>·</em> {{ current.status }}</b></div></div>
        <button class="ghost" @click="portal" :disabled="busy">Manage billing <span>→</span></button>
      </div>

      <section class="plans-section">
        <div class="section-heading">
          <div><span class="eyebrow">CHOOSE YOUR ACCESS</span><h2>Pick the level that fits you.</h2><p>Start with the essentials or unlock the complete BraTipsters research experience.</p></div>
          <div class="billing-note"><span class="secure-dot"></span> Secure Stripe checkout</div>
        </div>

        <div class="plans-grid-pro">
          <article v-for="plan in plans" :key="plan.id" class="plan-card" :class="{featured: plan.id==='premium'}">
            <div v-if="plan.id==='premium'" class="popular-ribbon">MOST POPULAR</div>
            <div class="plan-card-head">
              <div class="plan-icon" :class="plan.id==='premium'?'premium-icon':'lite-icon'">{{ plan.id==='premium' ? '✦' : '◈' }}</div>
              <div><span class="plan-tier">{{ plan.id==='premium' ? 'Premium' : 'Lite' }}</span><h3>{{ plan.name }}</h3></div>
            </div>
            <p class="plan-description">{{ plan.description }}</p>

            <div class="plan-price">
              <template v-if="plan.monthlyPrice || plan.price || plan.amount">
                <strong>{{ plan.monthlyPrice || plan.price || plan.amount }}</strong><span>/ month</span>
              </template>
              <template v-else>
                <strong>Monthly</strong><span>access</span>
              </template>
            </div>

            <div class="plan-divider"></div>
            <p class="includes">{{ plan.id==='premium' ? 'Everything in Lite, plus:' : 'Essential football intelligence:' }}</p>
            <ul class="feature-list">
              <li><span>✓</span> Football odds &amp; market context</li>
              <li><span>✓</span> Live scores and match centre</li>
              <li><span>✓</span> Transparent prediction history</li>
              <li><span>✓</span> Dropping Odds intelligence</li>
              <li v-if="plan.id==='premium'"><span>✓</span> Premium prediction content</li>
              <li v-if="plan.id==='premium'"><span>✓</span> Deeper research workspace</li>
            </ul>

            <div class="plan-actions">
              <button class="plan-primary" :class="{premium:plan.id==='premium'}" :disabled="busy||!isConfigured(plan)" @click="checkout(plan.id,'month')">
                {{ !auth.isLoggedIn ? 'Log in to continue' : isConfigured(plan) ? `Choose ${plan.id==='premium'?'Premium':'Lite'}` : 'Coming soon' }} <span>→</span>
              </button>
              <button class="yearly-link" v-if="isConfigured(plan,'year')" @click="checkout(plan.id,'year')">Choose yearly billing <span>→</span></button>
            </div>
          </article>
        </div>
      </section>

      <section class="why-premium">
        <div class="why-heading"><span class="eyebrow">WHY BRATIPSTERS</span><h2>Built around better football research.</h2><p>Premium is designed to add context around every prediction — not just another list of picks.</p></div>
        <div class="benefit-grid">
          <article><div class="benefit-icon pink">⌁</div><h3>Market intelligence</h3><p>Track price movement, odds signals and market context around fixtures.</p></article>
          <article><div class="benefit-icon purple">✦</div><h3>Deeper predictions</h3><p>See premium selections with the additional model information behind them.</p></article>
          <article><div class="benefit-icon green">✓</div><h3>Verified history</h3><p>Completed predictions move into the public record for transparent performance tracking.</p></article>
          <article><div class="benefit-icon blue">▣</div><h3>One research hub</h3><p>Bring fixtures, markets, predictions and match intelligence together in one place.</p></article>
        </div>
      </section>

      <section class="trust-strip">
        <div class="trust-item"><span>🔒</span><div><b>Secure checkout</b><small>Payments handled by Stripe</small></div></div>
        <div class="trust-item"><span>↻</span><div><b>Manage anytime</b><small>Use the Stripe customer portal</small></div></div>
        <div class="trust-item"><span>◎</span><div><b>Transparent records</b><small>Prediction results stay trackable</small></div></div>
        <div class="trust-item"><span>⚽</span><div><b>Football first</b><small>Built for match research</small></div></div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed,onMounted,ref} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {api} from '../services/api';
import {useAuth} from '../stores/auth';
const auth=useAuth(),route=useRoute(),router=useRouter(),plans=ref<any[]>([]),current=ref<any>(null),busy=ref(false);
const success=computed(()=>route.query.success==='1'),canceled=computed(()=>route.query.canceled==='1');
const isConfigured=(p:any,i='month')=>i==='year'?Boolean(p.yearlyConfigured):Boolean(p.monthlyConfigured);
async function checkout(plan:string,interval:'month'|'year'){if(!auth.isLoggedIn){router.push({path:'/login',query:{redirect:'/subscription'}});return}busy.value=true;try{const d=await api.post('/billing/checkout',{plan,interval,successUrl:location.origin+'/subscription?success=1',cancelUrl:location.origin+'/subscription?canceled=1'});if(d.data?.url)location.href=d.data.url}catch(e:any){alert(e.message)}finally{busy.value=false}}
async function portal(){busy.value=true;try{const d=await api.post('/billing/portal',{returnUrl:location.origin+'/subscription'});if(d.data?.url)location.href=d.data.url}catch(e:any){alert(e.message)}finally{busy.value=false}}
onMounted(async()=>{try{plans.value=(await api.get('/billing/plans')).data||[]}catch{}if(auth.isLoggedIn)try{current.value=(await api.get('/billing/me')).data?.subscription||null}catch{}});
</script>

<style scoped>
.subscription-page{min-height:calc(100vh - 72px);background:#f5f7fa;padding:30px 0 60px;color:#17243d}.subscription-shell{max-width:1180px}.pricing-hero{position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(0,1.25fr) 390px;gap:35px;min-height:330px;padding:46px 48px;border-radius:28px;background:linear-gradient(120deg,#121e36 0%,#182846 55%,#30203c 100%);box-shadow:0 20px 50px rgba(17,29,51,.16);color:#fff}.pricing-hero:after{content:"";position:absolute;width:460px;height:460px;right:-170px;top:-210px;border:1px solid #ffffff12;border-radius:50%;box-shadow:0 0 0 45px #ffffff05,0 0 0 90px #ffffff04}.pricing-hero:before{content:"";position:absolute;right:80px;bottom:-240px;width:420px;height:420px;border-radius:50%;background:#ed275f18;filter:blur(5px)}.hero-copy{position:relative;z-index:2;max-width:700px;align-self:center}.pricing-eyebrow{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:950;letter-spacing:.16em;color:#ff7298}.eyebrow-dot{width:7px;height:7px;border-radius:50%;background:#ff3e72;box-shadow:0 0 0 5px #ff3e7220}.hero-copy h1{font-size:42px;line-height:1.08;letter-spacing:-1.8px;margin:14px 0 14px}.hero-copy h1 strong{color:#fff}.hero-copy p{max-width:650px;color:#b8c4d7;font-size:14px;line-height:1.7;margin:0}.hero-proof{display:flex;flex-wrap:wrap;gap:18px;margin-top:22px}.hero-proof span{font-size:11px;color:#d8e0eb}.hero-proof b{color:#3dd19a;margin-right:5px}.hero-visual{position:relative;z-index:2;min-height:235px;display:grid;place-items:center}.orbit{position:absolute;border:1px solid #ffffff12;border-radius:50%;transform:rotate(-18deg)}.orbit-one{width:285px;height:145px}.orbit-two{width:330px;height:185px}.hero-score-card{position:relative;width:240px;padding:18px 18px 15px;background:#ffffff0d;border:1px solid #ffffff1a;border-radius:18px;backdrop-filter:blur(12px);box-shadow:0 18px 45px #00000025}.score-card-top{display:flex;justify-content:space-between;color:#aebbd0;font-size:8px;font-weight:900;letter-spacing:.1em}.score-card-top i{color:#ff5b88;font-style:normal;font-size:14px}.score-match{display:flex;justify-content:space-between;align-items:center;margin:24px 0 14px;font-size:11px;color:#d7dfeb;font-weight:900}.score-match b{font-size:19px;color:#fff}.score-bar{height:5px;border-radius:99px;background:#ffffff12;overflow:hidden}.score-bar span{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#ed275f,#ff83a5)}.score-foot{display:flex;justify-content:space-between;align-items:center;margin-top:9px}.score-foot small{font-size:8px;color:#8998ad}.score-foot strong{font-size:10px;color:#6ee0b2}.hero-badge{position:absolute;padding:8px 10px;border-radius:10px;background:#fff;color:#1b2942;font-size:9px;font-weight:950;box-shadow:0 9px 24px #00000025}.badge-top{right:7px;top:25px;color:#ed275f}.badge-bottom{left:0;bottom:25px;color:#087c4d}.notice{display:flex;gap:11px;align-items:flex-start;margin-top:15px;padding:13px 16px;border-radius:13px;border:1px solid}.notice>span{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;font-weight:950;flex:none}.notice b,.notice small{display:block}.notice b{font-size:11px}.notice small{font-size:9px;line-height:1.5;margin-top:2px;color:#66748a}.success-box{background:#eaf9f2;border-color:#cceee0;color:#087c4d}.success-box>span{background:#c8f1df}.cancel-box{background:#fff8e9;border-color:#f2dfb1;color:#7a5b0a}.cancel-box>span{background:#ffedbd}.membership-bar{display:flex;justify-content:space-between;align-items:center;margin-top:15px;background:#fff;border:1px solid #dfe5ec;border-radius:14px;padding:13px 15px;box-shadow:0 7px 22px rgba(16,24,40,.035)}.membership-status{display:flex;align-items:center;gap:10px}.status-dot{width:8px;height:8px;border-radius:50%;background:#19a76c;box-shadow:0 0 0 5px #19a76c16}.membership-status small,.membership-status b{display:block}.membership-status small{font-size:8px;color:#8993a4}.membership-status b{font-size:12px;margin-top:3px}.membership-status em{font-style:normal;color:#9ba4b1}.membership-bar .ghost{font-size:10px}.membership-bar .ghost span{margin-left:7px}.plans-section{margin-top:42px}.section-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:18px}.eyebrow{display:block;color:#ed275f;font-size:9px;font-weight:950;letter-spacing:.14em}.section-heading h2,.why-heading h2{font-size:28px;letter-spacing:-.8px;margin:6px 0 5px}.section-heading p,.why-heading p{font-size:11px;color:#7b879a;margin:0}.billing-note{display:flex;align-items:center;gap:7px;padding:9px 11px;background:#fff;border:1px solid #e1e6ed;border-radius:10px;color:#66748a;font-size:9px;font-weight:800}.secure-dot{width:6px;height:6px;border-radius:50%;background:#19a76c}.plans-grid-pro{display:grid;grid-template-columns:1fr 1fr;gap:17px}.plan-card{position:relative;background:#fff;border:1px solid #dce3eb;border-radius:21px;padding:27px 27px 24px;box-shadow:0 9px 30px rgba(16,24,40,.045);transition:.2s}.plan-card:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(16,24,40,.08)}.plan-card.featured{border:2px solid #ed275f;box-shadow:0 15px 40px #ed275f16}.popular-ribbon{position:absolute;right:0;top:0;background:#ed275f;color:#fff;border-radius:0 19px 0 12px;padding:8px 13px;font-size:7px;font-weight:950;letter-spacing:.08em}.plan-card-head{display:flex;align-items:center;gap:12px}.plan-icon{width:43px;height:43px;border-radius:13px;display:grid;place-items:center;font-size:19px;font-weight:900}.lite-icon{background:#edf2f7;color:#52627a}.premium-icon{background:#ffe8ef;color:#ed275f}.plan-tier{font-size:9px;text-transform:uppercase;letter-spacing:.1em;font-weight:950;color:#ed275f}.plan-card h3{font-size:24px;margin:2px 0 0;letter-spacing:-.5px}.plan-description{font-size:11px;color:#7b879a;line-height:1.6;min-height:35px;margin:17px 0}.plan-price{display:flex;align-items:baseline;gap:7px;padding:16px 0 13px}.plan-price strong{font-size:27px;letter-spacing:-.8px}.plan-price span{font-size:10px;color:#8993a4}.plan-divider{height:1px;background:#edf0f4}.includes{font-size:9px;font-weight:900;color:#3e4e68;margin:15px 0 4px}.feature-list{padding:0;margin:0;list-style:none}.feature-list li{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid #f0f2f5;color:#637187;font-size:10px}.feature-list li span{color:#0aa066;font-weight:950}.plan-actions{margin-top:17px}.plan-primary{width:100%;border:0;border-radius:11px;padding:13px 15px;background:#17243d;color:#fff;font-weight:950;font-size:11px;cursor:pointer;box-shadow:0 8px 18px #17243d16}.plan-primary.premium{background:linear-gradient(100deg,#ed275f,#ff4c82);box-shadow:0 10px 22px #ed275f25}.plan-primary:disabled{opacity:.55;cursor:not-allowed;box-shadow:none}.plan-primary span{float:right}.yearly-link{display:block;width:100%;border:0;background:none;color:#7a8699;font-size:9px;font-weight:850;padding:10px 0 0;cursor:pointer}.yearly-link span{color:#ed275f;margin-left:4px}.why-premium{margin-top:55px}.why-heading{margin-bottom:18px}.benefit-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:11px}.benefit-grid article{background:#fff;border:1px solid #e0e5ec;border-radius:15px;padding:17px;min-height:135px}.benefit-icon{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;font-weight:950;margin-bottom:12px}.benefit-icon.pink{background:#ffe8ef;color:#ed275f}.benefit-icon.purple{background:#eee9ff;color:#7654df}.benefit-icon.green{background:#e7f8f0;color:#07945b}.benefit-icon.blue{background:#e8f1ff;color:#3b72cf}.benefit-grid h3{font-size:12px;margin:0 0 5px}.benefit-grid p{font-size:9px;line-height:1.55;color:#8993a4;margin:0}.trust-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:30px;background:#17243d;border-radius:15px;padding:15px 17px}.trust-item{display:flex;align-items:center;gap:9px;padding:3px 16px;border-right:1px solid #ffffff14}.trust-item:first-child{padding-left:2px}.trust-item:last-child{border-right:0}.trust-item>span{font-size:16px}.trust-item b,.trust-item small{display:block}.trust-item b{color:#fff;font-size:9px}.trust-item small{color:#9daac0;font-size:7px;margin-top:3px}
@media(max-width:900px){.pricing-hero{grid-template-columns:1fr;padding:35px 30px}.hero-visual{min-height:205px}.plans-grid-pro{grid-template-columns:1fr}.benefit-grid{grid-template-columns:1fr 1fr}.trust-strip{grid-template-columns:1fr 1fr;gap:10px}.trust-item:nth-child(2){border-right:0}.trust-item{padding:8px}.trust-item:first-child{padding-left:8px}.section-heading{align-items:flex-start;flex-direction:column}}
@media(max-width:600px){.subscription-page{padding:15px 0 35px}.pricing-hero{padding:28px 21px;border-radius:20px;min-height:auto}.hero-copy h1{font-size:31px;letter-spacing:-1px}.hero-copy p{font-size:12px}.hero-proof{gap:8px;display:grid}.hero-visual{min-height:190px}.hero-score-card{width:220px}.badge-top{right:-2px;top:17px}.badge-bottom{left:-2px;bottom:10px}.section-heading h2,.why-heading h2{font-size:23px}.plan-card{padding:21px}.benefit-grid{grid-template-columns:1fr}.trust-strip{grid-template-columns:1fr}.trust-item,.trust-item:nth-child(2){border-right:0;border-bottom:1px solid #ffffff14}.trust-item:last-child{border-bottom:0}.membership-bar{align-items:flex-start;gap:12px;flex-direction:column}.membership-bar .ghost{width:100%}}
</style>
