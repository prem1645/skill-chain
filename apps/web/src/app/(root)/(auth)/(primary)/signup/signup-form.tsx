'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { RayLogoWithText } from '@/components/icons/logo'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import { useAppForm } from '@/hooks/use-tanstack-form'
import { authClient } from '@/lib/auth-client'

const signupValidatorSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(32, { message: 'Password can be at most 32 characters' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one symbol (e.g., !@#$%^&*)',
    }),
})

type SignupFormData = z.infer<typeof signupValidatorSchema>

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { isPending } = authClient.useSession()
  const router = useRouter()

  const { mutate: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: async (signupFormValues: SignupFormData) => {
      const { data, error } = await authClient.signUp.email({
        email: signupFormValues.email,
        password: signupFormValues.password,
        name: '',
      })

      if (error) {
        throw new Error(error.message || 'Failed to sign up')
      }

      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Sign up successful')
      router.push('/')
    },
  })

  const signupForm = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    } as SignupFormData,
    validators: {
      onBlur: signupValidatorSchema,
    },
    onSubmit: async ({ value }) => {
      signUp(value)
    },
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === 'Enter' &&
      !isSignUpPending &&
      (e.target as HTMLElement).nodeName !== 'BUTTON'
    ) {
      signupForm.handleSubmit()
    }
  }

  return (
    <main className='relative flex min-h-screen flex-col justify-center p-4'>
      <>
        <div className='mx-auto space-y-4 sm:w-sm'>
          <div className='flex items-center gap-2 lg:hidden'>
            <RayLogoWithText width={90} />
          </div>

          <div className='flex flex-col space-y-2'>
            <h1 className='text-2xl font-bold'>Create your account</h1>
            <p className='text-secondary-foreground text-sm'>
              Fill in your details to get started
            </p>
            <p className='text-secondary-foreground text-sm'>
              This is signup is only for the college administrators
            </p>
          </div>

          <signupForm.AppForm>
            <Form className='space-y-6' onKeyDown={handleKeyDown}>
              <div className='space-y-2'>
                <signupForm.AppField name='email'>
                  {(field) => (
                    <FormItem>
                      <FormLabel>College Email</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Enter your college email'
                          autoComplete='email'
                          className='bg-card'
                          disabled={isPending || isSignUpPending}
                          tabIndex={1}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                </signupForm.AppField>
              </div>

              <div className='space-y-0.5'>
                <signupForm.AppField name='password'>
                  {(field) => (
                    <FormItem>
                      <div className='flex items-center justify-between'>
                        <FormLabel>Password</FormLabel>
                      </div>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter your password'
                            autoComplete='new-password'
                            disabled={isPending || isSignUpPending}
                            className='pr-10 bg-card'
                            tabIndex={2}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                          <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isPending || isSignUpPending}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer'
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                            tabIndex={3}>
                            {showPassword ? (
                              <EyeIcon size={16} strokeWidth={2} />
                            ) : (
                              <EyeOffIcon size={16} strokeWidth={2} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                </signupForm.AppField>
              </div>

              <signupForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type='submit'
                    size='lg'
                    className='w-full font-semibold'
                    disabled={!canSubmit || isSignUpPending || isSubmitting}
                    tabIndex={4}>
                    {isSignUpPending || isSubmitting ? (
                      <div className='flex items-center justify-center gap-2'>
                        <Loader size='sm' className='fill-primary-foreground' />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      'Create account'
                    )}
                  </Button>
                )}
              </signupForm.Subscribe>
            </Form>
          </signupForm.AppForm>

          <AuthSeparator />

          <div className='flex items-center'>
            <p className='w-fit text-sm text-secondary-foreground mr-2'>
              Already have an account?
            </p>
            <Link
              href='/login'
              className='text-foreground underline text-sm font-semibold  p-0 underline-offset-4 hover:underline cursor-pointer'>
              Login
            </Link>
          </div>

          <p className='text-muted-foreground mt-8 text-sm'>
            By clicking create account, you agree to our{' '}
            <Link
              href='#'
              className='hover:text-primary underline underline-offset-4 cursor-pointer'
              tabIndex={5}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='#'
              className='hover:text-primary underline underline-offset-4 cursor-pointer'
              tabIndex={6}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </>
    </main>
  )
}

const AuthSeparator = () => {
  return (
    <div className='flex w-full items-center justify-center'>
      <div className='bg-border h-px w-full' />
      <span className='text-secondary-foreground px-2 text-xs'>OR</span>
      <div className='bg-border h-px w-full' />
    </div>
  )
}
