<script setup lang="ts">
import { ROUTES_E } from '@/types/routes-enums'
import container from '../components/common/container.vue'
import theHeader from '../components/common/header.vue'
import { Icon } from '@iconify/vue'
import { withDefaults, defineProps } from 'vue'

withDefaults(
  defineProps<{
    bgImg?: string
  }>(),
  {
    bgImg: '/images/game-background.webp',
  },
)
</script>
<template>
  <div
    class="bg-no-repeat bg-cover relative"
    style="background-image: url('/images/game-background.webp')"
  >
    <div class="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
    <container class="z-10 relative min-h-[100dvh] flex flex-col">
      <the-header isBack class="p-4 bg-primary sticky z-[100] top-0">
        <template #actions>
          <Icon
            icon="line-md:question-circle-twotone"
            class="text-xl"
            @click="$router.push({ name: ROUTES_E.HELP })"
          />
        </template>
      </the-header>
      <slot />
    </container>
  </div>
</template>
