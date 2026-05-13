<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
</script>

<template>
  <div class="card-base px-3.5 py-3">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <Skeleton
          width="90px"
          height="14px"
        />
        <Skeleton
          width="40px"
          height="14px"
          radius="4px"
        />
      </div>
      <Skeleton
        width="24px"
        height="11px"
      />
    </div>
    <Skeleton
      width="80%"
      height="12px"
    />
    <div class="mt-2 flex gap-3.5">
      <Skeleton
        width="50px"
        height="11px"
      />
      <Skeleton
        width="30px"
        height="11px"
      />
    </div>
  </div>
</template>
