export const formFields = {
  form: {
    id: 'contact-form',
    title: 'Заполните форму',
    successMessage: 'Сообщение отправлено',
    submitButton: 'Отправить',
    cancelButton: 'Отменить',
    requiredNote: '<span>*</span>&nbsp;Поля обязательны для заполнения'
  },

  fields: {
    name: {
      id: 'name',
      label: 'Представьтесь',
      type: 'text',
      component: 'InputText',
      placeholder: 'Иван Иванович Ивановский',
      required: false,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },

    email: {
      id: 'email',
      label: 'E-mail',
      type: 'email',
      component: 'InputText',
      placeholder: 'mail@mail.ru',
      required: true,
      mask: null,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: 'Некорректное значение'
      }
    },

    phone: {
      id: 'phone',
      label: 'Телефон',
      type: 'text',
      component: 'InputText',
      placeholder: '+7 (999) 999-99-99',
      required: true,
      mask: '+7 (###) ###-##-##',
      validation: {
        pattern: /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/,
        errorMessage: 'Введите корректный номер телефона'
      }
    },

    files: {
      id: 'files',
      label: 'Файлы',
      component: 'InputFile',
      placeholder: 'Перетащите файл или несколько',
      hint: 'до 5 Мб каждый',
      multiple: true,
      required: false,
      validation: {
        maxSize: 5 * 1024 * 1024,
        maxSizeMessage: 'Файл "{fileName}" превышает 5 МБ',
        maxFiles: 10,
        maxFilesMessage: 'Максимум {maxFiles} файлов',
        allowedTypes: [
          'image/*',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ],
        fileTypeMessage: 'Файл "{fileName}" имеет недопустимый тип'
      }
    },

    agree: {
      id: 'agree',
      label: 'Я согласен с <a href="/">условиями</a>',
      component: 'InputCheckbox',
      required: true,
      validation: {
        requiredMessage: 'Необходимо согласие с условиями'
      }
    }
  },

  buttons: {
    submit: {
      id: 'submit-btn',
      label: 'Отправить',
      variant: 'base',
      type: 'submit',
      action: 'submit'
    },
    cancel: {
      id: 'cancel-btn',
      label: 'Отменить',
      variant: 'minor',
      type: 'button',
      action: 'reset'
    }
  },

  validation: {
    generalMessages: {
      required: 'Поле обязательно для заполнения',
      email: 'Некорректный email',
      phone: 'Введите полный номер телефона',
      fileSize: 'Файл превышает максимальный размер',
      fileType: 'Недопустимый тип файла'
    },
    validateOn: ['blur', 'submit'],
    showErrorsImmediately: false
  },

  messages: {
    submitting: 'Отправка...',
    formSuccess: 'Форма успешно отправлена',
    apiError: 'Ошибка при отправке формы',
    networkError: 'Ошибка сети или сервер недоступен',
    criticalError: 'Критическая ошибка'
  },

  alerts: {
    success: {
      /*title: 'Сообщение отправлено',
      message: 'Форма успешно отправлена',
      */
      message: 'Сообщение отправлено',
      closable: false,
      autoClose: false,
      duration: 5000
    }
  }
}
