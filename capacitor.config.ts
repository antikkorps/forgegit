import type { CapacitorConfig } from '@capacitor/cli'
import { appConfig } from './app.config'

const config: CapacitorConfig = {
  appId: appConfig.id,
  appName: appConfig.name,
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
}

export default config
