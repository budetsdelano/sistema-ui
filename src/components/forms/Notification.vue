<template>
  <div v-if="visible" :class="computedClasses" role="status">
    <div class="notification-content">
      <slot>
        {{ message }}
      </slot>
    </div>

    <button v-if="closable" class="notification-close" @click="handleClose" aria-label="Закрыть">
      ×
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning', 'success', 'error'].includes(value),
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
    default: 3000,
  },
})

const emit = defineEmits(['close'])

const computedClasses = computed(() => ({
  notification: true,
  [`notification--${props.type}`]: true,
}))

let timeoutId = null

onMounted(() => {
  if (props.autoClose && props.duration > 0) {
    timeoutId = setTimeout(() => {
      handleClose()
    }, props.duration)
  }
})

const handleClose = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  emit('close')
}
</script>
