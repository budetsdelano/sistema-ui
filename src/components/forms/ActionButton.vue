<template>
  <button :type="type" :disabled="disabled" :class="computedClasses" @click="handleClick">
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Кнопка',
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  variant: {
    type: String,
    default: 'base',
    validator: (value) => ['base', 'minor'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const computedClasses = computed(() => ({
  button: true,
  'action-button': true,
  [`action-button--${props.variant}`]: true,
  'action-button--disabled': props.disabled,
  'action-button--error': props.error,
}))

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
