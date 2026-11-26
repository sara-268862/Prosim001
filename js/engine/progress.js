/* Progression : XP, série quotidienne, succès (communs aux métiers et aux spécialités), défi du jour */
const BADGES=[
{id:'first',n:'Première mission',d:'Terminer une simulation.',i:'🚀',t:()=>D.hist.length>=1},
{id:'ten',n:'Habitué',d:'Terminer 10 simulations.',i:'📚',t:()=>D.hist.length>=10},
{id:'thirty',n:'Infatigable',d:'Terminer 30 simulations.',i:'🏋️',t:()=>D.hist.length>=30},
{id:'perfect',n:'Sans faute',d:'Obtenir 15/15 à un niveau.',i:'🎯',t:c=>c.total>=100&&!c.mode},
{id:'solid',n:'Solide',d:'Obtenir au moins 80/100.',i:'⭐',t:c=>c.total>=80&&!c.mode},
{id:'hard',n:'Esprit d’acier',d:'Réussir un niveau 4 ou 5, métier ou spécialité.',i:'🛡️',t:c=>!c.mode&&c.pass&&c.lv>=4},
{id:'s3',n:'Régulier',d:'3 jours d’activité d’affilée.',i:'🔥',t:()=>D.bestStreak>=3},
{id:'s7',n:'Assidu',d:'7 jours d’activité d’affilée.',i:'🏆',t:()=>D.bestStreak>=7},
{id:'daily',n:'Rendez-vous du jour',d:'Terminer un défi du jour.',i:'📅',t:c=>c.mode==='daily'},
{id:'fix',n:'Je progresse',d:'Corriger 10 erreurs en révision.',i:'✅',t:()=>D.fixed>=10},
{id:'l5',n:'Niveau 5',d:'Atteindre le niveau 5.',i:'🎖️',t:()=>lvlOf(D.xp)>=5}];
function unlock(c){const nb=[];BADGES.forEach(b=>{if(!D.badges[b.id]&&b.t(c)){D.badges[b.id]=Date.now();nb.push(b)}});return nb}
/* Série de jours consécutifs */
function bumpStreak(){const t=ymd(),y=ymd(new Date(Date.now()-864e5));if(D.lastDay===t)return;D.streak=D.lastDay===y?D.streak+1:1;D.lastDay=t;D.bestStreak=Math.max(D.bestStreak,D.streak)}
const streakNow=()=>{const t=ymd(),y=ymd(new Date(Date.now()-864e5));return D.lastDay===t||D.lastDay===y?D.streak:0};
function seeded(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const dailyDone=()=>D.daily.date===ymd();
/* Jauge d'XP réutilisée sur l'accueil et le profil */
function xpBar(){const l=lvlOf(D.xp),into=lvlStart(l+1)-lvlStart(l),have=D.xp-lvlStart(l);
return `<div class="xp"><div class="row"><b>Niveau ${l} · ${rankOf(l)}</b><span class="muted">${D.xp} XP</span></div><div class="bar" role="progressbar" aria-label="Progression vers le niveau ${l+1}" aria-valuemin="0" aria-valuemax="${into}" aria-valuenow="${have}"><i style="width:${Math.round(have/into*100)}%"></i></div><small class="muted">${into-have} XP avant le niveau ${l+1}</small></div>`}
