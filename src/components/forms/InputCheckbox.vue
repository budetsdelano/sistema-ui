<template>
  <label :class="computedClasses">
    <input type="checkbox" :checked="modelValue" :disabled="disabled" @change="handleChange" />
    <span class="checkbox-label">
      <slot>
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
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

const emit = defineEmits(['update:modelValue', 'change'])

const computedClasses = computed(() => ({
  'input-checkbox': true,
  'input-checkbox--checked': props.modelValue,
  'input-checkbox--disabled': props.disabled,
  'input-checkbox--error': props.error,
}))

const handleChange = (event) => {
  emit('update:modelValue', event.target.checked)
  emit('change', event.target.checked)
}
</script>
