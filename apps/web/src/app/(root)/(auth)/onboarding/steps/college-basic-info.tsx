'use client'

import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CollegeBasicInfoProps {
  form: any
}

export function CollegeBasicInfo({ form }: CollegeBasicInfoProps) {
  return (
    <div className='space-y-8 animate-in slide-in-from-right-4 duration-300'>
      <Form className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <form.AppField name='collegeName'>
            {(field: any) => (
              <FormItem>
                <FormLabel
                  className={`text-sm font-medium ${field.state.meta.errors.length > 0 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                  College/University Name *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter college name'
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

          <form.AppField name='collegeType'>
            {(field: any) => (
              <FormItem>
                <FormLabel
                  className={`text-sm font-medium ${field.state.meta.errors.length > 0 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                  College Type *
                </FormLabel>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}>
                  <FormControl>
                    <SelectTrigger
                      className={`rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                      }`}>
                      <SelectValue placeholder='Select college type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='public'>Public University</SelectItem>
                    <SelectItem value='private'>Private University</SelectItem>
                    <SelectItem value='community'>Community College</SelectItem>
                    <SelectItem value='technical'>
                      Technical Institute
                    </SelectItem>
                    <SelectItem value='liberal-arts'>
                      Liberal Arts College
                    </SelectItem>
                    <SelectItem value='research'>
                      Research University
                    </SelectItem>
                    <SelectItem value='online'>Online University</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          </form.AppField>
        </div>

        <form.AppField name='location'>
          {(field: any) => (
            <FormItem>
              <FormLabel
                className={`text-sm font-medium ${field.state.meta.errors.length > 0 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                Location *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='City, State/Province, Country'
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
    </div>
  )
}
