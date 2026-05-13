# Anvil

App mobile cross-platform pour consulter et interagir avec des instances Forgejo / Gitea / Codeberg.

## Stack

Vue 3 + TypeScript + Vite + UnoCSS + Pinia + Vue Router 4 + Capacitor + vue-i18n + Vitest.

## Dev

```bash
npm install
npm run dev          # web dev server
npm run build        # build prod
npm run test         # vitest
npm run lint
```

## Capacitor (Android)

```bash
npm run build
npx cap add android  # première fois uniquement
npm run cap:sync
npm run cap:android  # ouvre Android Studio
```

## Thèmes

`default` (sombre, signature), `light` (mode clair), `brutalist` (placeholder).
Sélection via le store `useThemeStore`, attribut `data-theme` sur `<html>`.
