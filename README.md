# PRO SIM – Simulateur Professionnel Marocain

Plateforme de simulation et de formation professionnelle : simulations par métier, évaluations, progression, avatar personnalisable, gestion des utilisateurs et administration. Elle réunit le **simulateur de métiers marocains** (ci-dessous) et les **huit spécialités** historiques (reste du document).

## Rangs, comptes, suggestions, administration, stockage
- **Rangs** (`js/engine/rewards.js`) : Stagiaire Terrain, Analyste Confirmé, Chef de Mission, Manager Senior, Directeur Exécutif = niveaux d'XP 1 à 5 (seuils 0, 50, 200, 450, 800 XP). Niveau 1 : blazer, Smart Casual, hijab classique, coiffures courtes ; niveau 2 : costume gris, coiffures longues et attachées, hijab moderne ; niveau 3 : casque audio et pin's ; niveau 4 : tenue de direction dorée ; niveau 5 : maîtrise complète. Éléments verrouillés visibles (🔒) dans le studio d'avatar ; toast à chaque nouveau rang.
- **Accès** : connexion étudiant, création de compte étudiant (nom, e-mail, mot de passe, établissement facultatif), accès invité avec identifiant `inv-xxxx`, déconnexion. Le mot de passe (8 caractères minimum, lettres et chiffres) est haché PBKDF2 et jamais stocké en clair ; une adresse inconnue ne crée pas de compte.
- **Suggestions de métiers** (`js/views/suggest.js`) : nom, secteur, description ; auteur, date et statut « Nouveaux » enregistrés. Statuts : Nouveaux, À étudier, Validé.
- **Administration** (menu du compte, compte administrateur + **code PIN** choisi à la première ouverture, stocké haché ; 5 erreurs = blocage 30 s) : visiteurs, sessions, suggestions ; section visiteurs (recherche), section suggestions (filtre et changement de statut), comptes ; actualisation, export CSV (section affichée) et JSON (tout).
- **Stockage** (localStorage) : `prosim_progress_v4:<id>` (progression), `prosim_avatar_v4`, `prosim_account_v4` (compte ou invité courant), `prosim_users_v4`, `prosim_visitors_db_v4`, `prosim_suggestions_db_v4`, `prosim_admin_pin_v4`. Les anciennes clés `dw-*` sont migrées automatiquement.

