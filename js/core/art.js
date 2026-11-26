/* PRO SIM – illustrations des cartes (SVG généré, sans fichier).
   Style « scène » : fond teinté, grand disque en haut à droite, deux personnages, un objet central, sol coloré.
   • Les 8 spécialités gardent leur illustration d'origine (clé = nom de la spécialité).
   • Les métiers réutilisent ces mêmes illustrations (voir JOB_ART) ; « droit » est la nouvelle illustration (balance de la justice). */
const ART={
  'Finance':{col:'#0f7b6c',obj:()=>`<rect x="134" y="84" width="15" height="24" rx="3"/><rect x="155" y="58" width="15" height="50" rx="3"/><rect x="176" y="72" width="15" height="36" rx="3"/>`},
  'Audit':{col:'#6d4fd1',obj:()=>`<rect x="136" y="58" width="44" height="50" rx="7"/><rect x="144" y="70" width="22" height="4" rx="2" fill="#fff" opacity=".55"/><rect x="144" y="80" width="28" height="4" rx="2" fill="#fff" opacity=".4"/><circle cx="184" cy="98" r="11" fill="#0e2640" stroke="currentColor" stroke-width="4.5"/><path d="M192 106l11 11" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`},
  'Contrôle de gestion':{col:'#2563eb',obj:()=>`<path d="M128 108a36 36 0 0 1 72 0z"/><path d="M164 108l13-26" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><circle cx="164" cy="108" r="4" fill="#fff"/>`},
  'Commerce':{col:'#e8761b',obj:()=>`<rect x="132" y="58" width="46" height="27" rx="10"/><path d="M144 84l-4 11 13-11z"/><rect x="160" y="90" width="48" height="27" rx="10" opacity=".62"/><path d="M196 116l5 10-14-10z" opacity=".62"/>`},
  'Logistique':{col:'#0891b2',obj:()=>`<rect x="150" y="62" width="28" height="28" rx="3"/><rect x="134" y="92" width="28" height="28" rx="3" opacity=".78"/><rect x="166" y="92" width="28" height="28" rx="3" opacity=".6"/>`},
  'Marketing':{col:'#d6336c',obj:()=>`<path d="M138 82l40-24v58l-40-18z"/><rect x="127" y="79" width="16" height="20" rx="4"/><path d="M146 100l6 20h10l-6-18z" opacity=".75"/><circle cx="194" cy="87" r="5"/>`},
  'Entrepreneuriat':{col:'#d99a0b',obj:()=>`<circle cx="164" cy="80" r="24"/><path d="M155 98h18v10a9 9 0 0 1-18 0z" opacity=".78"/><rect x="153" y="108" width="22" height="9" rx="4"/><path d="M153 72a14 14 0 0 1 9-9" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/>`},
  'Management':{col:'#3f8f2f',obj:()=>`<rect x="148" y="56" width="32" height="16" rx="4"/><path d="M164 72v12M142 96v-6a3 3 0 0 1 3-3h38a3 3 0 0 1 3 3v6" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="128" y="96" width="30" height="16" rx="4"/><rect x="170" y="96" width="30" height="16" rx="4"/>`},
  /* nouvelle illustration : droit, conformité */
  'droit':{col:'#d9483b',obj:()=>`<circle cx="164" cy="58" r="5"/><path d="M164 62v46M146 110h36" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M134 70h60" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/><path d="M138 70l-14 22M138 70l14 22M190 70l-14 22M190 70l14 22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M120 92h36a18 14 0 0 1-36 0zM172 92h36a18 14 0 0 1-36 0z"/>`}
};
/* Métier → illustration : [secteur][rang du métier dans le secteur] (ordre de js/data/sectors.js) */
const JOB_ART=[
  ['Audit','Contrôle de gestion','Finance','Audit','Finance','Contrôle de gestion'],
  ['Commerce','Marketing','Commerce','Marketing','Commerce','Marketing'],
  ['Logistique','Logistique','Logistique','Logistique','Logistique','Logistique'],
  ['droit','droit','droit','droit','droit','droit'],
  ['Management','Entrepreneuriat','Contrôle de gestion','Entrepreneuriat','Management','Audit'],
  ['Management','Management','Contrôle de gestion','Entrepreneuriat','Audit']
];
const PEOPLE_SKIN=['#f2c9a0','#c98a5e','#8a5a3a','#e9b88a'];
const PEOPLE_OUT=['#e8761b','#2563eb','#d6336c','#141d3a','#1fa97a'];
/* Une scène : key = clé de ART, seed = nombre (varie les personnages d'une carte à l'autre) */
function sceneSvg(key,seed=0){
  const a=ART[key]||ART.Management,c=a.col,s=Math.abs(seed|0);
  const sk=i=>PEOPLE_SKIN[(s+i*2)%PEOPLE_SKIN.length],ou=i=>PEOPLE_OUT[(s*3+i*2+1)%PEOPLE_OUT.length];
  const man=(x,i)=>`<circle cx="${x}" cy="104" r="16" fill="${sk(i)}"/><path d="M${x-21} 186V146a21 21 0 0 1 42 0v40z" fill="${ou(i)}"/>`;
  return `<svg class="scn" viewBox="0 0 320 186" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" style="color:${c}">`
    +`<rect width="320" height="186" fill="#0e2640"/><rect width="320" height="186" fill="${c}" opacity=".2"/>`
    +`<circle cx="292" cy="24" r="48" fill="${c}" opacity=".3"/>`
    +man(84,0)+man(240,1)
    +`<g fill="${c}" opacity=".92">${a.obj()}</g>`
    +`<rect y="164" width="320" height="22" fill="${c}" opacity=".62"/></svg>`;
}
/* Illustration d'un parcours : spécialité → son illustration ; métier → celle de son secteur / rang */
function trackArt(t){
  if(t.kind==='s')return{key:t.n,svg:sceneSvg(t.n,t.fi)};
  const si=t.si,rk=TRK.filter(x=>x.kind==='j'&&x.si===si).findIndex(x=>x.id===t.id),key=(JOB_ART[si]||[])[rk]||'Management';
  return{key,svg:sceneSvg(key,t.id+1)};
}
