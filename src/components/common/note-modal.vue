<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { defineModel, withDefaults, defineProps } from 'vue'

withDefaults(
  defineProps<{
    variant?: 'bold' | 'tranparent'
  }>(),
  {
    variant: 'tranparent',
  },
)

const open = defineModel<boolean>({
  type: Boolean,
  default: false,
})
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-30 backdrop-blur-sm bg-black/50" @click="open = false">
    <div class="fixed inset-0 h-[100dvh] w-full flex items-center justify-center">
      <div
        class="w-[80%] p-4 sm:p-6 rounded-xl"
        :class="{
          'bg-white': variant == 'bold',
          'bg-black/70 text-white': variant == 'tranparent',
        }"
        @click.stop
      >
        <div v-if="variant == 'tranparent'" class="flex justify-end text-white text-2xl">
          <Icon icon="material-symbols:close-rounded" @click="open = false" />
        </div>
        <slot />

        <div v-if="variant == 'bold'" class="flex justify-end">
          <button class="text-secondary font-semibold text-sm" @click="open = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
