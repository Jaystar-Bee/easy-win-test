<script setup lang="ts">
import singlePage from '@/layouts/single-page.vue'
import actionSection from '@/components/game/action-section.vue'
import scratchCard from '@/components/common/scratch-card.vue'
import noteModal from '@/components/common/note-modal.vue'
import resultModal from '@/components/common/result-modal.vue'
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { PRIZE_E, RESULT_TYPE_E } from '@/types/prize.enum'
import { useResultStore } from '@/stores/result'
import { Vue3Marquee } from 'vue3-marquee'

// SOUNDS
import jackpotStartSound from '/public/sounds/jackpot-start.mp3'
import jackpotLoseSound from '/public/sounds/jackpot-lose.mp3'
import jackpotWinSound from '/public/sounds/jackpot-coins.mp3'

const resultStore = useResultStore()

const list = [
  '/public/icons/ball.png',
  '/public/icons/whistle.png',
  '/public/icons/glove.png',
  '/public/icons/player.png',
  '/public/icons/flag.png',
  '/public/icons/cup.png',
]
const AMOUNT = 500
const selectedCards = ref<string[]>([])

// SOUNDS
const startSound = new Audio(jackpotStartSound)
const loseSound = new Audio(jackpotLoseSound)
const winSound = new Audio(jackpotWinSound)

//SCRATCH
const isNewCard = ref(false)
const showNoteModal = ref(false)
const shownGuide = ref(false)
const resetScratch = ref(false)
const forceReveal = ref(false)
const showResultModal = ref(false)
const resultCount = ref(0)
const resultType = ref<RESULT_TYPE_E>()
watch(forceReveal, () => {
  if (forceReveal.value) {
    checkResult()
  }
})
watch(showResultModal, () => {
  if (!showResultModal.value) {
    setTimeout(() => {
      resetResult()
    }, 500)
  }
})

function checkResult() {
  if (resultCount.value !== 0) {
    resultCount.value = 0
  }
  const has3Balls =
    selectedCards.value.filter((item) => item === '/public/icons/ball.png').length >= 3
  const has3Whistles =
    selectedCards.value.filter((item) => item === '/public/icons/whistle.png').length >= 3
  const has3Gloves =
    selectedCards.value.filter((item) => item === '/public/icons/glove.png').length >= 3
  const has3Players =
    selectedCards.value.filter((item) => item === '/public/icons/player.png').length >= 3
  const has3Flags =
    selectedCards.value.filter((item) => item === '/public/icons/flag.png').length >= 3
  const has3Cups =
    selectedCards.value.filter((item) => item === '/public/icons/cup.png').length >= 3

  if (has3Balls) {
    handleMultipleAdd(PRIZE_E.BALLS)
  }
  if (has3Whistles) {
    handleMultipleAdd(PRIZE_E.WHISTLES)
  }
  if (has3Gloves) {
    handleMultipleAdd(PRIZE_E.GLOVES)
  }
  if (has3Players) {
    handleMultipleAdd(PRIZE_E.PLAYERS)
  }
  if (has3Flags) {
    handleMultipleAdd(PRIZE_E.FLAGS)
  }
  if (has3Cups) {
    handleMultipleAdd(PRIZE_E.CUPS)
  }

  if (resultCount.value > 0) {
    resultType.value = RESULT_TYPE_E.SUCCESS
    winSound.play()
  } else {
    resultType.value = RESULT_TYPE_E.FAILED
    loseSound.play()
  }
  resultStore.setResultType(resultType.value)
  showResultModal.value = true
}

function resetResult() {
  resultCount.value = 0
  resultType.value = undefined
}

function handleMultipleAdd(amount: number) {
  if (resultCount.value !== 0) {
    resultCount.value = resultCount.value + amount
  } else {
    resultCount.value = amount
  }
}

