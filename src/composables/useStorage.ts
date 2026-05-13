import { Preferences } from '@capacitor/preferences'

// Thin wrapper around @capacitor/preferences.
// On the web, the plugin falls back to localStorage automatically.
// NOTE: v1 stores values in plain text. TODO: switch to capacitor-secure-storage-plugin (Android Keystore).

export const storage = {
  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key })
    return value
  },
  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value })
  },
  async remove(key: string): Promise<void> {
    await Preferences.remove({ key })
  },
}
