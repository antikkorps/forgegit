import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

interface Options {
  el: Ref<HTMLElement | null>
  onRefresh: () => Promise<void> | void
  threshold?: number
  maxPull?: number
}

export function usePullToRefresh({ el, onRefresh, threshold = 64, maxPull = 100 }: Options) {
  const pull = ref(0)
  const refreshing = ref(false)
  let startY = 0
  let active = false

  function onTouchStart(e: TouchEvent) {
    const target = el.value
    if (!target || refreshing.value) return
    if (target.scrollTop > 0) return
    startY = e.touches[0].clientY
    active = true
  }

  function onTouchMove(e: TouchEvent) {
    if (!active) return
    const dy = e.touches[0].clientY - startY
    if (dy <= 0) {
      pull.value = 0
      return
    }
    // Elastic resistance: pull moves at half the finger speed, capped at maxPull.
    pull.value = Math.min(maxPull, dy * 0.5)
    if (pull.value > 0) e.preventDefault()
  }

  async function onTouchEnd() {
    if (!active) return
    active = false
    if (pull.value >= threshold && !refreshing.value) {
      refreshing.value = true
      pull.value = threshold
      try {
        await onRefresh()
      } finally {
        refreshing.value = false
        pull.value = 0
      }
    } else {
      pull.value = 0
    }
  }

  onMounted(() => {
    const target = el.value
    if (!target) return
    target.addEventListener('touchstart', onTouchStart, { passive: true })
    target.addEventListener('touchmove', onTouchMove, { passive: false })
    target.addEventListener('touchend', onTouchEnd)
    target.addEventListener('touchcancel', onTouchEnd)
  })

  onBeforeUnmount(() => {
    const target = el.value
    if (!target) return
    target.removeEventListener('touchstart', onTouchStart)
    target.removeEventListener('touchmove', onTouchMove)
    target.removeEventListener('touchend', onTouchEnd)
    target.removeEventListener('touchcancel', onTouchEnd)
  })

  return { pull, refreshing }
}
