import Link from 'next/link'

import { NotFoundIcon } from '@/components/icons/app'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function NotFound() {
  return (
    <>
      <div className='absolute top-8 right-8'>
        <ThemeToggle />
      </div>
      <div className='flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden'>
        <div className='mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]'>
          <h1 className='mb-8 font-bold text-gray-800 text-2xl dark:text-white/90 xl:text-4xl'>
            ERROR
          </h1>
          <NotFoundIcon className='mx-auto mb-8 w-full max-w-[242px] sm:max-w-[472px]' />
          <p className='mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg'>
            We can’t seem to find the page you are looking for!
          </p>
          <Link
            className='inline-flex items-center justify-center rounded-lg border border-secondary/30 bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-theme-xs hover:bg-primary/90'
            href='/'>
            Back to Home Page
          </Link>
        </div>
      </div>
      <p className='absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400'>
        {new Date().getFullYear()} - Ray
      </p>
    </>
  )
}
