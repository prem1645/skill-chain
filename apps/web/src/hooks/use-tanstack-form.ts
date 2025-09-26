import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from '@/components/ui/form'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
})
