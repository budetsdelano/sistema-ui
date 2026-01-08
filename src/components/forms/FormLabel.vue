<template>
  <label :for="forId" :class="computedClasses">
    {{ label }}<span v-if="required" class="label-required">*</span>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  forId: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const computedClasses = computed(() => ({
  'form-label': true,
  'form-label--required': props.required,
}))
</script>
