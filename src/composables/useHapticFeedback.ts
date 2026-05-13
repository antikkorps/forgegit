import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'

export function useHapticFeedback() {
  const enabled = Capacitor.isNativePlatform()

  async function light() {
    if (!enabled) return
    try {
      await Haptics.impact({ style: ImpactStyle.Light })
    } catch {
      // not all devices support haptics — fail silently
    }
  }

  async function medium() {
    if (!enabled) return
    try {
      await Haptics.impact({ style: ImpactStyle.Medium })
    } catch {
      // not all devices support haptics — fail silently
    }
  }

  return { light, medium }
}
