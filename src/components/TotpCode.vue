<template>
  <div class="flex justify-center">
    <div class="flex gap-2">
      <input
        v-for="(digit, index) in otp"
        :key="index"
        :ref="(el) => setInputRef(el as HTMLInputElement, index)"
        type="text"
        maxlength="1"
        class="block w-12 h-12 rounded-md bg-white px-3 py-1.5 text-center text-base font-medium text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        :value="digit"
        @input="handleInput(index, ($event.target as HTMLInputElement).value)"
        @keydown="handleKeyDown($event, index)"
        @focus="handleFocus($event.target as HTMLInputElement)"
        @paste="handlePaste($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'

interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'complete', value: string): void
}

const emit = defineEmits<Emits>()

const otp = reactive<string[]>(Array(6).fill(''))
const inputRefs = ref<(HTMLInputElement | null)[]>([])

const setInputRef = (el: HTMLInputElement | null, index: number) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const focusInput = (index: number) => {
  nextTick(() => {
    if (inputRefs.value[index]) {
      inputRefs.value[index]?.focus()
    }
  })
}

const handleKeyDown = (e: KeyboardEvent, index: number) => {
  if (
    !/^[0-9]{1}$/.test(e.key) &&
    e.key !== 'Backspace' &&
    e.key !== 'Delete' &&
    e.key !== 'Tab' &&
    e.key !== 'ArrowLeft' &&
    e.key !== 'ArrowRight' &&
    !e.metaKey
  ) {
    e.preventDefault()
    return
  }

  if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault()

    if (otp[index]) {
      otp[index] = ''
    } else if (index > 0) {
      otp[index - 1] = ''
      focusInput(index - 1)
    }

    updateModelValue()
  }

  if (e.key === 'ArrowLeft' && index > 0) {
    focusInput(index - 1)
  }

  if (e.key === 'ArrowRight' && index < otp.length - 1) {
    focusInput(index + 1)
  }
}

const handleInput = (index: number, value: string) => {
  const digit = value.slice(-1)

  if (/^[0-9]$/.test(digit)) {
    otp[index] = digit

    if (index < otp.length - 1) {
      focusInput(index + 1)
    }

    updateModelValue()

    if (otp.every(d => d !== '') && index === otp.length - 1) {
      emit('complete', otp.join(''))
    }
  }
}

const handleFocus = (target: HTMLInputElement) => {
  target.select()
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()

  const text = e.clipboardData?.getData('text') || ''
  const numbers = text.replace(/\D/g, '').slice(0, otp.length)

  if (numbers.length > 0) {
    for (let i = 0; i < otp.length; i++) {
      otp[i] = numbers[i] || ''
    }

    const nextIndex = Math.min(numbers.length, otp.length - 1)
    focusInput(nextIndex)

    updateModelValue()

    if (numbers.length === otp.length) {
      emit('complete', numbers)
    }
  }
}

const updateModelValue = () => {
  const value = otp.join('')
  emit('update:modelValue', value)
}

const clear = () => {
  otp.fill('')
  updateModelValue()
  focusInput(0)
}

const setValue = (value: string) => {
  const digits = value.slice(0, 6).split('')
  for (let i = 0; i < otp.length; i++) {
    otp[i] = digits[i] || ''
  }
  updateModelValue()
}

if (props.modelValue) {
  setValue(props.modelValue)
}

defineExpose({
  clear,
  setValue,
  focus: () => focusInput(0)
})
</script>
