/* PRO SIM – PARCOURS : un seul système pour les Métiers (kind 'j') et les Spécialités (kind 's').
   Mêmes niveaux, mêmes questions, mêmes règles, même progression, mêmes récompenses, même économie.
   Seul le contenu diffère : les métiers génèrent leurs questions depuis les 15 scénarios de base ; les spécialités
   y ajoutent leurs banques rédigées à la main (js/data/banks). Les identifiants 0..34 restent ceux des métiers. */
const TK={j:{one:'métier',many:'Métiers',nav:'jobs'},s:{one:'spécialité',many:'Spécialités',nav:'missions'}};
/* Rattachement de chaque spécialité à un secteur (index dans SECT) et objet / interlocuteur utilisés dans les scénarios */
const SPEC_META=[[0,'le plan de trésorerie','le directeur financier'],[0,'le dossier d’audit','l’associée du cabinet'],[0,'le tableau de bord de gestion','le directeur général'],[1,'le compte client','le directeur commercial'],[2,'la chaîne logistique','le responsable d’entrepôt'],[1,'la campagne de communication','la directrice marketing'],[4,'le projet de lancement','l’investisseur'],[5,'l’équipe et ses objectifs','la directrice générale']];
const TRK=JOBS.map(j=>({id:j.id,kind:'j',si:j.si,n:j.n,o:j.o,w:j.w}));
F.forEach((f,fi)=>{const m=SPEC_META[fi]||[0,'le dossier','le responsable'];TRK.push({id:TRK.length,kind:'s',fi,si:m[0],n:f.n,o:m[1],w:m[2],ro:f.ro,ctx:f.ctx,car:f.car})});
const trks=kind=>TRK.filter(t=>!kind||t.kind===kind);
const tierOf=lv=>lv<=2?'deb':lv===3?'int':'hard';
const EXTRA=['Reporter la décision en attendant que la situation se clarifie d’elle-même','Déléguer sans critère ni suivi','Suivre l’avis le plus insistant sans le vérifier','Ne rien changer et observer'];
/* Les 15 questions d'un parcours et d'un niveau : contenu stable (graine = parcours + niveau), propositions mélangées à chaque tentative */
function catQ(t,ci,lv,r){const c=CAT[ci],n=3+Math.floor(r()*(4+lv*3)),f=x=>fill(x,t,n);return{cat:c[0],s:f(c[1]),q:c[2],e:f(c[5]),sk:CSK[ci],o:shuf([{t:f(c[3]),ok:1},...c[4].map(x=>({t:f(x),ok:0}))])}}
function bankQ(t,band,j,r){const q=BANK[t.n][band][j],sq=SQ(q[2],q[0],t.fi);return{cat:t.n+' · '+SK[q[1]],s:sq.s,q:sq.q,e:q[6],sk:q[1],o:shuf([{t:q[3],ok:1},{t:q[4],ok:0},{t:q[5],ok:0},{t:EXTRA[Math.floor(r()*EXTRA.length)],ok:0}])}}
function trackQs(t,lv){const r=seeded('pm'+t.id+'/'+lv);let L;
if(t.kind==='j')L=shuf(CAT.map((_,i)=>i),r).map(ci=>catQ(t,ci,lv,r));
else{const band=tierOf(lv),B=(BANK[t.n]||{})[band]||[],take=Math.min(B.length,lv===3?10:8),bk=shuf(B.map((_,i)=>i),r).slice(0,take).map(j=>bankQ(t,band,j,r)),
gen=shuf(CAT.map((_,i)=>i),r).slice(0,PRO.q-bk.length).map(ci=>catQ(t,ci,lv,r));L=shuf([...bk,...gen],r)}
return L.map((q,k)=>Object.assign(q,{tid:t.id,lv,k}))}
/* Progression : D.pro.jobs[id] = {lv: niveau débloqué, best:{niveau:{good,score,pass,ts}}, last, runs} — id = identifiant de parcours (métier ou spécialité) */
const proD=(d=D)=>d.pro||(d.pro={jobs:{}});
const jp=(id,d=D)=>{const p=proD(d);return p.jobs[id]||(p.jobs[id]={lv:1,best:{},last:{},runs:[]})};
const pct100=b=>b?Math.round(b.good/PRO.q*100):0;
const mastered=(id,d=D)=>{const p=((d.pro||{}).jobs||{})[id];return!!p&&[1,2,3,4,5].every(l=>p.best[l]&&p.best[l].pass)};
const tried=(t,d=D)=>{const p=((d.pro||{}).jobs||{})[t.id];return!!p&&(p.runs||[]).length>0};
function proStats(d=D,kind){const J=(d.pro&&d.pro.jobs)||{},L=trks(kind);let sum=0,levels=0,m=0,runs=0,passed=0;
L.forEach(t=>{const p=J[t.id];if(!p)return;let n=0;for(let l=1;l<=PRO.lv;l++){const b=p.best&&p.best[l];if(b){sum+=b.score;if(b.pass){levels++;n++}}}if(n===PRO.lv)m++;(p.runs||[]).forEach(x=>{runs++;if(x.pass)passed++})});
return{score:Math.max(0,sum),levels,mastered:m,runs,passed,count:L.length,total:L.length*PRO.lv,pct:Math.round(levels/(L.length*PRO.lv)*100)}}
/* Mise à niveau des anciennes données : erreurs de l'ancien format retirées ; anciens scores de spécialités (≥ 70/100) convertis en niveaux réussis */
function upgradeData(d){if(d.v4)return d;d.errors=(d.errors||[]).filter(e=>e&&e.tid!=null);
const P=proD(d);TRK.filter(t=>t.kind==='s').forEach(t=>{[['deb',1],['int',3],['hard',5]].forEach(([dg,top])=>{const b=Math.max(0,...(d.hist||[]).filter(h=>h.f===t.n&&h.diff===dg&&!h.mode).map(h=>h.total));
if(b<70)return;const p=jp(t.id,d),good=Math.max(PRO.pass,Math.round(b/100*PRO.q)),rec={good,score:good*PRO.ok+(PRO.q-good)*PRO.ko,pass:true,ts:Date.now()};
for(let l=1;l<=top;l++)if(!p.best[l])p.best[l]=rec;p.lv=Math.max(p.lv,Math.min(PRO.lv,top+1));p.migrated=1})});d.v4=1;return d}
/* Défi du jour : 5 questions (parcours de toute nature), identiques pour tout le monde à une date donnée */
function dailyQs(){const r=seeded('dw'+ymd());return shuf(TRK.map(t=>t.id),r).slice(0,5).map(id=>{const lv=1+Math.floor(r()*3),k=Math.floor(r()*PRO.q),t=TRK[id];return Object.assign(trackQs(t,lv)[k],{label:'Défi du jour · '+t.n})})}
function reviewQs(){return D.errors.slice(0,10).map(e=>{const t=TRK[e.tid],q=t&&trackQs(t,e.lv)[e.k];return q&&Object.assign(q,{label:'Révision · '+t.n})}).filter(Boolean)}
/* Carnet de révision : toute erreur (ou temps écoulé), métier ou spécialité, y est enregistrée jusqu'à correction */
function noteError(q,ok,mode){const k=D.errors.findIndex(e=>e.tid===q.tid&&e.lv===q.lv&&e.k===q.k);
if(!ok){if(k<0)D.errors.push({tid:q.tid,lv:q.lv,k:q.k,n:1,ts:Date.now()});else D.errors[k].n++}else if(mode==='review'&&k>=0){D.errors.splice(k,1);D.fixed++}}
/* Sérialisation sûre (import) */
function cleanPro(x){const o={jobs:{}};if(!x||typeof x.jobs!=='object')return o;TRK.forEach(t=>{const p=x.jobs[t.id];if(!p||typeof p!=='object')return;const q=jp(t.id,{pro:o});
q.lv=Math.min(PRO.lv,Math.max(1,+p.lv||1));for(let l=1;l<=PRO.lv;l++){const b=p.best&&p.best[l];if(b&&Number.isFinite(+b.good))q.best[l]={good:Math.min(PRO.q,Math.max(0,+b.good)),score:+b.score||0,pass:!!b.pass,ts:+b.ts||0}}
q.runs=(Array.isArray(p.runs)?p.runs:[]).slice(-60).filter(z=>z&&Number.isFinite(+z.good)).map(z=>({lv:+z.lv||1,good:+z.good,score:+z.score||0,pass:!!z.pass,ts:+z.ts||0}))});return o}

