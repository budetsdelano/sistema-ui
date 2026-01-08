<template>
  <div v-if="visible" :class="computedClasses" role="alert">
    <div class="alert-block-content">
      <!--<div class="alert-block-icon">
        <slot name="icon">
          <span v-if="type === 'success'">✓</span>
          <span v-else-if="type === 'info'">ℹ</span>
          <span v-else-if="type === 'warning'">⚠</span>
          <span v-else-if="type === 'danger'">✕</span>
        </slot>
      </div>-->

      <div class="alert-block-body">
        <!--<div v-if="title" class="alert-block-title">
          {{ title }}
        </div>-->

        <div class="alert-block-message">
          {{ message }}
        </div>
      </div>
    </div>

    <button v-if="closable" class="alert-block-close" @click="handleClose" aria-label="Закрыть">
      ×
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning', 'success', 'danger'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: true,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  autoClose: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 5000,
  },
})

const emit = defineEmits(['close'])

const computedClasses = computed(() => ({
  'alert-block': true,
  [`alert-block--${props.type}`]: true,
}))

let timeoutId = null

// onMounted(() => {
//   if (props.autoClose && props.duration > 0) {
//     timeoutId = setTimeout(() => {
//       handleClose()
//     }, props.duration)
//   }
// })

const handleClose = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  emit('close')
}
</script>
