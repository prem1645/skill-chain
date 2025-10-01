'use client'

import React from 'react'

interface FormInputProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  error?: string | null
}

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  error = null,
}: FormInputProps) {
  return (
    <div className='mb-4'>
      <label
        htmlFor={name}
        className='block text-sm font-medium text-gray-700 mb-1'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && (
        <p id={`${name}-error`} className='mt-1 text-xs text-red-600'>
          {error}
        </p>
      )}
    </div>
  )
}
