<template>
  <section class="pro-panel reports-page">
    <div class="pro-section-head td-page-head">
      <div>
        <span class="eyebrow">{{ variant === 'tipster' ? 'Tipster support' : 'Member support' }}</span>
        <h1>Reports &amp; Support</h1>
        <p>Report a problem with a tip, flag a bug or technical issue, or raise a payment/subscription dispute. Our team reviews every submission.</p>
      </div>
    </div>

    <div class="report-form-card">
      <div class="td-form-section">
        <div class="td-section-label"><span>1</span><div><b>What's this about?</b><small>Pick the category that best matches your issue</small></div></div>
        <div class="category-grid">
          <button
            v-for="c in categories"
            :key="c.value"
            type="button"
            class="category-option"
            :class="{ active: form.category === c.value }"
            @click="form.category = c.value"
          >
            <span class="category-icon">{{ c.icon }}</span>
            <span><b>{{ c.label }}</b><small>{{ c.hint }}</small></span>
          </button>
        </div>
      </div>

      <div class="td-form-section">
        <div class="td-section-label"><span>2</span><div><b>Details</b><small>Give us enough context to look into this quickly</small></div></div>
        <div class="field">
          <label>Subject</label>
          <input v-model="form.subject" maxlength="150" placeholder="A short summary of the issue" />
        </div>
        <div class="field">
          <label>Description</label>
          <textarea v-model="form.description" maxlength="3000" rows="5" placeholder="What happened? Include any relevant details (which tip, match, transaction, etc.)"></textarea>
          <div class="td-counter">{{ form.description.length }}/3000</div>
        </div>
        <div class="td-fields-three reference-fields">
          <div class="field">
            <label>Reference type (optional)</label>
            <select v-model="form.targetType">
              <option value="">None</option>
              <option value="prediction">Prediction / tip</option>
              <option value="tipster">Tipster</option>
              <option value="transaction">Transaction / payment</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="user">User</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="field" style="grid-column: span 2">
            <label>Reference ID or link (optional)</label>
            <input v-model="form.targetId" maxlength="60" placeholder="e.g. prediction ID or URL" />
          </div>
        </div>
      </div>

      <div class="td-submit-foot">
        <div><b>We typically respond within 1–2 business days.</b><span>Financial disputes are prioritised automatically.</span></div>
        <button class="btn" :disabled="!canSubmit || submitting" @click="submit">
          <BrandedLoader v-if="submitting" label="Submitting" />
          <template v-else>Submit report</template>
        </button>
      </div>
      <div v-if="error" class="error mt-3">{{ error }}</div>
    </div>

    <div class="bt-card reports-history">
      <div class="bt-card-head">
        <div class="bt-card-heading"><span class="section-kicker">YOUR REPORTS</span><h2>Submission history</h2><p>Track the status of everything you've reported.</p></div>
      </div>

      <div v-if="loading" class="td-history-loading">Loading…</div>
      <div v-else-if="reports.length" class="reports-list">
        <div v-for="r in reports" :key="r._id" class="report-row">
          <div class="report-row-main">
            <div class="report-row-top">
              <span class="tag category-tag">{{ categoryLabel(r.category) }}</span>
              <em :class="'td-status-pill ' + r.status">{{ statusLabel(r.status) }}</em>
            </div>
            <b>{{ r.subject }}</b>
            <small>{{ formatDate(r.createdAt) }}</small>
          </div>
          <p class="report-row-desc">{{ r.description }}</p>
          <div v-if="r.adminNote" class="report-admin-note"><b>Team response:</b> {{ r.adminNote }}</div>
        </div>
      </div>
      <EmptyState v-else title="No reports yet" message="Anything you submit will show up here so you can track its status." />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { api } from '../services/api';
import { useToast } from '../composables/feedback';
import { formatDate } from '../utils/formatters';
import EmptyState from '../components/EmptyState.vue';
import BrandedLoader from '../components/BrandedLoader.vue';

