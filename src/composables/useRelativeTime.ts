import { useI18n } from 'vue-i18n'

export function useRelativeTime() {
  const { t } = useI18n()

  function format(input: string | Date | null | undefined): string {
    if (!input) return ''
    const date = typeof input === 'string' ? new Date(input) : input
    const diffMs = Date.now() - date.getTime()
    const minutes = Math.floor(diffMs / 60_000)
    if (minutes < 1) return t('time.now')
    if (minutes < 60) return t('time.minutes', { n: minutes })
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return t('time.hours', { n: hours })
    const days = Math.floor(hours / 24)
    if (days < 7) return t('time.days', { n: days })
    const weeks = Math.floor(days / 7)
    if (weeks < 5) return t('time.weeks', { n: weeks })
    const months = Math.floor(days / 30)
    return t('time.months', { n: months })
  }

  return { format }
}