## Intégrations et plateforme (modules ajoutés)
- **Firebase Firestore (facultatif)** – `js/firebase-config.js` + `js/core/cloud.js`. SDK 10.12.2 chargé à la demande. Renseignez `apiKey` et `projectId` pour activer l'enregistrement dans les collections `visitors` et `suggestions` ; le bouton « Actualiser » de l'administration **lit** aussi Firestore et fusionne dans l'affichage (le plus récent l'emporte). Le stockage local reste la solution de secours : une erreur réseau n'interrompt rien. Configuration vide = 100 % local. Attention : une clé web Firebase n'est pas un secret, c'est donc aux **règles de sécurité Firestore** de limiter lecture et écriture (à configurer côté Firebase, hors de ce code).
- **Google Sites / iframe** – `js/core/embed.js`. Réception de `PRO_SIM_PING` → réponse `PRO_SIM_PONG` ; émission de `PRO_SIM_READY` et `PRO_SIM_HEIGHT` (hauteur) ; `VISITOR_SYNC` et `SUGGESTION_SYNC` (données personnelles) uniquement vers la cible configurée (`PROSIM_EMBED.target` ou `?target=https://…`). Sans cible, seuls READY, PONG et la hauteur sont émis ; avec cible, les messages entrants d'une autre origine sont ignorés.
- **Sons** – Web Audio, sans fichier : bonne réponse, mauvaise réponse, réussite d'un niveau (`win`) ; interrupteurs Sons et Musique.
- **Langues** – `js/core/i18n.js` : français, anglais, espagnol (sélecteur dans l'en-tête, choix mémorisé). L'interface est traduite à l'affichage (dictionnaire + modèles). Les scénarios, questions et explications restent en français ; une phrase absente du dictionnaire s'affiche en français (à compléter dans `DICT`).
- **Illustrations** – `js/core/art.js` : scènes SVG générées (deux personnages, objet central, sol coloré). Les 8 spécialités gardent leur illustration ; les métiers la réutilisent selon leur secteur (`JOB_ART`) ; nouvelle illustration « droit » (balance) pour le secteur Droit, Juridique et Conformité.
- **Recherche et filtres** – page Métiers : recherche sans accents et filtre par secteur.
- **Reprise automatique** – un niveau interrompu est sauvegardé à chaque question et proposé via « Reprendre » (page du métier).
- **Effets** – confettis à chaque niveau réussi (désactivés si « réduire les animations »), défilement fluide, `safeReadJSON` / `safeWriteJSON` (`js/core/safe.js`).
- **Synthèse** – panneau de l'accueil : 35 métiers, 6 secteurs, 175 niveaux, 2 625 questions, 3 langues, 5 rangs.

## Simulateur de métiers marocains
- **6 secteurs, 35 métiers** (`js/data/sectors.js`) : Finance, Audit et Comptabilité (6) · Commerce, Marketing et Vente (6) · Supply Chain, Logistique et Achats (6) · Droit, Juridique et Conformité (6) · Économie, Conseil et Stratégie (6) · Santé, Technologie et Management (5).
- **5 niveaux par métier** : Fondamentaux Terrain, Gestion Opérationnelle, Arbitrage et Conformité, Pilotage Stratégique, Direction et Crise → **175 niveaux**.
- **15 questions par niveau, 4 propositions, 30 s par question**, correction et explication après chaque réponse → **2 625 questions**. Les propositions sont mélangées à chaque tentative.
- **Génération** (`js/engine/career.js`) : 15 scénarios de base (écarts financiers, dérogation urgente, KPI incohérents, réglementation, incident critique, coût d'un contrat, signatures manquantes, négociation fournisseur, déploiement numérique, priorisation, retard de données, départ d'un collaborateur clé, ESG/énergie, défaut qualité, objectifs annuels) adaptés au métier et au niveau. Ce ne sont donc pas 2 625 questions rédigées une à une.
- **Notation** : bonne réponse +20, mauvaise réponse −10, temps écoulé = fausse (−10). Réussite : au moins **10 bonnes réponses sur 15**.
- **Progression** (`D.pro`, enregistrée par utilisateur) : niveau débloqué, niveaux réussis, réponses de la dernière tentative, score, historique par métier. Statistiques : score total, métiers maîtrisés (5 niveaux réussis), niveaux réussis, progression générale. Chaque niveau réussi rapporte de l'XP et débloque le suivant ; deux nouveaux succès ont été ajoutés.
- **Avatar** (`js/core/character.js`, `js/views/char.js`) : 6 teints, 6 couleurs de cheveux, 10 coiffures (dont hijab classique et moderne), 4 tenues, 4 accessoires, style aléatoire. Les anciens avatars sont convertis automatiquement.
- **Administration** (`js/views/admin.js`, menu du compte) : statistiques globales, activité par secteur, liste des utilisateurs, rôle administrateur, réinitialisation de progression, suppression, export CSV. Le premier compte créé est administrateur (sur une installation existante sans administrateur, le plus ancien compte).

## Un seul système pour Spécialités et Métiers
Les 8 spécialités et les 35 métiers sont des **parcours** (`TRK`, `js/engine/tracks.js`) qui passent par le même moteur : une règle modifiée s'applique aux deux.
- **Catalogue** : mêmes 6 secteurs (chaque spécialité est rattachée à un secteur), même page (`catalog(kind)` dans `js/views/tracks.js`), même recherche sans accents, même filtre par secteur, même panneau de synthèse. Seule la nature (`TK`) change : Spécialités ou Métiers.
- **Niveaux** : 5 par parcours (Fondamentaux Terrain → Direction et Crise), débloqués dans l'ordre, 15 questions, 4 propositions, 30 s par question, +20 / −10, réussite à 10/15, reprise automatique d'un niveau interrompu.
- **Contenu** : les métiers génèrent leurs questions depuis 15 scénarios de base ; les spécialités y ajoutent leurs banques rédigées (`js/data/banks`) : niveaux 1-2 = banque Débutant, 3 = Intermédiaire, 4-5 = Difficile, complétés par les scénarios de base adaptés à la spécialité. Une 4ᵉ proposition générique complète les 3 options des banques.
- **Économie** : budget, temps et énergie pour tout niveau (niveaux 1-2 = tarif Débutant, 3 = Intermédiaire, 4-5 = Difficile), gains, fatigue, journée équilibrée.
- **Progression** : `D.pro.jobs[id]` (id 0-34 = métiers, 35-42 = spécialités), mêmes statistiques, XP, rangs, série, tableau de bord (maîtrise par niveau), classement et administration.
- **Succès** : les mêmes pour les deux natures (niveau réussi, parcours maîtrisé, 4 parcours essayés, tous les parcours essayés), plus les succès communs.
- **Carnet de révision et défi du jour** : toute erreur, métier ou spécialité, y est enregistrée ; le défi du jour tire 5 parcours de toute nature.
- **Certificats** : un par niveau réussi, pour les deux.
- **Suggestions** : on peut proposer un métier **ou** une spécialité.
- **Nouveautés d'harmonisation** : parcours liés (spécialités ↔ métiers d'un même secteur), panneau « Niveaux en cours » sur l'accueil, compétences mesurées pour tous les parcours, enchaînement vers le parcours suivant.
- **Anciennes données** : un score de spécialité ≥ 70/100 devient des niveaux réussis (Débutant → N1, Intermédiaire → N1-3, Difficile → N1-5) ; l'ancien carnet de révision est vidé.

