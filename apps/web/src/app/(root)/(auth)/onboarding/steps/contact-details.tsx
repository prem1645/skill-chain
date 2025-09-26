'use client'

import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface ContactDetailsProps {
  form: any
}

export function ContactDetails({ form }: ContactDetailsProps) {
  return (
    <div className='space-y-8 animate-in slide-in-from-right-4 duration-300'>
      <Form className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <form.AppField name='adminName'>
            {(field: any) => (
              <FormItem>
                <FormLabel
                  className={`text-sm font-medium ${field.state.meta.errors.length > 0 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                  Administrator Name *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter administrator name'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </form.AppField>

          <form.AppField name='adminPhone'>
            {(field: any) => (
              <FormItem>
                <FormLabel
                  className={`text-sm font-medium ${field.state.meta.errors.length > 0 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                  Phone Number *
                </FormLabel>
                <FormControl>
                  <Input
                    type='tel'
                    placeholder='+1 (555) 123-4567'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={`rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </form.AppField>
        </div>

        <form.AppField name='adminEmail'>
          {(field: any) => (
            <FormItem>
              <FormLabel
                className={`text-sm font-medium ${field.state.meta.errors.length > 0 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                Email Address *
              </FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='admin@college.edu'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={`rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </form.AppField>
      </Form>

      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
        <h4 className='text-sm font-medium mb-2 text-blue-900 dark:text-blue-100'>
          Contact Information Notice
        </h4>
        <p className='text-xs text-blue-800 dark:text-blue-200'>
          This information will be used for account management and important
          communications. Please ensure the email address is regularly monitored
          and the phone number is current.
        </p>
      </div>
    </div>
  )
}
