import { formFields } from '@/config/formFields'

export const submitFormToPHP = async (formData) => {
  try {
    const dataToSend = {
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      agree: formData.agree || false,
      files: formData.files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }))
    };

    const response = await fetch('/api/form.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: data,
      status: response.status,
      message: data.message || (response.ok ? formFields.messages.formSuccess : formFields.messages.apiError)
    };

  } catch (error) {
    console.error(formFields.messages.apiError, error);

    return {
      success: false,
      error: error.message,
      status: 0,
      message: formFields.messages.networkError
    };
  }
};