function handleTicketing() {
  if (isNewCard.value && !forceReveal.value) {
    forceReveal.value = true
  } else {
    const data = []
    while (data.length < 9) {
      if (data?.length === 9) break
      const randomIndex = Math.floor(Math.random() * list.length)
      const randomItem = list[randomIndex]

      const selectionCount = data?.filter((item) => item === randomItem).length

      if (selectionCount < 3) {
        data.push(randomItem as string)
      }
    }
    if (forceReveal.value) {
      forceReveal.value = false
    }
    if (isNewCard.value) {
      isNewCard.value = false
    }
    if (!shownGuide.value) {
      showNoteModal.value = true
      shownGuide.value = true
    } else {
      resetScratch.value = true
      setTimeout(() => {
        resetScratch.value = false
      }, 200)
    }
    selectedCards.value = data
    isNewCard.value = true
    startSound?.play()
    resultStore.setResultType(resultType.value)
  }
}
function handleCompleteScratch() {
  forceReveal.value = true
}

// BARRAGE
const barrages = ref<string[]>([])

function handleSetBarrage(barrage: string) {
  barrages.value = [...barrages.value, barrage]
}
</script>
<template>
  <single-page>
    <div class="h-full flex flex-col gap-4 justify-between flex-1 px-4 relative">
      <div v-if="barrages?.length" class="absolute top-20 left-0 w-full">
        <Vue3Marquee :loop="1" @onComplete="barrages = []">
          <div
            v-for="(item, index) in barrages"
            :key="index"
            class="bg-white rounded-full px-2.5 py-1 text-[10px]"
          >
            {{ item }}
          </div>
        </Vue3Marquee>
      </div>
      <div
        class="relative bg-norepeat bg-cover h-full w-full max-w-[500px] aspect-[500/592] mx-auto mt-4 p-3 transition-all duration-300 ease-in-out"
        :class="{
          'scale-[0.7]': showResultModal,
        }"
        style="background-image: url('/images/field-background.png')"
      >
        <div
          class="bg-black/20 rounded-full py-1 px-2 text-white flex items-center gap-1 w-fit text-xs"
        >
          <img src="/icons/icon_money.png" class="h-3" />
          &#8358;{{ Number(AMOUNT)?.toLocaleString() }}
        </div>

        <div
          class="absolute w-[90%] left-1/2 -translate-x-1/2 overflow-hidden bottom-0 h-[60%] flex flex-col gap-2 lg:gap-2.5 justify-between"
        >
          <h3 class="text-center text-2xl text-secondary title font-black uppercase">
            WIN up to 1,000,000
          </h3>
          <div class="flex-1 overflow-hidden flex items-stretch w-full mx-auto gap-3">
            <img src="/images/prize_img.png" class="h-full" />
            <template v-if="isNewCard">
              <scratch-card
                :cover-image-url="'/images/scratch.png'"
                :is-reset="resetScratch"
                :is-revealed="forceReveal"
                @complete="handleCompleteScratch"
              >
                <div
                  style="background-image: url('/images/items-background.png')"
                  class="h-full bg-no-repeat w-full flex-1 card"
                >
                  <ul class="grid grid-cols-3 grid-row-3 h-full w-full">
                    <li
                      v-for="(item, index) in selectedCards"
                      :key="index"
                      class="flex items-center justify-center"
                    >
                      <img :src="item" class="w-4 sm:w-9" />
                    </li>
                  </ul>
                </div>
              </scratch-card>
            </template>
            <img v-else src="/images/sample.png" class="h-full w-full" />
          </div>

          <div class="text-center mx-auto px-2 py-1 bg-white">
            <p class="text-[10px] text-[#666]">000000 Lucky World Cup 7 000000</p>
          </div>
        </div>
      </div>

      <action-section
        :isNewCard="isNewCard"
        :forceReveal="forceReveal"
        @setTicket="handleTicketing"
        @setBarrage="handleSetBarrage"
      />
    </div>
    <note-modal v-model="showNoteModal">
      <div class="py-3 text-center">
        <Icon icon="ic:twotone-swipe-vertical" class="text-5xl w-fit mx-auto" />
        <p class="text-sm pt-2">Slide finger to reveal Numbers</p>
      </div>
    </note-modal>
    <result-modal
      v-model="showResultModal"
      :totalAmount="AMOUNT * resultCount"
      :type="resultType"
    />
  </single-page>
</template>

<style scoped>
.title {
  text-shadow:
    2px 0 2px #fff201,
    0 2px 2px #fff201,
    -2px 0 2px #fff201,
    0 -2px 2px #fff201;
  font-family: isidoraFont, sans-serif;
}

.card {
  background-size: 100% 100%;
}
</style>
