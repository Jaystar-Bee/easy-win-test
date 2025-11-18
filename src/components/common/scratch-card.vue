<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

// --- INTERFACES ---
interface Point {
  x: number
  y: number
}
interface Props {
  threshold: number
  coverThickness: number
  coverImageUrl: string
  isRevealed: boolean
  // NEW PROP for resetting the cover
  isReset: boolean
}

// --- PROPS and EMITS ---
const props = withDefaults(defineProps<Props>(), {
  threshold: 80,
  coverThickness: 30,
  isRevealed: false,
  isReset: false, // Default to NOT resetting
})

const emit = defineEmits<{
  (e: 'progress', percentage: number): void
  (e: 'complete'): void
  (e: 'reset-completed'): void // New event to acknowledge the reset
}>()

// --- REACTIVE STATE AND REFS ---
const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)
const isScratching = ref(false)
const scratchPercent = ref(0)
const canvasOpacity = ref(1)

// ... (other internal variables: ctx, lastPoint, resizeObserver, coverImage, animationFrameId) ...
let ctx: CanvasRenderingContext2D | null = null
let lastPoint: Point = { x: 0, y: 0 }
let resizeObserver: ResizeObserver | null = null
let coverImage: HTMLImageElement | null = null
let animationFrameId: number | null = null

// --- WATCHERS ---

// Watch the reset prop
watch(
  () => props.isReset,
  (newVal) => {
    if (newVal) {
      resetCardState()
    }
  },
)
// ... (existing watchers for coverImageUrl and isRevealed) ...
watch(
  () => props.coverImageUrl,
  () => {
    loadCoverImage()
  },
)
watch(
  () => props.isRevealed,
  (newVal) => {
    if (newVal) startRevealAnimation()
  },
)

// --- RESET FUNCTION ---

/**
 * Resets the card state: redraws the cover, resets scratch data, and opacity.
 */
const resetCardState = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId) // Stop any ongoing reveal animation
    animationFrameId = null
  }

  // 1. Redraw the cover image to cover the entire canvas
  drawCover()

  // 2. Reset internal states
  isScratching.value = false
  scratchPercent.value = 0
  canvasOpacity.value = 1 // Make the cover visible (full opacity)

  // 3. Reset the context state to ensure normal drawing continues
  if (ctx) {
    // Restore default globalCompositeOperation (crucial!)
    ctx.globalCompositeOperation = 'source-over'
  }

  // 4. Acknowledge completion of reset (Important for parent to know it's done)
  emit('reset-completed')
}

// --- DRAWING LOGIC (The core `drawCover` function is essential here) ---

