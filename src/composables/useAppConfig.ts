// Values injected by Vite (`define` in vite.config.ts) from app.config.ts.
declare const __APP_NAME__: string
declare const __APP_ID__: string
declare const __APP_TAGLINE__: string

export interface AppConfigClient {
  name: string
  id: string
  tagline: string
}

const APP: AppConfigClient = {
  name: __APP_NAME__,
  id: __APP_ID__,
  tagline: __APP_TAGLINE__,
}

export function useAppConfig(): AppConfigClient {
  return APP
}
