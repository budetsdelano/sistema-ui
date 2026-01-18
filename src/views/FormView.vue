<template>
  <div class="container">
    <div class="form">
      <div class="form-container">
        <div class="form-title h2">{{ formConfig.form.title }}</div>

        <AlertBlock
          v-if="showSuccessAlert"
          type="success"
          :title="formConfig.alerts.success.title"
          :message="formConfig.alerts.success.message"
          :closable="formConfig.alerts.success.closable"
          :auto-close="formConfig.alerts.success.autoClose"
          :duration="formConfig.alerts.success.duration"
          @close="showSuccessAlert = false"
        />

        <form :id="formConfig.form.id" @submit.prevent="handleSubmit" class="form-fields">
          <div
            v-for="(fieldConfig, fieldId) in formConfig.fields"
            :key="fieldId"
            class="form-group"
          >
            <FormLabel
              v-if="fieldConfig.component !== 'InputCheckbox'"
              :label="fieldConfig.label"
              :for="fieldConfig.id"
              :required="fieldConfig.required"
            />

            <InputText
              v-if="fieldConfig.component === 'InputText'"
              :id="fieldConfig.id"
              v-model="formData[fieldId]"
              :type="fieldConfig.type"
              :placeholder="fieldConfig.placeholder"
              :mask="fieldConfig.mask"
              :disabled="isSubmitting"
              :error="!!errors[fieldId]"
              @blur="validateField(fieldId, formData[fieldId])"
            />

            <InputFile
              v-else-if="fieldConfig.component === 'InputFile'"
              ref="fileInputRef"
              v-model="formData[fieldId]"
              :placeholder="fieldConfig.placeholder"
              :hint="fieldConfig.hint"
              :multiple="fieldConfig.multiple"
              :disabled="isSubmitting"
              :error="!!errors[fieldId]"
              @change="validateFileField(fieldId, formData[fieldId])"
            />

            <InputCheckbox
              v-else-if="fieldConfig.component === 'InputCheckbox'"
              v-model="formData[fieldId]"
              :disabled="isSubmitting"
              :error="!!errors[fieldId]"
              @change="validateField(fieldId, formData[fieldId])"
            >
              <span v-html="fieldConfig.label"></span>
            </InputCheckbox>

            <Notification
              v-if="errors[fieldId]"
              type="error"
              :message="errors[fieldId]"
              :closable="false"
              :auto-close="false"
            />
          </div>

          <div
            class="notification form-required-note notification--info"
            v-html="formConfig.form.requiredNote"
          ></div>

          <div class="form-buttons">
            <ActionButton
              type="submit"
              :label="
                isSubmitting ? formConfig.messages.submitting : formConfig.buttons.submit.label
              "
              :variant="formConfig.buttons.submit.variant"
              :disabled="isSubmitting || hasErrors"
            />

            <ActionButton
              type="button"
              :label="formConfig.buttons.cancel.label"
              :variant="formConfig.buttons.cancel.variant"
              :disabled="isSubmitting"
              @click="resetForm"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  InputText,
  InputFile,
  InputCheckbox,
  FormLabel,
  ActionButton,
  Notification,
  AlertBlock,
} from '@/components/forms'
import { formFields as formConfig } from '@/config/formFields'
import { submitFormToPHP } from '@/api/formApi'

const initialFormData = {}
Object.keys(formConfig.fields).forEach((fieldId) => {
  const field = formConfig.fields[fieldId]
  if (field.component === 'InputFile') {
    initialFormData[fieldId] = []
  } else if (field.component === 'InputCheckbox') {
    initialFormData[fieldId] = false
  } else {
    initialFormData[fieldId] = ''
  }
})

const formData = reactive(initialFormData)
const errors = reactive({})
const isSubmitting = ref(false)
const showSuccessAlert = ref(false)
const fileInputRef = ref(null)

const hasErrors = computed(() => {
  return Object.keys(errors).some((key) => errors[key])
})

const validateField = (fieldId, value) => {
  const field = formConfig.fields[fieldId]
  errors[fieldId] = ''

  if (field.required) {
    if (field.component === 'InputCheckbox' && !value) {
      errors[fieldId] =
        field.validation?.requiredMessage || formConfig.validation.generalMessages.required
      return false
    }

    if (field.component === 'InputText' && !value?.trim()) {
      errors[fieldId] = formConfig.validation.generalMessages.required
      return false
    }
  }

  if (field.type === 'email' && value) {
    if (!field.validation.pattern.test(value)) {
      errors[fieldId] = field.validation.errorMessage || formConfig.validation.generalMessages.email
      return false
    }
  }

  if (field.id === 'phone' && value) {
    const cleanPhone = value.replace(/\D/g, '')
    if (cleanPhone.length < 11) {
      errors[fieldId] = formConfig.validation.generalMessages.phone
      return false
    }
  }

  return true
}

const validateFileField = (fieldId, files) => {
  const field = formConfig.fields[fieldId]
  errors[fieldId] = ''

  if (!field.validation) return true

  if (files.length === 0) return true

  for (const file of files) {
    if (field.validation.maxSize && file.size > field.validation.maxSize) {
      const message =
        field.validation.maxSizeMessage || formConfig.validation.generalMessages.fileSize
      errors[fieldId] = message.replace('{fileName}', file.name)
      return false
    }
  }

  if (field.validation.maxFiles && files.length > field.validation.maxFiles) {
    const message = field.validation.maxFilesMessage || 'Максимум {maxFiles} файлов'
    errors[fieldId] = message.replace('{maxFiles}', field.validation.maxFiles)
    return false
  }

  if (field.validation.allowedTypes && field.validation.allowedTypes.length > 0) {
    for (const file of files) {
      const isAllowed = field.validation.allowedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0]
          return file.type.startsWith(category + '/')
        }
        return file.type === type
      })

      if (!isAllowed) {
        const message =
          field.validation.fileTypeMessage || formConfig.validation.generalMessages.fileType
        errors[fieldId] = message.replace('{fileName}', file.name)
        return false
      }
    }
  }

  return true
}

const validateForm = () => {
  let isValid = true

  Object.keys(formConfig.fields).forEach((fieldId) => {
    const field = formConfig.fields[fieldId]

    if (field.component === 'InputFile') {
      if (!validateFileField(fieldId, formData[fieldId])) {
        isValid = false
      }
    } else {
      if (!validateField(fieldId, formData[fieldId])) {
        isValid = false
      }
    }
  })

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const result = await submitFormToPHP(formData)

    if (result.success) {
      showSuccessAlert.value = true
      resetForm()
    } else {
      if (result.data?.errors) {
        result.data.errors.forEach((error) => {
          if (error.includes('email')) {
            errors.email = error
          } else if (error.includes('телефон') || error.includes('phone')) {
            errors.phone = error
          } else if (error.includes('согласие') || error.includes('agree')) {
            errors.agree = error
          }
        })
      }
    }
  } catch (error) {
    console.error(formConfig.messages.criticalError, error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (formConfig.fields[key].component === 'InputFile') {
      formData[key] = []
    } else if (formConfig.fields[key].component === 'InputCheckbox') {
      formData[key] = false
    } else {
      formData[key] = ''
    }
  })

  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  if (fileInputRef.value) {
    fileInputRef.value.clearFiles()
  }
}
</script>
