<script setup lang="ts">
import { defineProps, defineModel } from 'vue'
import { RESULT_TYPE_E } from '@/types/prize.enum'
import CountUp from 'vue-countup-v3'

defineEmits(['close'])
defineProps<{
  type?: RESULT_TYPE_E
  totalAmount: number
}>()
const open = defineModel<boolean>({
  default: false,
})
</script>

<template>
  <div>
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-30 backdrop-blur-sm bg-black/50"
        @click="open = false"
      >
        <div class="fixed inset-0 z-40 h-[100dvh] w-full flex items-center justify-center">
          <div
            v-if="type == RESULT_TYPE_E.FAILED"
            class="w-[95%] max-w-[540px] aspect-[680/409] bg-no-repeat relative background-contain"
            style="background-image: url('/images/failed-background.png')"
          >
            <div class="absolute bottom-8 xxxs:bottom-12 left-1/2 -translate-x-1/2 text-center">
              <h2
                class="uppercase text text-xl xxxs:text-2xl xs:text-3xl sm:text-4xl max-w-[350px] font-bold"
              >
                Better Luck Next Time
              </h2>
              <img
                src="/icons/try-again-btn.png"
                class="h-[46px] xxxs:h-[50px] xs:h-[68px] sm:h-[76px] mx-auto w-fit mt-3 xs:mt-8"
              />
            </div>
          </div>
          <div
            v-else
            class="w-[95%] max-w-[588px] aspect-[580/571] bg-no-repeat relative background-contain"
            style="background-image: url('/images/success-background.png')"
          >
            <div
              class="absolute bottom-6 xsm:bottom-9 xs:bottom-12 left-1/2 -translate-x-1/2 text-center"
            >
              <h2
                class="amount text-3xl xsm:text-4xl xs:text-5xl sm:!text-6xl font-black text-[#ffff18]"
              >
                <count-up :end-val="totalAmount" :decimalPlaces="2" />
              </h2>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.text {
  background-image: linear-gradient(#fced45, #fffdd1 50%, #ffe63d 70%, #ff711b 100%);
  background-image: -webkit-linear-gradient(#fced45, #fffdd1 50%, #ffe63d 70%, #ff711b 100%);
  background-image: -moz-linear-gradient(#fced45, #fffdd1 50%, #ffe63d 70%, #ff711b 100%);
  background-image: -o-linear-gradient(#fced45, #fffdd1 50%, #ffe63d 70%, #ff711b 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.amount {
  font-family: isidoraFont, sans-serif !important;
  text-shadow:
    0 0 3px #888888,
    0 0 3px #888888,
    0 0 2px #888888,
    0 0 2px #888888;
}
</style>
