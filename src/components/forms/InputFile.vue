<template>
  <div class="input-file-wrapper">
    <div
      class="input-file-dropzone"
      :class="computedClasses"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input ref="fileInput" type="file" :multiple="multiple" :disabled="disabled" @click.stop />

      <div class="input-file-content">
        <!--<div class="input-file-icon">📎</div>-->
        <div class="input-file-text">
          {{ dropzoneText }}
          <span v-if="!hasFiles" class="input-file-hint">
            {{ hint }}
          </span>
        </div>
        <div v-if="hasFiles" class="input-file-list">
          <div v-for="(file, index) in files" :key="index" class="input-file-item">
            <span>{{ file.name }}</span>
            <button class="button button-icon input-file-remove" @click.stop="removeFile(index)">
              <svg class="icon icon--big icon-xmark">
                <use :href="'/assets/img/sprite.svg#xmark'"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Перетащите файл или несколько',
  },
  hint: {
    type: String,
    default: 'до 5 Мб каждый',
  },
  multiple: {
    type: Boolean,
    default: true,
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

const fileInput = ref(null)
const files = ref([])
const isDragOver = ref(false)

const computedClasses = computed(() => ({
  'input-file': true,
  'input-file--disabled': props.disabled,
  'input-file--error': props.error,
  'input-file--drag-over': isDragOver.value,
  'input-file--has-files': hasFiles.value,
}))

const hasFiles = computed(() => files.value.length > 0)
const dropzoneText = computed(() => {
  if (hasFiles.value) {
    return `Выбрано файлов: ${files.value.length}`
  }
  return props.placeholder
})

const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files || [])
  if (selectedFiles.length > 0) {
    files.value = [...files.value, ...selectedFiles]
    emit('update:modelValue', files.value)
    emit('change', files.value)

    // Сброс значения input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const triggerFileInput = () => {
  if (!props.disabled && fileInput.value) {
    // Очищаем предыдущий обработчик
    fileInput.value.onchange = null

    // Устанавливаем новый обработчик
    fileInput.value.onchange = handleFileChange

    // Открываем диалог выбора файлов
    fileInput.value.click()
  }
}

const handleDragOver = () => {
  if (!props.disabled) {
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event) => {
  if (!props.disabled) {
    isDragOver.value = false
    const droppedFiles = Array.from(event.dataTransfer.files || [])
    if (droppedFiles.length > 0) {
      files.value = [...files.value, ...droppedFiles]
      emit('update:modelValue', files.value)
      emit('change', files.value)
    }
  }
}

const removeFile = (index) => {
  files.value.splice(index, 1)
  emit('update:modelValue', files.value)
  emit('change', files.value)
}

const clearFiles = () => {
  files.value = []
  emit('update:modelValue', [])
}

const handleInputClick = (event) => {
  event.stopPropagation()
}

onMounted(() => {
  if (fileInput.value) {
    fileInput.value.addEventListener('click', handleInputClick)
  }
})

onUnmounted(() => {
  if (fileInput.value) {
    fileInput.value.removeEventListener('click', handleInputClick)
  }
})

defineExpose({
  clearFiles,
})
</script>
