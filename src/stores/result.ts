import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { RESULT_TYPE_E } from '@/types/prize.enum'

export const useResultStore = defineStore('result', () => {
  const resultType = ref<RESULT_TYPE_E>()
  const resultAmount = ref(0)
  const getResultType = computed(() => resultType.value)
  const getResultAmount = computed(() => resultAmount.value)

  const setResultType = (type?: RESULT_TYPE_E) => {
    resultType.value = type
  }

  return { getResultType, getResultAmount, setResultType }
})