const sOf=(kind,f)=>trks(kind).filter(f).length;
/* Succès identiques pour chaque nature de parcours (ids historiques : jlv, jmas, four, all) */
[['j','jlv','jmas','jfour','jall','Pro en marche','Métier maîtrisé','métier','métiers','💼','🏅'],['s','slv','smas','four','all','Spécialiste en marche','Spécialité maîtrisée','spécialité','spécialités','🎓','🥇']].forEach(([k,lv,ms,fo,al,n1,n2,one,many,i1,i2])=>{
const N=trks(k).length;
BADGES.push({id:lv,n:n1,d:'Réussir un niveau de '+one+' (10/15).',i:i1,t:()=>proStats(D,k).levels>=1},{id:ms,n:n2,d:'Réussir les 5 niveaux d’une '+one+'.'.replace('d’une métier','d’un métier'),i:i2,t:()=>proStats(D,k).mastered>=1},
{id:fo,n:k==='s'?'Curieux':'Curieux · métiers',d:'Essayer 4 '+many+'.',i:'🧭',t:()=>sOf(k,t=>tried(t))>=4},{id:al,n:k==='s'?'Touche-à-tout':'Tour complet · métiers',d:'Essayer les '+N+' '+many+'.',i:'🌍',t:()=>sOf(k,t=>tried(t))>=N})});
