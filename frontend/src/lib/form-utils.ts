// FORM UTILITIES FOR TYPE-SAFE FORM HANDLING
// ==========================================

import type {
  FormValidationResult,
  FormFieldConfig,
  FormSubmissionResult,
  FormState,
  FormAction,
  EventFilterFormData,
  NewsletterFormData,
  ContactFormData,
  SearchFormData,
  GenericFormData,
  FormSecurityConfig,
  FormSecurityCheck,
  FormSubmissionContext,
  commonValidationRules,
  formDataProcessors,
  eventFilterFormFields,
  newsletterFormFields,
  contactFormFields,
  searchFormFields
} from '../../../studio/schemaTypes/shared/types'

// Re-export types for frontend use
export type {
  FormValidationResult,
  FormFieldConfig,
  FormSubmissionResult,
  FormState,
  FormAction,
  EventFilterFormData,
  NewsletterFormData,
  ContactFormData,
  SearchFormData,
  GenericFormData,
  FormSecurityConfig,
  FormSecurityCheck,
  FormSubmissionContext
}

// FRONTEND-SPECIFIC FORM UTILITIES
// =================================

// Enhanced form state reducer
export function formReducer<T = GenericFormData>(
  state: FormState<T>,
  action: FormAction<T>
): FormState<T> {
  switch (action.type) {
    case 'SET_FIELD':
      if (!action.payload?.field || action.payload.value === undefined) {
        return state
      }

      const newData = {
        ...state.data,
        [action.payload.field]: action.payload.value
      }

      return {
        ...state,
        data: newData,
        valid: validateFormState(newData, state.errors)
      }

    case 'SET_ERRORS':
      const errors = action.payload?.errors || {}
      return {
        ...state,
        errors,
        valid: validateFormState(state.data, errors)
      }

    case 'SET_SUBMITTING':
      return {
        ...state,
        submitting: action.payload?.value || false
      }

    case 'TOUCH_FIELD':
      if (!action.payload?.field) {
        return state
      }

      return {
        ...state,
        touched: {
          ...state.touched,
          [action.payload.field]: true
        }
      }

    case 'RESET_FORM':
      return {
        data: action.payload?.data || {} as Partial<T>,
        errors: {},
        touched: {},
        submitting: false,
        submitted: false,
        valid: false
      }

    default:
      return state
  }
}

// Create initial form state
export function createInitialFormState<T = GenericFormData>(
  initialData?: Partial<T>
): FormState<T> {
  return {
    data: initialData || {} as Partial<T>,
    errors: {},
    touched: {},
    submitting: false,
    submitted: false,
    valid: false
  }
}

// Validate form state
function validateFormState<T>(
  data: Partial<T>,
  errors: Record<string, string[]>
): boolean {
  return Object.keys(errors).length === 0 && Object.keys(data).length > 0
}

// Form field component helpers
export function getFieldProps(
  fieldConfig: FormFieldConfig,
  value: any,
  error?: string[]
) {
  const baseProps = {
    name: fieldConfig.name,
    type: fieldConfig.type,
    placeholder: fieldConfig.placeholder,
    required: fieldConfig.required,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? `${fieldConfig.name}-error` : undefined,
    ...fieldConfig.attributes
  }

  // Handle different input types
  switch (fieldConfig.type) {
    case 'checkbox':
    case 'radio':
      return {
        ...baseProps,
        checked: Boolean(value)
      }

    case 'select':
      return {
        ...baseProps,
        value: value || ''
      }

    default:
      return {
        ...baseProps,
        value: value || ''
      }
  }
}

// Generate form field error message
export function getFieldErrorMessage(
  fieldName: string,
  errors: Record<string, string[]>
): string | null {
  const fieldErrors = errors[fieldName]
  return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : null
}

// Check if field should show error
export function shouldShowFieldError(
  fieldName: string,
  touched: Record<string, boolean>,
  errors: Record<string, string[]>
): boolean {
  return Boolean(touched[fieldName] && errors[fieldName])
}

// FORM SUBMISSION UTILITIES
// ==========================

// Generic form submission handler
export async function submitForm<T = any>(
  endpoint: string,
  data: GenericFormData,
  options: {
    method?: 'POST' | 'PUT' | 'PATCH'
    headers?: Record<string, string>
    transformData?: (data: GenericFormData) => any
  } = {}
): Promise<FormSubmissionResult<T>> {
  try {
    const {
      method = 'POST',
      headers = {},
      transformData
    } = options

    // Transform data if transformer provided
    const submissionData = transformData ? transformData(data) : data

    // Prepare request
    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    // Handle different content types
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      const formData = new URLSearchParams()
      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })
      requestInit.body = formData.toString()
    } else {
      requestInit.body = JSON.stringify(submissionData)
    }

    const response = await fetch(endpoint, requestInit)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        errors: errorData.errors || { general: ['En feil oppstod under innsending'] },
        message: errorData.message || 'Innsending feilet'
      }
    }

    const result = await response.json()

    return {
      success: true,
      data: result.data,
      message: result.message || 'Innsending vellykket',
      redirectUrl: result.redirectUrl
    }

  } catch (error) {
    console.error('Form submission error:', error)

    return {
      success: false,
      errors: { general: ['En uventet feil oppstod'] },
      message: 'Innsending feilet'
    }
  }
}

