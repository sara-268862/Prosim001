/* Navigation (avec adresses #…, retour du navigateur), boutons son/musique/thème, raccourcis clavier, démarrage */
const VIEWS={home,missions,jobs,trk,trun,trep,dash,login,register,recovery,recov,profile,board,review,char,admin,suggest};
const NAVMAP={char:'home',suggest:'jobs',home:'home',missions:'missions',jobs:'jobs',dash:'dash',review:'review',board:'board'};
/* Spécialités et métiers partagent les mêmes vues : l'onglet actif suit la nature du parcours */
function navKey(v){if(v==='trk')return TK[TRK[tcur].kind].nav;if(v==='trun'||v==='trep')return PS&&PS.mode?(PS.mode==='review'?'review':'home'):PS&&TK[TRK[PS.id].kind].nav;return NAVMAP[v]}
let curHash='';
const live=()=>view==='trun'&&PS&&!PS.res;
const QUIT=()=>PS&&PS.mode?'Quitter la mission en cours ? Votre progression sur cette mission sera perdue.':'Quitter le niveau en cours ? Il sera sauvegardé et vous pourrez le reprendre.';
function nav(v,fromHash){
if(live()&&!['trun','trep'].includes(v)&&!fromHash&&!confirm(t(QUIT())))return;
stopT();
if((v==='trun'&&!PS)||(v==='trep'&&!(PS&&PS.res))||!VIEWS[v])v='home';
if(!TRK[tcur])tcur=0;
view=v;document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===navKey(v)));scrollTo(0,0);col();
if(!fromHash){const h='#'+v+(v==='trk'?'/'+tcur:'');if(location.hash!==h){curHash=h;location.hash=h}}
VIEWS[v]();app.setAttribute('tabindex','-1');const h=app.querySelector('h1,h2');if(h&&v!=='trun'){h.setAttribute('tabindex','-1')}}
function route(){const[v,a]=location.hash.slice(1).split('/');if(v==='trk')tcur=Math.min(TRK.length-1,Math.max(0,+a||0));curHash=location.hash;nav(VIEWS[v]?v:'home',true)}
addEventListener('hashchange',()=>{if(location.hash===curHash)return;
if(live()&&!confirm(t(QUIT()))){location.hash=curHash;return}route()});

document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>nav(b.dataset.v));
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;e.preventDefault();const mn=$('#mn');if(mn)mn.hidden=true;nav(b.dataset.go)});
$('#sfx').onclick=e=>{sfxOn=!sfxOn;e.target.classList.toggle('on',sfxOn);e.target.setAttribute('aria-pressed',sfxOn);if(sfxOn)sfx('ok')};$('#mus').onclick=e=>{music(!musOn);e.target.classList.toggle('on',musOn);e.target.setAttribute('aria-pressed',musOn)};
Auth.restore();initTheme();renderHeader();I18N.init();
if(!LS.ok)toast('Stockage du navigateur indisponible : comptes et progression ne seront pas conservés.');
location.hash&&VIEWS[location.hash.slice(1).split('/')[0]]?route():nav('home');
