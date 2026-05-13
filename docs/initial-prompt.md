# Prompt — Initialisation du projet Anvil (app mobile Forgejo)

## Contexte du projet

Je démarre **Anvil**, une application mobile cross-platform pour consulter et interagir avec mes instances Forgejo (et potentiellement Gitea/Codeberg). L'objectif est de combler un manque réel dans l'écosystème : il n'existe pas d'app mobile FOSS, gratuite, multiplateforme et avec un design moderne pour Forgejo. GitNex (la seule alternative existante) est Android-only, payante, et visuellement datée.

**Positionnement** : produit dev sérieux et moderne, dans la lignée esthétique de Linear, Raycast, Vercel, Arc Browser. Pas une app "consumer" générique, pas non plus du brutaliste terminal qui filtre trop le public. L'identité visuelle est forte et signature mais reste accessible.

**Public cible** : développeurs qui utilisent Forgejo en self-hosted ou Codeberg, qui veulent consulter leurs repos, PRs et issues en mobilité. Bonus si on séduit aussi les utilisateurs Gitea.

## Stack technique imposée

- **Framework** : Vue 3 (Composition API) + TypeScript + Vite
- **Routing** : Vue Router 4
- **State management** : Pinia
- **Styling** : UnoCSS (PAS Tailwind, PAS de framework UI lourd type Vuetify/Quasar)
- **Mobile packaging** : Capacitor (cible Android d'abord, iOS si tout va bien plus tard)
- **HTTP client** : `ofetch` ou `fetch` natif (pas axios, on garde léger)
- **Stockage sécurisé tokens** : `@capacitor/preferences` avec encryption
- **Icônes** : Iconify via UnoCSS preset (préférer collections Lucide ou Tabler outline)
- **Linting** : ESLint + Prettier (config standard Vue)
- **Tests** : Vitest pour les composables, pas de tests E2E au début

**Pas de** : React Native, Tailwind, Quasar UI, Vuetify, NativeBase, shadcn ports. Le projet est en Vue pur avec UnoCSS et composants custom maison.

## Identité visuelle — DESIGN SYSTEM FIGÉ

Cette section est **non-négociable**. Tout dérivé visuel doit respecter ces choix. Si quelque chose semble manquer, demander avant d'improviser.

### Couleurs (mode sombre par défaut, mode clair à prévoir)

```typescript
// Backgrounds
'bg-canvas': '#0f1014',      // body
'bg-surface': '#161820',     // cards
'bg-elevated': '#1a1c22',    // hover states, filters, modals
'bg-border': '#1f2128',      // séparateurs

// Texte
'text-primary': '#e8e9ed',   // titres, contenu important
'text-secondary': '#9ca0ac', // descriptions, méta
'text-tertiary': '#6b6f7a',  // hints, timestamps

// Accent signature — orange "métal chauffé"
'accent-500': '#f97316',     // accent principal
'accent-600': '#ea580c',     // hover/active
'accent-bg': '#2a1f12',      // background des badges accentués

// Sémantique
'success': '#22c55e',
'danger': '#ef4444',
'warning': '#f59e0b',
'info': '#3b82f6',

// Couleurs des langages (pastilles repo)
'lang-js': '#f59e0b',
'lang-ts': '#3b82f6',
'lang-vue': '#22c55e',
'lang-quasar': '#22c55e',
'lang-rust': '#ea580c',
'lang-go': '#3b82f6',
'lang-python': '#eab308',
'lang-markdown': '#6b6f7a',
'lang-default': '#6b6f7a',
```

Pour le **light mode**, prévoir une palette miroir cohérente (à finaliser plus tard, mais l'architecture CSS doit la rendre triviale à brancher).

### Typographie

```
Sans-serif (par défaut) : Inter, fallback system-ui, -apple-system, BlinkMacSystemFont, sans-serif
Mono (branches, langages, code) : JetBrains Mono, fallback 'Fira Code', monospace

Tailles et poids :
- Titre principal de page : 18px / 500
- Titre repo / issue / PR : 14px / 500
- Description : 12px / 400
- Méta (timestamps, counts) : 11px / 400
- Pastilles mono (branches, langages) : 10px / 500

Letter-spacing : -0.01em sur les titres pour le côté "produit moderne"
Line-height : 1.4 sur le body, 1.2 sur les titres
```

Charger Inter via `@fontsource/inter` (poids 400 et 500 uniquement, pas plus), JetBrains Mono via `@fontsource/jetbrains-mono` (poids 400 et 500). Pas de Google Fonts CDN — on auto-héberge pour respecter la philosophie souveraineté.

### Formes et espacements

```
Border-radius :
- Cards : 10px
- Boutons : 7-8px
- Badges/pills : 4px
- Avatar/logo : 7-8px (pas de cercle parfait)

Padding card : 12-14px
Gap entre cards dans une liste : 6px (densité Linear-style)
Padding écran latéral : 16px
```

### Principes UX figés

- Densité d'information importante mais lisible — pas de "card avec 80% d'espace blanc"
- Mode sombre profond par défaut, light mode disponible en option dans Settings
- Accent orange utilisé avec parcimonie (pas plus de 10-15% de la surface)
- Animations subtiles uniquement (hover, transitions de page) en 150-200ms — pas d'animations gratuites au scroll
- Conventions UI standard (vocabulaire UI, navigation par tab bar) — pas de raccourcis clavier obligatoires
- Bottom tab bar pour la navigation principale (4 onglets max)
- Pull-to-refresh sur les listes
- Skeleton loaders pendant les chargements (pas de spinners centrés)

### Thèmes — Architecture prévue dès maintenant

Le projet doit supporter dès l'architecture initiale **3 thèmes** pour faciliter l'évolution future :

1. **Default** (le design ci-dessus, mode sombre signature)
2. **Light** (version mode clair, à finaliser plus tard mais structure en place)
3. **Brutalist** (futur, à prévoir mais ne pas implémenter maintenant) — palette terminal type `#0d0f0c` background, accents `#f0b072`, typo entièrement monospace, vocabulaire en raccourcis. C'est un mode "power user" optionnel pour les hardcore.

Concrètement : utiliser CSS variables et `data-theme` sur `<html>` pour switcher. Les composants ne hardcodent jamais de couleurs, ils consomment les variables. Un store Pinia `useThemeStore` gère la sélection et la persistance via `@capacitor/preferences`.

## Architecture de dossiers attendue

```
src/
├── components/
│   ├── ui/              # Primitives réutilisables (Card, Badge, Button, Avatar, etc.)
│   ├── repo/            # Composants liés aux repos (RepoCard, RepoHeader, etc.)
│   ├── issue/           # Composants liés aux issues
│   ├── pr/              # Composants liés aux PRs
│   └── layout/          # AppShell, BottomNav, TopBar
├── views/
│   ├── LoginView.vue
│   ├── RepoListView.vue
│   ├── RepoDetailView.vue
│   ├── IssueListView.vue
│   ├── IssueDetailView.vue
│   ├── PullRequestListView.vue
│   ├── PullRequestDetailView.vue
│   └── SettingsView.vue
├── stores/
│   ├── auth.ts          # Token, instance URL, user
│   ├── theme.ts         # Theme selection
│   └── repos.ts         # Cache des repos
├── composables/
│   ├── useForgejoApi.ts # Wrapper API typed
│   ├── useTheme.ts
│   └── useHapticFeedback.ts
├── types/
│   └── forgejo.ts       # Types TypeScript de l'API Forgejo
├── router/
│   └── index.ts
├── styles/
│   ├── themes/
│   │   ├── default.css  # Variables mode sombre signature
│   │   ├── light.css    # Variables mode clair
│   │   └── brutalist.css # (placeholder, à remplir plus tard)
│   └── main.css         # Imports + reset
├── App.vue
└── main.ts
```

## Scope de cette première itération

**Ce que je veux que tu fasses MAINTENANT :**

1. **Initialiser le projet** avec la stack indiquée (Vue 3 + TS + Vite + UnoCSS + Capacitor)
2. **Configurer UnoCSS** avec le design system complet (toutes les couleurs, les shortcuts utiles, l'icon preset Lucide)
3. **Créer la structure de dossiers** comme indiqué
4. **Implémenter le système de thèmes** avec les 3 thèmes (default rempli, light minimal, brutalist placeholder)
5. **Créer les composants UI primitifs** : Card, Badge, Button, Avatar, IconButton
6. **Implémenter l'AppShell** : TopBar (logo Anvil avec icône flamme + actions search/notifications/avatar) et BottomNav (4 onglets : Repos / PRs / Issues / Settings)
7. **Implémenter LoginView** : formulaire avec URL instance + Personal Access Token, stockage sécurisé du token
8. **Implémenter RepoListView** : liste des repos avec le visuel validé dans le mockup (cards 10px de radius, accent orange sur le repo actif, métadonnées en bas avec pastille langage + counts PR/issues + timestamp)
9. **Wrapper API Forgejo** typé pour `GET /api/v1/repos/search` et `GET /api/v1/user`

**Ce que tu NE FAIS PAS encore :**

- Implémenter les détails (IssueDetailView, PullRequestDetailView, etc.) — c'est pour les itérations suivantes
- Implémenter les notifications push
- Implémenter le mode brutalist (juste le placeholder vide)
- Implémenter le multi-comptes
- Implémenter le offline mode
- Faire des tests unitaires exhaustifs (juste un test sur le composable useForgejoApi pour valider la structure)

## Mockup de référence

L'écran RepoListView doit reproduire fidèlement le mockup validé :

- TopBar sombre `#0f1014`, avec logo Anvil (carré 28x28 avec gradient orange et icône flamme blanche), nom "Anvil" en 15px/500 letter-spacing -0.01em, et à droite : icônes search/bell en `#6b6f7a` + avatar utilisateur (carré 26x26 radius 7px, fond `#1f2128`, initiale en accent orange)
- Header de section "Repos" en 18px/500 `#e8e9ed`, sous-titre "{n} actifs · dernière activité il y a Xh" en 12px `#6b6f7a`
- Filter pill à droite : fond `#1a1c22`, padding 5px 10px, radius 7px, icon filter + texte "Actifs" en 11px `#9ca0ac`
- Cards repo : fond `#161820`, border 1px `#1f2128`, radius 10px, padding 12-14px, gap 6px entre cards
- Le repo "actif" a une **barre verticale orange `#f97316`** de 2px de large positionnée absolutely à gauche, avec radius 0 2px 2px 0
- Sur chaque card : nom du repo en 14px/500 `#e8e9ed` + badge branche en mono 10px (fond `#2a1f12` et texte `#f97316` si branche `main` sur repo actif, sinon fond `#1f2128` et texte `#9ca0ac`) + timestamp à droite en 11px `#6b6f7a`
- Description 12px `#9ca0ac` line-height 1.4
- Footer méta : gap 14px, langage avec pastille colorée 6x6px + nom, counts PR/issues avec icônes 13px
- BottomNav : border-top `#1f2128`, padding 10px 16px, 4 onglets centrés (icon 20px + label 10px). Onglet actif en `#f97316`, inactifs en `#6b6f7a`

## Configuration Capacitor

- App ID : `app.anvil.mobile`
- App name : `Anvil`
- Target : Android d'abord (iOS plus tard si compte Apple developer)
- Pas de splash screen custom pour l'instant, on le fera plus tard

## Contraintes techniques annexes

- **Performance** : la liste de repos doit pouvoir gérer 100+ repos sans lag (virtualization si nécessaire, mais probablement pas requis avant 50+ items)
- **Accessibilité** : tous les boutons et liens doivent avoir des labels accessibles, contraste WCAG AA minimum
- **i18n préparé** : utiliser `vue-i18n` même si on commence en français uniquement, les chaînes sont externalisées dans `src/locales/fr.json`
- **Erreurs API** : gérer 401 (token invalide → redirect login), 403 (pas de droits → toast), 404 (afficher empty state), 5xx (toast réessayer)
- **Pas de localStorage** : utiliser exclusivement `@capacitor/preferences` pour la persistance
- **Types stricts** : `strict: true` dans tsconfig, pas de `any` implicite

## Conventions de code

- Composition API uniquement, pas d'Options API
- `<script setup lang="ts">` partout
- Props avec `defineProps<{}>()` syntaxe TypeScript
- Emits avec `defineEmits<{}>()` syntaxe TypeScript
- Composables nommés `useXxx.ts`
- Stores Pinia avec `defineStore` syntaxe setup
- Pas de barrel files (index.ts qui réexporte tout) — imports directs
- Naming : composants PascalCase, fichiers PascalCase pour composants, kebab-case pour le reste

## Question avant de commencer

Avant de lancer la génération, **arrête-toi et confirme avec moi** :

1. Que tu as bien compris le positionnement (style Linear/Raycast, pas shadcn-default, pas brutaliste)
2. Le design system complet (couleurs, typo, formes)
3. L'architecture de dossiers
4. Le scope précis de cette première itération
5. Les contraintes (stack imposée, conventions, accessibilité)

Si quelque chose te semble flou ou contradictoire, demande des clarifications. Si tu vois un problème dans mes choix (ex: une lib qui n'existe plus, une conf qui pose problème), signale-le avant de coder.

Une fois validé, génère le projet itérativement : d'abord la config (Vite, UnoCSS, Capacitor, TS), puis les types et stores, puis les composants UI primitifs, puis les composants métier, puis les views. À chaque étape majeure (fin de config, fin de composants UI, fin du Login flow, fin de RepoListView), arrête-toi et montre-moi un état pour validation avant de continuer.
