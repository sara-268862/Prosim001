/* Utilitaires et conteneurs globaux */
const $=s=>document.querySelector(s),app=$('#app');
const BANK={};   // banques de scénarios, une par spécialité
const F=[];      // spécialités (js/data/fields)
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const col=()=>app.style.setProperty('--acc','#0e7490');