## Nouveautés : comptes et plateforme
- **Inscription / connexion / déconnexion**, option « rester connecté », limitation des essais (5 erreurs = blocage 30 s).
- **Code de récupération** affiché une seule fois à l'inscription : permet de réinitialiser un mot de passe oublié.
- **Profil** : nom, couleur d'avatar, changement de mot de passe, export/import JSON de la progression, réinitialisation, suppression du compte.
- **XP, niveaux, titres, série quotidienne et 13 badges.**
- **Défi du jour** (5 questions identiques pour tous), **carnet de révision** (les questions ratées sont rejouables).
- **Tableau de bord** : courbe des scores, compétences, maîtrise par spécialité et niveau, conseils.
- **Certificats** imprimables (PDF) à partir de 70/100 par spécialité et niveau.
- **Classement** des comptes présents sur l'appareil, thème clair/sombre/auto, raccourcis clavier (1-2-3, Entrée), bouton Retour du navigateur.
- Le mode **sans compte** reste possible ; la progression d'invité peut être importée à l'inscription.

### Limite importante
Il n'y a pas de serveur : les comptes et données sont stockés dans le navigateur (localStorage) de l'appareil utilisé.
Un compte créé sur un ordinateur n'existe pas sur un autre (utiliser Export/Import pour déplacer sa progression).
Les mots de passe sont hachés (PBKDF2-SHA256, sel aléatoire) et jamais stockés en clair, mais une sécurité de niveau production
exige un vrai backend : `js/core/auth.js` et `js/core/store.js` sont isolés pour pouvoir être remplacés par des appels API.

## Structure
- `js/core/store.js` (comptes, session, données), `auth.js`, `ui.js`, `economy.js`
- `js/engine/tracks.js` : parcours (métiers + spécialités), questions, progression, révision, défi du jour, succès
- `js/engine/career.js` : barème, 5 niveaux, 15 scénarios de base ; `progress.js` : XP, série, jauge ; `rewards.js` : rangs
- `js/views/tracks.js` : catalogue, page de parcours, simulation, rapport (commun) ; `home.js`, `dash.js`, `review.js`, `board.js`, `profile.js`, `admin.js`
- `js/data/fields/` et `js/data/banks/` : contenu rédigé de chaque spécialité ; `sectors.js` : secteurs et métiers

## Ajouter un parcours
- Métier : une ligne dans `js/data/sectors.js` (intitulé, objet, interlocuteur).
- Spécialité : `js/data/fields/<nom>.js`, `js/data/banks/<nom>.js` (`BANK['Nom']={deb:[…],int:[…],hard:[…]}`), balises `<script>` dans `index.html` et une ligne dans `SPEC_META` (`js/engine/tracks.js`) pour son secteur.

## Pédagogie par niveau
- Débutant : indication « Pour comprendre » affichée dès le début.
- Intermédiaire : indice facultatif, affiché uniquement au clic.
- Difficile : aucun indice ni aide avant la réponse.
- Tous niveaux : bonne réponse et explication affichées après la validation.
