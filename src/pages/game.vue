<script setup lang="ts">
import singlePage from '@/layouts/single-page.vue'
import actionSection from '@/components/game/action-section.vue'
import scratchCard from '@/components/common/scratch-card.vue'
import noteModal from '@/components/common/note-modal.vue'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const list = [
  '/public/icons/ball.png',
  '/public/icons/cup.png',
  '/public/icons/flag.png',
  '/public/icons/glove.png',
  '/public/icons/player.png',
  '/public/icons/whistle.png',
]
const selectedCards = ref<string[]>([])
//SCRATCH
const isNewCard = ref(false)
const showNoteModal = ref(false)
const shownGuide = ref(false)
const resetScratch = ref(false)
const forceReveal = ref(false)
function handleTicketing() {
  if (isNewCard.value && !forceReveal.value) {
    forceReveal.value = true
  } else {
    selectedCards.value = []
    while (selectedCards.value.length < 9) {
      const randomIndex = Math.floor(Math.random() * list.length)
      const randomItem = list[randomIndex]

      const selectionCount = selectedCards.value.filter((item) => item === randomItem).length

      if (selectionCount < 3) {
        selectedCards.value.push(randomItem as string)
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
    isNewCard.value = true
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
    <div class="h-full flex flex-col gap-4 justify-between flex-1 px-4">
      <div
        class="relative bg-norepeat bg-cover h-full w-full max-w-[500px] aspect-[500/592] mx-auto mt-4 p-3"
        style="background-image: url('/images/field-background.png')"
      >
        <div
          class="bg-black/20 rounded-full py-1 px-2 text-white flex items-center gap-1 w-fit text-xs"
        >
          <img src="/icons/icon_money.png" class="h-3" />
          &#8358;{{ Number(500)?.toLocaleString() }}
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
                      v-for="item in selectedCards"
                      :key="item"
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
