# Backlog Anvil

Ce que la v1 a livré et ce qui reste. Mis à jour itération par itération.

## Livré (itération 1 — fondations)

- Stack initialisée : Vue 3 + TS + Vite + UnoCSS + Pinia + Vue Router + Capacitor + vue-i18n + Vitest
- Design system complet via CSS variables + UnoCSS (couleurs, typo Inter/JetBrains Mono auto-hébergées, radius)
- Architecture 3 thèmes (`default` rempli, `light` rempli, `brutalist` placeholder), switch via `data-theme`, persistance Preferences
- Centralisation du branding dans `app.config.ts` (consommé par Capacitor, `index.html` via plugin Vite, code Vue via `useAppConfig`)
- Primitives UI : Card, Badge, Button, IconButton, Avatar, LangDot, Input, Skeleton
- AppShell : TopBar (logo flamme + nom + search/bell/avatar) + BottomNav 4 onglets + RouterView scrollable
- LoginView fonctionnelle : URL normalisation, validation, token masqué/affiché, mapping d'erreurs FR
- RepoListView fidèle au mockup : sort par activité, repo "actif" = le plus récent (barre orange + badge accent), 4 états (loading skeleton / error / empty / list), pull-to-refresh tactile
- Wrapper API Forgejo typé (`useForgejoApi`) : `getCurrentUser`, `listMyRepos`, `searchRepos` — `Result<T>` discriminé, jamais throw
- Stores Pinia : `auth` (token + user + api dérivée), `theme`, `repos` (cache + sortedByActivity)
- Storage via `@capacitor/preferences` (web fallback localStorage automatique)
- Dev proxy Vite custom (`/__forge/<host>/*`) pour contourner CORS sur instances Forgejo self-hosted en dev navigateur — middleware sur `fetch` natif Node
- i18n FR opérationnel, strings extraites dans `src/locales/fr.json`
- Test Vitest sur `useForgejoApi` (3 tests verts)

## À faire — fonctionnel

### Détails et navigation

- [ ] `RepoDetailView` (README, branches, commits récents, langues breakdown)
- [ ] `IssueListView` réelle (filtres : open/closed, assignee, label)
- [ ] `IssueDetailView` (markdown render, commentaires, actions : close, label, assign)
- [ ] `PullRequestListView` réelle (filtres : open/draft/closed, assignée à moi, review pending)
- [ ] `PullRequestDetailView` (diff, conversation, commits, checks)
- [ ] Recherche globale (TopBar → écran de recherche : repos, issues, PRs, users)

### Filtres et états

- [ ] Filter pill "Actifs" : faire fonctionner (filtre par activité < 7j, ou par private/public, à définir)
- [ ] Tri configurable (activité / nom / stars)
- [ ] Pagination / infinite scroll sur listes longues (>50 items)
- [ ] Virtualization si listes > 200 items (probablement pas nécessaire avant)

### Authentification

- [ ] Multi-comptes (plusieurs instances en parallèle)
- [ ] Secure storage via `capacitor-secure-storage-plugin` (Keystore Android) → remplacer Preferences en clair
- [ ] OAuth flow Forgejo (en plus du PAT) — plus user-friendly
- [ ] Refresh token / detection de token expiré → re-prompt PAT au lieu de logout dur

### Notifications

- [ ] Liste des notifs (icône bell de la TopBar)
- [ ] Push notifications natives (FCM Android) pour mentions, reviews, assigns

### Settings

- [ ] Choix de la langue (FR/EN minimum — strings déjà externalisées)
- [ ] Toggle haptics
- [ ] Toggle "marquer comme actif" auto vs manuel
- [ ] Préférences d'affichage (densité, format date)
- [ ] Logout par compte si multi-comptes

### Offline

- [ ] Cache lecture (IndexedDB ou SQLite via plugin) : repos, last opened issue/PR
- [ ] Indicateur "offline" dans la TopBar
- [ ] Queue d'actions différées (commentaires, fermeture issue, etc.)

## À faire — technique / qualité

### Couverture de tests

- [ ] Tests stores (`auth`, `theme`, `repos`)
- [ ] Tests composants critiques (RepoCard, LoginView form)
- [ ] Tests composables (`useRelativeTime`, `usePullToRefresh`)
- [ ] Test integration login → fetch repos avec MSW

### Build / CI

- [ ] CI Forgejo Actions : lint + typecheck + test sur PR
- [ ] Build APK release signé en CI
- [ ] F-Droid metadata (`fastlane/metadata/android/`) — projet FOSS prêt à soumettre

### Capacitor

- [ ] `npx cap add android` + premier build APK local
- [ ] Splash screen custom (flamme Anvil)
- [ ] Adaptive icon Android
- [ ] iOS plus tard (besoin compte Apple developer)
- [ ] Plugin `@capacitor/status-bar` pour matcher la couleur du thème
- [ ] Plugin `@capacitor/keyboard` pour le resize sur LoginView

### A11y / UX

- [ ] Audit contraste WCAG AA en thème light
- [ ] Focus visible explicite (`:focus-visible`) sur tous les interactifs
- [ ] Skip-to-content
- [ ] Réduction d'animation si `prefers-reduced-motion`
- [ ] Test screen reader (TalkBack Android)

### Thème brutalist

- [ ] Définir la palette finale (placeholder actuel à itérer)
- [ ] Vocabulaire raccourci ("commits" → "log", "pull request" → "PR", etc.)
- [ ] Mono partout (déjà branché côté CSS vars)

## Points d'attention / dette

- **CORS dev** : le middleware `/__forge/<host>/*` dans `vite.config.ts` est dev-only. En prod Capacitor, l'API est appelée directement. À garder en tête si on ajoute un mode "PWA hébergée".
- **`open_pr_counter` vs `open_issues_count`** : Forgejo expose les deux, l'API Gitea historique n'a que `open_issues_count` qui agrège PR + issues. Vérifier sur instance Gitea pure si on supporte officiellement.
- **Token storage en clair** dans Preferences — acceptable v1 dev, à durcir avant release publique.
- **Heuristique "active repo"** = le plus récent. À reconsidérer si on ajoute la notion de "pinned" ou "currently working on".
- **i18n** : strings FR uniquement pour l'instant, mais `vue-i18n` est configuré pour basculer EN trivialement.
