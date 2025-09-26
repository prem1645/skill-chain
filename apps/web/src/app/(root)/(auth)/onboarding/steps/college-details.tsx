'use client'

import { useState } from 'react'

import { PlusIcon, XIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface CollegeDetailsProps {
  form: any
}

export function CollegeDetails({ form }: CollegeDetailsProps) {
  const [newDepartment, setNewDepartment] = useState('')

  const addDepartment = () => {
    if (
      newDepartment.trim() &&
      !form.getFieldValue('departments').includes(newDepartment.trim())
    ) {
      const currentDepartments = form.getFieldValue('departments')
      form.setFieldValue('departments', [
        ...currentDepartments,
        newDepartment.trim(),
      ])
      setNewDepartment('')
    }
  }

  const removeDepartment = (departmentToRemove: string) => {
    const currentDepartments = form.getFieldValue('departments')
    form.setFieldValue(
      'departments',
      currentDepartments.filter((dept: string) => dept !== departmentToRemove)
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addDepartment()
    }
  }

  return (
    <div className='space-y-8 animate-in slide-in-from-right-4 duration-300'>
      <div className='space-y-6'>
        <form.AppField name='accreditation'>
          {(field: any) => (
            <FormItem>
              <FormLabel
                className={`text-sm font-medium ${field.state.meta.errors.length > 0 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                Accreditation Body *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g., AACSB, ABET, Regional Accreditation'
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

        <form.AppField name='studentCount'>
          {(field: any) => (
            <FormItem>
              <FormLabel
                className={`text-sm font-medium ${field.state.meta.errors.length > 0 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                Total Student Count *
              </FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min='1'
                  placeholder='Enter total number of students'
                  value={field.state.value || ''}
                  onChange={(e) =>
                    field.handleChange(parseInt(e.target.value) || 0)
                  }
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

        <div className='space-y-4'>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Departments *
          </label>
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <Input
                placeholder='Enter department name'
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                onKeyPress={handleKeyPress}
                className='rounded-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={addDepartment}
                disabled={!newDepartment.trim()}
                className='rounded-lg border-gray-300 hover:bg-gray-50'>
                <PlusIcon size={16} />
              </Button>
            </div>

            <form.AppField name='departments'>
              {(field: any) => (
                <div className='flex flex-wrap gap-2'>
                  {field.state.value.map(
                    (department: string, index: number) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className='flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                        {department}
                        <button
                          type='button'
                          onClick={() => removeDepartment(department)}
                          className='ml-1 hover:text-red-600 transition-colors'>
                          <XIcon size={12} />
                        </button>
                      </Badge>
                    )
                  )}
                  {field.state.value.length === 0 && (
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      No departments added yet
                    </p>
                  )}
                </div>
              )}
            </form.AppField>
          </div>
        </div>
      </div>

      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
        <h4 className='text-sm font-medium mb-2 text-blue-900 dark:text-blue-100'>
          Information Guidelines
        </h4>
        <ul className='text-xs text-blue-800 dark:text-blue-200 space-y-1'>
          <li>
            • Accreditation information helps verify your institution's
            credentials
          </li>
          <li>
            • List all major academic departments or schools within your college
          </li>
          <li>• Student count should reflect current enrollment numbers</li>
        </ul>
      </div>
    </div>
  )
}
