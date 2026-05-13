import { defineConfig, presetUno, presetIcons, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.0,
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json').then((m) => m.default),
      },
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [transformerVariantGroup()],
  theme: {
    colors: {
      canvas: 'var(--c-bg-canvas)',
      surface: 'var(--c-bg-surface)',
      elevated: 'var(--c-bg-elevated)',
      border: 'var(--c-bg-border)',
      'text-primary': 'var(--c-text-primary)',
      'text-secondary': 'var(--c-text-secondary)',
      'text-tertiary': 'var(--c-text-tertiary)',
      accent: {
        500: 'var(--c-accent-500)',
        600: 'var(--c-accent-600)',
        bg: 'var(--c-accent-bg)',
      },
      success: 'var(--c-success)',
      danger: 'var(--c-danger)',
      warning: 'var(--c-warning)',
      info: 'var(--c-info)',
      lang: {
        js: '#f59e0b',
        ts: '#3b82f6',
        vue: '#22c55e',
        quasar: '#22c55e',
        rust: '#ea580c',
        go: '#3b82f6',
        python: '#eab308',
        markdown: '#6b6f7a',
        default: '#6b6f7a',
      },
    },
    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },
    borderRadius: {
      card: '10px',
      btn: '7px',
      pill: '4px',
    },
  },
  shortcuts: {
    'card-base':
      'bg-surface border border-border rounded-card relative',
    'pill-mono':
      'font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-pill',
    'meta-row':
      'flex items-center gap-3.5 text-[11px] text-text-tertiary',
    'screen-pad': 'px-4',
  },
  safelist: [
    'i-tabler-flame',
    'i-tabler-search',
    'i-tabler-bell',
    'i-tabler-filter',
    'i-tabler-folder',
    'i-tabler-git-pull-request',
    'i-tabler-alert-circle',
    'i-tabler-settings',
    'i-tabler-git-branch',
    'i-tabler-star',
    'i-tabler-eye',
    'i-tabler-eye-off',
    'i-tabler-arrow-left',
    'i-tabler-refresh',
  ],
})
