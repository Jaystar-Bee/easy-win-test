<script setup lang="ts">
import { ref, nextTick } from 'vue'
import container from '../common/container.vue'
import { Icon } from '@iconify/vue'
import noteModal from '../common/note-modal.vue'

const emits = defineEmits(['setBarrage', 'setTicket'])
defineProps<{
  isNewCard?: boolean
  forceReveal?: boolean
}>()
const showBarrage = ref(true)
const showBarrageModal = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
function handleShowBarrageModal() {
  showBarrageModal.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const barrage = ref('')
const showError = ref(false)
function handleSubmit() {
  if (!barrage.value) {
    showError.value = true
    return
  }
  showError.value = false
  emits('setBarrage', barrage.value)
  barrage.value = ''
}
</script>

<template>
  <container class="flex items-center gap-5 py-4">
    <button
      type="button"
      class="bg-orange text-white h-[70px] rounded-[5px] flex-1 font-medium text-[13px] text-sm uppercase"
      @click="emits('setTicket')"
    >
      {{ isNewCard && !forceReveal ? 'Check' : 'New' }} Ticket
    </button>
    <div class="h-[40px] flex items-stretch">
      <div
        class="text-gray-300 bg-white h-full flex items-center rounded-l-[5px] transition-all duration-500 ease-in-out whitespace-nowrap overflow-hidden"
        :class="{
          'max-w-[400px] pr-4 pl-[5px] pr-[13px] ': showBarrage,
          '!max-w-0': !showBarrage,
        }"
        @click="handleShowBarrageModal"
      >
        <p class="text-xs">Input barrage</p>
      </div>
      <button
        class="rounded-[5px] bg-primary-light text-white px-4 -ml-2 font-bold relative"
        @click="showBarrage = !showBarrage"
      >
        B
        <div class="absolute bottom-2 right-2 text-xs">
          <Icon v-if="showBarrage" icon="icon-park-solid:check-one" />
          <Icon v-else icon="line-md:minus-circle-filled" />
        </div>
      </button>
      <template v-if="showBarrageModal">
        <div>
          <div
            class="fixed inset-0 h-[100dvh] bg-black/30 flex"
            @click="showBarrageModal = false"
          ></div>
          <container class="fixed left-1/2 -translate-x-1/2 bottom-0 bg-gray-50 p-2">
            <form class="w-full flex items-stretch gap-4" @submit.prevent="handleSubmit">
              <input
                ref="inputRef"
                v-model="barrage"
                type="text"
                placeholder="Input barrage"
                class="bg-white flex-1 rounded-[10px] outline-none border-none px-3 text-sm"
                autofocus
              />
              <button
                type="submit"
                class="bg-primary-light text-white h-[40px] w-[70px] rounded-[10px] text-xs font-bold"
              >
                Send
              </button>
            </form>
          </container>
        </div>
        <note-modal v-model="showError" variant="bold">
          <div class="py-3">
            <h4>Tips</h4>
            <p class="text-sm pt-2">Please enter word</p>
          </div>
        </note-modal>
      </template>
    </div>
  </container>
</template>