const drawCover = () => {
  if (!ctx || !canvasRef.value) return

  // Reset composite mode before drawing the fresh cover
  ctx.globalCompositeOperation = 'source-over'

  // 1. Clear the canvas
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  // 2. Draw the loaded image
  if (coverImage && coverImage.complete) {
    ctx.drawImage(coverImage, 0, 0, canvasRef.value.width, canvasRef.value.height)
  } else {
    // Fallback: If image hasn't loaded yet
    ctx.fillStyle = '#666666'
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
  // Immediately set the composite mode back for scratching, if not resetting
  if (!props.isReset) {
    ctx.globalCompositeOperation = 'destination-out'
  }
}

// --- IMAGE LOADING LOGIC ---
const loadCoverImage = () => {
  if (!props.coverImageUrl) return
  coverImage = new Image()
  coverImage.crossOrigin = 'anonymous'
  coverImage.onload = () => {
    drawCover()
  }
  coverImage.onerror = () => {
    console.error(`Failed to load scratch cover image from: ${props.coverImageUrl}`)
    coverImage = null
  }
  coverImage.src = props.coverImageUrl
}

// --- DYNAMIC SIZING and DRAWING LOGIC (Simplified/Unchanged) ---
const setCanvasSize = () => {
  if (!canvasRef.value || !wrapperRef.value || !ctx) return
  const width = wrapperRef.value.clientWidth
  const height = wrapperRef.value.clientHeight
  canvasRef.value.width = width
  canvasRef.value.height = height
  drawCover()
}

const drawCover = () => {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  if (coverImage && coverImage.complete) {
    ctx.drawImage(coverImage, 0, 0, canvasRef.value.width, canvasRef.value.height)
  } else {
    ctx.fillStyle = '#666666'
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

// --- SCRATCHING LOGIC (Unchanged) ---
const getEventCoords = (e: MouseEvent | TouchEvent): Point => {
  // ... (logic remains the same)
  if (!canvasRef.value) return { x: 0, y: 0 }
  // ... (rest of the coordinate calculation)
  const rect = canvasRef.value.getBoundingClientRect()
  let clientX: number, clientY: number

  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else if ('clientX' in e) {
    clientX = e.clientX
    clientY = e.clientY
  } else {
    return { x: 0, y: 0 }
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}

const scratchAt = (x: number, y: number) => {
  if (!ctx || props.isRevealed) return // Prevent scratching if manually revealed

  ctx.globalCompositeOperation = 'destination-out'
  ctx.lineWidth = props.coverThickness
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()
  ctx.moveTo(lastPoint.x, lastPoint.y)
  ctx.lineTo(x, y)
  ctx.stroke()

  lastPoint = { x, y }
  calculateScratchPercentage()
}

const startScratch = (e: MouseEvent | TouchEvent) => {
  if (props.isRevealed) return // Prevent scratching if revealed
  isScratching.value = true
  lastPoint = getEventCoords(e)
  scratchAt(lastPoint.x, lastPoint.y)
}

const scratch = (e: MouseEvent | TouchEvent) => {
  if (!isScratching.value || props.isRevealed) return
  const currentPoint = getEventCoords(e)
  scratchAt(currentPoint.x, currentPoint.y)
}

const endScratch = () => {
  isScratching.value = false
}

// --- COMPLETION DETECTION (Unchanged, but ensures it doesn't run during manual reveal) ---
const calculateScratchPercentage = () => {
  if (!ctx || !canvasRef.value || props.isRevealed) return

  // ... (pixel data calculation logic remains the same)
  // ... (omitted for brevity, assume the original logic is here)
  const width = canvasRef.value.width
  const height = canvasRef.value.height

  try {
    const imageData = ctx.getImageData(0, 0, width, height)
    const pixelData = imageData.data
    const totalPixels = width * height
    let transparentPixels = 0

    for (let i = 3; i < pixelData.length; i += 4) {
      if (pixelData[i] < 50) {
        transparentPixels++
      }
    }

    const percent = (transparentPixels / totalPixels) * 100
    scratchPercent.value = percent

    emit('progress', percent)

    if (percent >= props.threshold) {
      // Manual clear on threshold completion
      ctx.clearRect(0, 0, width, height)
      emit('complete')
    }
  } catch (error) {
    console.warn('CORS warning in calculateScratchPercentage:', error)
  }
}

// --- MANUAL REVEAL ANIMATION LOGIC ---

const startRevealAnimation = () => {
  // 1. Clear any existing animation
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }

  // 2. Clear the canvas content instantly (the animation will only control opacity)
  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }

  // 3. Start the fade-out animation
  const animate = () => {
    // Decrease opacity gradually (e.g., 0.05 per frame)
    canvasOpacity.value -= 0.05

    if (canvasOpacity.value > 0) {
      // Continue the animation loop
      animationFrameId = requestAnimationFrame(animate)
    } else {
      // Animation finished
      canvasOpacity.value = 0
      emit('complete')
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

// --- LIFECYCLE HOOKS (Unchanged) ---
onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d') as CanvasRenderingContext2D
  }
  loadCoverImage()
  setCanvasSize()
  if (wrapperRef.value) {
    resizeObserver = new ResizeObserver(setCanvasSize)
    resizeObserver.observe(wrapperRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="w-full h-full relative overflow-hidden" ref="wrapperRef">
    <div class="absolute top-0 left-0 w-full h-full block">
      <slot></slot>
    </div>

    <canvas
      ref="canvasRef"
      class="absolute top-0 left-0 w-full h-full block cursor-crosshair transition-all duration-300 ease-in-out"
      @mousedown="startScratch"
      @mousemove="scratch"
      @mouseup="endScratch"
      @mouseleave="endScratch"
      @touchstart.prevent="startScratch"
      @touchmove.prevent="scratch"
      @touchend.prevent="endScratch"
    ></canvas>
  </div>
</template>
