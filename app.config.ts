// Single source of truth for app identity and branding.
// Changing values here propagates to Capacitor config, index.html, and all Vue code
// (via the `APP` constant injected by Vite, exposed by `useAppConfig`).

export const appConfig = {
  name: 'Anvil',
  id: 'app.anvil.mobile',
  tagline: 'Forgejo mobile',
} as const

export type AppConfig = typeof appConfig