// Specific form submission handlers
export const formSubmissionHandlers = {
  // Event filter submission (for HTMX)
  submitEventFilter: async (data: EventFilterFormData): Promise<FormSubmissionResult> => {
    return submitForm('/api/filter-events', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },

  // Newsletter subscription
  submitNewsletter: async (data: NewsletterFormData): Promise<FormSubmissionResult> => {
    return submitForm('/api/newsletter', data, {
      transformData: (formData) => ({
        ...formData,
        email: formDataProcessors.normalizeEmail(formData.email as string),
        timestamp: new Date().toISOString()
      })
    })
  },

  // Contact form submission
  submitContact: async (data: ContactFormData): Promise<FormSubmissionResult> => {
    return submitForm('/api/contact', data, {
      transformData: (formData) => ({
        ...formData,
        email: formDataProcessors.normalizeEmail(formData.email as string),
        phone: formData.phone ? formDataProcessors.normalizePhone(formData.phone as string) : undefined,
        timestamp: new Date().toISOString()
      })
    })
  },

  // Search form submission
  submitSearch: async (data: SearchFormData): Promise<FormSubmissionResult> => {
    return submitForm('/api/search', data, {
      transformData: (formData) => ({
        ...formData,
        query: formDataProcessors.sanitizeString(formData.query as string),
        timestamp: new Date().toISOString()
      })
    })
  }
} as const

// FORM CONFIGURATION HELPERS
// ===========================

// Get form configuration by type
export function getFormConfig(formType: 'eventFilter' | 'newsletter' | 'contact' | 'search'): {
  fields: FormFieldConfig[]
  submitHandler: (data: any) => Promise<FormSubmissionResult>
} {
  switch (formType) {
    case 'eventFilter':
      return {
        fields: eventFilterFormFields,
        submitHandler: formSubmissionHandlers.submitEventFilter
      }

    case 'newsletter':
      return {
        fields: newsletterFormFields,
        submitHandler: formSubmissionHandlers.submitNewsletter
      }

    case 'contact':
      return {
        fields: contactFormFields,
        submitHandler: formSubmissionHandlers.submitContact
      }

    case 'search':
      return {
        fields: searchFormFields,
        submitHandler: formSubmissionHandlers.submitSearch
      }

    default:
      throw new Error(`Unknown form type: ${formType}`)
  }
}

// ACCESSIBILITY HELPERS
// ======================

// Generate ARIA attributes for form fields
export function getFieldAriaAttributes(
  fieldConfig: FormFieldConfig,
  hasError: boolean,
  isRequired?: boolean
): Record<string, string> {
  const attributes: Record<string, string> = {}

  if (hasError) {
    attributes['aria-invalid'] = 'true'
    attributes['aria-describedby'] = `${fieldConfig.name}-error`
  }

  if (isRequired ?? fieldConfig.required) {
    attributes['aria-required'] = 'true'
  }

  if (fieldConfig.type === 'checkbox' || fieldConfig.type === 'radio') {
    attributes['role'] = fieldConfig.type
  }

  return attributes
}

// Generate form accessibility announcements
export function getFormAccessibilityMessages(
  formState: FormState,
  fieldConfigs: FormFieldConfig[]
): {
  errorSummary?: string
  successMessage?: string
  fieldErrors: Record<string, string>
} {
  const fieldErrors: Record<string, string> = {}
  const errorMessages: string[] = []

  // Collect field errors
  fieldConfigs.forEach(field => {
    if (formState.errors[field.name]) {
      const errorMessage = formState.errors[field.name][0]
      fieldErrors[field.name] = errorMessage
      errorMessages.push(`${field.label}: ${errorMessage}`)
    }
  })

  let errorSummary: string | undefined
  if (errorMessages.length > 0) {
    errorSummary = `Skjemaet inneholder ${errorMessages.length} feil: ${errorMessages.join(', ')}`
  }

  let successMessage: string | undefined
  if (formState.submitted && formState.valid) {
    successMessage = 'Skjemaet ble sendt inn vellykket'
  }

  return {
    errorSummary,
    successMessage,
    fieldErrors
  }
}

// FORM ANALYTICS HELPERS
// =======================

// Track form interactions
export function trackFormEvent(
  eventType: 'start' | 'field_focus' | 'field_blur' | 'validation_error' | 'submit_attempt' | 'submit_success' | 'submit_error',
  formType: string,
  fieldName?: string,
  metadata?: Record<string, any>
) {
  // This would integrate with analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', `form_${eventType}`, {
      form_type: formType,
      field_name: fieldName,
      ...metadata
    })
  }

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Form Event: ${eventType}`, {
      formType,
      fieldName,
      metadata
    })
  }
}

// Generate form completion context
export function generateFormContext(): FormSubmissionContext {
  return {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    timestamp: new Date().toISOString(),
    language: typeof navigator !== 'undefined' ? navigator.language : undefined
  }
}

// FORM SECURITY HELPERS
// ======================

// Basic client-side security checks
export function performClientSecurityChecks(
  data: GenericFormData,
  config: Partial<FormSecurityConfig> = {}
): FormSecurityCheck {
  const {
    maxBodySize = 10000, // 10KB default
    sanitizeInput = true
  } = config

  // Check data size
  const dataSize = JSON.stringify(data).length
  if (dataSize > maxBodySize) {
    return {
      allowed: false,
      reason: 'Form data too large'
    }
  }

  // Basic XSS prevention
  if (sanitizeInput) {
    const hasScript = Object.values(data).some(value =>
      typeof value === 'string' && /<script|javascript:/i.test(value)
    )

    if (hasScript) {
      return {
        allowed: false,
        reason: 'Potentially malicious content detected'
      }
    }
  }

  return {
    allowed: true
  }
}

// Re-export validation utilities from shared types
export {
  validateFormData,
  commonValidationRules,
  formDataProcessors,
  eventFilterFormFields,
  newsletterFormFields,
  contactFormFields,
  searchFormFields
} from '../../../studio/schemaTypes/shared/types'