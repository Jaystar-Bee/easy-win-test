<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { defineProps } from 'vue'

defineProps<{
  isBack?: boolean
}>()
</script>

<template>
  <header class="p-4 bg-primary text-white">
    <nav class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <Icon
          icon="material-symbols:arrow-back-ios-new-rounded"
          v-if="isBack"
          @click="$router.back()"
        />
        <img src="/logos/logo-white.png" class="h-6" />
        <slot name="title"></slot>
      </div>

      <slot name="actions"> </slot>
    </nav>
  </header>
</template>
