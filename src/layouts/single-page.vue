<script setup lang="ts">
import { ROUTES_E } from '@/types/routes-enums'
import container from '../components/common/container.vue'
import theHeader from '../components/common/header.vue'
import { Icon } from '@iconify/vue'
import { withDefaults, defineProps, computed } from 'vue'
import { useResultStore } from '@/stores/result'
import { RESULT_TYPE_E } from '@/types/prize.enum'

const resultStore = useResultStore()

withDefaults(
  defineProps<{
    bgImg?: string
  }>(),
  {
    bgImg: '/images/game-background.webp',
  },
)

const hasResult = computed(() => !!resultStore.getResultType)
const resultType = computed(() => resultStore.getResultType)
const getResultAmount = computed(() => resultStore.getResultAmount)
</script>
<template>
  <div
    class="bg-no-repeat bg-cover relative"
    style="background-image: url('/images/game-background.webp')"
  >
    <div class="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
    <container class="z-10 relative min-h-[100dvh] flex flex-col">
      <div>
        <the-header isBack class="p-4 bg-primary sticky z-[100] top-0">
          <template #actions>
            <Icon
              icon="line-md:question-circle-twotone"
              class="text-xl"
              @click="$router.push({ name: ROUTES_E.HELP })"
            />
          </template>
        </the-header>
        <div v-if="hasResult" class="py-4 border-t border-b border-[#5d6b7c] result">
          <p class="result-text uppercase text-xl xs:text-2xl text-center font-bold">
            {{
              resultType === RESULT_TYPE_E.SUCCESS
                ? `WINNING! ₦${getResultAmount}`
                : 'Better Luck Next Time'
            }}
          </p>
        </div>
      </div>
      <slot />
    </container>
  </div>
</template>

<style scoped>
.result {
  background: linear-gradient(#424c59 50%, #2f3843 50%);
}

.result-text {
  background-image: linear-gradient(top, #fff, #ffd05f);
  background-image: -webkit-linear-gradient(top, #fff, #ffd05f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #fff1ca;
  font-family: isidoraFont, sans-serif;
}
</style>