withDefaults(defineProps<{ variant?: 'member' | 'tipster' }>(), { variant: 'member' });

const categories = [
  { value: 'content', label: 'Content report', hint: 'A tip, prediction or tipster that looks wrong or abusive', icon: '🚩' },
  { value: 'support', label: 'Bug / technical issue', hint: 'Something on the site is broken or not working', icon: '🛠' },
  { value: 'financial', label: 'Payment / financial issue', hint: 'Subscription, withdrawal or transaction dispute', icon: '💳' }
] as const;

const form = reactive({ category: '' as '' | 'content' | 'support' | 'financial', subject: '', description: '', targetType: '', targetId: '' });
const submitting = ref(false);
const error = ref('');
const reports = ref<any[]>([]);
const loading = ref(false);
const { show } = useToast();

const canSubmit = computed(() => !!form.category && form.subject.trim().length >= 3 && form.description.trim().length >= 10);

function categoryLabel(v: string) { return v === 'content' ? 'Content report' : v === 'financial' ? 'Financial dispute' : 'Support ticket'; }
function statusLabel(v: string) { return ({ open: 'Open', in_progress: 'In progress', resolved: 'Resolved', rejected: 'Rejected', closed: 'Closed' } as Record<string, string>)[v] || v; }

async function load() {
  loading.value = true;
  try { reports.value = (await api.get('/me/reports')).data || []; }
  catch { reports.value = []; }
  finally { loading.value = false; }
}

async function submit() {
  if (!canSubmit.value) return;
  submitting.value = true; error.value = '';
  try {
    const body: any = { category: form.category, subject: form.subject.trim(), description: form.description.trim() };
    if (form.targetType) body.targetType = form.targetType;
    if (form.targetId.trim()) body.targetId = form.targetId.trim();
    const d = await api.post('/me/reports', body);
    show(d.message || 'Report submitted.', 'success');
    form.category = ''; form.subject = ''; form.description = ''; form.targetType = ''; form.targetId = '';
    await load();
  } catch (e: any) {
    error.value = e?.message || 'Unable to submit your report. Please try again.';
    show(error.value, 'error');
  } finally { submitting.value = false; }
}

onMounted(load);
</script>

<style scoped>
.reports-page .td-page-head{margin-bottom:18px}
.report-form-card{background:#fff;border:1px solid var(--border,#e6eaf0);border-radius:16px;padding:22px 24px;margin-bottom:22px}
.category-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.category-option{display:flex;align-items:flex-start;gap:10px;text-align:left;padding:14px;border:1px solid #e0e5ec;border-radius:12px;background:#fafbfd;cursor:pointer;transition:border-color .15s,background .15s}
.category-option:hover{border-color:#d8dee8}
.category-option.active{border-color:#ed275f;background:#fff5f8}
.category-option b{display:block;font-size:13px}
.category-option small{display:block;color:#8a95a5;font-size:11px;margin-top:3px;line-height:1.4}
.category-icon{font-size:20px;flex:none}
.reference-fields{grid-template-columns:1fr 2fr}
.reports-history{margin-top:0}
.reports-list{display:grid;gap:14px}
.report-row{border:1px solid #edf0f3;border-radius:12px;padding:14px 16px}
.report-row-main{display:flex;flex-direction:column;gap:3px;margin-bottom:8px}
.report-row-top{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.report-row-main b{font-size:14px}
.report-row-main small{color:#9aa3b1;font-size:11px}
.report-row-desc{margin:0;color:#55637a;font-size:13px;line-height:1.5;white-space:pre-wrap}
.report-admin-note{margin-top:10px;padding:10px 12px;border-radius:9px;background:#eef4ff;color:#25334d;font-size:12px;line-height:1.5}
.category-tag{background:#f1f3f6;color:#657287}
.td-history-loading{padding:24px;color:#8a95a5;font-size:13px}
@media(max-width:760px){.category-grid{grid-template-columns:1fr}.reference-fields{grid-template-columns:1fr}}
</style>
