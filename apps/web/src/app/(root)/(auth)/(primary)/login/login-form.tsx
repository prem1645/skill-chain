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

const loginValidatorSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(32, { message: 'Password can be at most 32 characters' }),
})

type LoginFormData = z.infer<typeof loginValidatorSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { isPending } = authClient.useSession()
  const router = useRouter()

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationFn: async (loginFormValues: LoginFormData) => {
      const { data, error } = await authClient.signIn.email({
        email: loginFormValues.email,
        password: loginFormValues.password,
      })

      if (error) {
        throw new Error(error.message || 'Failed to login')
      }

      return data
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Login successful')
      router.push('/')
    },
  })

  const loginForm = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginFormData,
    validators: {
      onSubmit: loginValidatorSchema,
    },
    onSubmit: async ({ value }) => {
      login(value)
    },
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === 'Enter' &&
      !isLoginPending &&
      (e.target as HTMLElement).nodeName !== 'BUTTON'
    ) {
      loginForm.handleSubmit()
    }
  }

  return (
    <main className='relative flex min-h-screen flex-col justify-center p-4'>
      <div className='mx-auto space-y-4 sm:w-sm'>
        <div className='flex items-center gap-2 lg:hidden'>
          <Link href='/'>
            <RayLogoWithText width={90} />
          </Link>
        </div>

        <div className='flex flex-col space-y-2'>
          <h1 className='text-2xl font-bold'>Welcome back</h1>
          <p className='text-secondary-foreground text-sm'>
            login in to your account.
          </p>
        </div>

        <loginForm.AppForm>
          <Form className='space-y-6' onKeyDown={handleKeyDown}>
            <div className='space-y-2'>
              <loginForm.AppField name='email'>
                {(field) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Enter your email'
                        autoComplete='email'
                        className='bg-card'
                        disabled={isPending || isLoginPending}
                        tabIndex={1}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              </loginForm.AppField>
            </div>

            <div className='space-y-0.5'>
              <loginForm.AppField name='password'>
                {(field) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <Link
                        href='#'
                        className='text-sm font-semibold`  text-foreground underline p-0 underline-offset-4 hover:underline'
                        tabIndex={3}>
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Enter your password'
                          autoComplete='current-password'
                          disabled={isPending || isLoginPending}
                          className='pr-10 bg-card'
                          tabIndex={2}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isPending || isLoginPending}
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer'
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          tabIndex={-1}>
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
              </loginForm.AppField>
            </div>

            <loginForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type='submit'
                  size='lg'
                  className='w-full font-semibold'
                  disabled={!canSubmit || isLoginPending || isSubmitting}
                  tabIndex={4}>
                  {isLoginPending || isSubmitting ? (
                    <div className='flex items-center justify-center gap-2'>
                      <Loader size='sm' className='fill-primary-foreground' />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              )}
            </loginForm.Subscribe>
          </Form>
        </loginForm.AppForm>

        <AuthSeparator />

        <div className='flex items-center'>
          <p className='w-fit text-sm text-secondary-foreground mr-2'>
            Don{"'"}t have an account?
          </p>
          <Link
            href='/signup'
            className='text-sm font-semibold text-foreground underline p-0 underline-offset-4 hover:underline'>
            Sign up
          </Link>
        </div>

        <p className='text-muted-foreground mt-8 text-sm'>
          By clicking sign in, you agree to our{' '}
          <Link
            href='#'
            className='hover:text-primary underline underline-offset-4'
            tabIndex={5}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href='#'
            className='hover:text-primary underline underline-offset-4'
            tabIndex={6}>
            Privacy Policy
          </Link>
          .
        </p>
      </div>
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
