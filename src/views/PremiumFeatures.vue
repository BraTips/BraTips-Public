<template><div class="premium-page page-animate"><div class="wrap"><section class="premium-hero"><span class="eyebrow">BraTipsters Premium</span><h1>Go <strong>PREMIUM</strong> to unlock all content.</h1><p>Get full access to the football research tools, premium tips and deeper performance information that help you make better-informed decisions.</p><RouterLink to="/subscription" class="btn">View Premium plans</RouterLink></section><section class="premium-intro"><h2>Get full access to the following:</h2><div class="premium-grid"><article v-for="f in features" :key="f.title" class="premium-feature"><div class="feature-icon">{{f.icon}}</div><div><h3>{{f.title}}</h3><p>{{f.text}}</p></div></article></div></section></div></div></template>
<script setup lang="ts">import {RouterLink} from 'vue-router';const features=[
{icon:'✉',title:'Email Notifications',text:'Follow your favorite tipsters and receive an email alert when they publish a new tip.'},
{icon:'✓',title:'Tipster Tips',text:'Access premium football tips from BraTipsters tipsters, with picks, odds and match reasoning where available.'},
{icon:'▣',title:'All Daily Football Tips',text:'Daily football accumulator, Bet of the Day, and dedicated tips pages including BTTS, Over 2.5 Goals and Corners.'},
{icon:'↘',title:'Dropping Odds',text:'Use the dropping odds tracker to follow live changes and price drops for supported football matches.'},
{icon:'＋',title:'Dropping Odds Plus+',text:'Track additional sports price drops and access dedicated late-drop intelligence as the product expands.'},
{icon:'xG',title:'xGoals (Expected Goals)',text:'Compare recent expected-goals averages to understand the quality of chances teams have created.'},
{icon:'↗',title:'Trend Signals',text:'Review goals, BTTS, corners and team-streak data for supported football fixtures in one section.'},
{icon:'H2H',title:'League-focused H2H records',text:'Review head-to-head records with league matches separated from domestic cups and European competitions.'},
{icon:'W',title:'Easy-to-read results',text:'Understand winning teams and outcomes quickly with simple indicators for Over 2.5, Under 2.5 and BTTS.'},
{icon:'▥',title:'Extensive Gameplay Stats',text:'Check home and away performance including goals, possession, corners and shots, with useful context against league averages.'},
{icon:'▤',title:'Disciplinary Stats',text:'Review fouls, tackles, cards, penalties and offsides where available.'},
{icon:'#',title:'Standings',text:'View standings for the supported football leagues we cover.'}];</script>
