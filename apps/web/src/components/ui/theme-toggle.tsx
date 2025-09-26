'use client'

import { useEffect, useState } from 'react'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={cn('w-16 h-8', className)} />
  }
  const isDark = resolvedTheme === 'dark'

  return (
    <div
      className={cn(
        'flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300',
        isDark
          ? 'bg-zinc-950 border border-zinc-800'
          : 'bg-white border border-zinc-200',
        className
      )}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      role='button'
      tabIndex={0}>
      <div className='flex justify-between items-center w-full'>
        <div
          className={cn(
            'flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300',
            isDark
              ? 'transform translate-x-0 bg-zinc-800'
              : 'transform translate-x-8 bg-zinc-200'
          )}>
          {isDark ? (
            <MoonIcon
              size={16}
              color='currentColor'
              strokeWidth={2.25}
              className='fill-current/30'
            />
          ) : (
            <SunIcon
              size={16}
              color='currentColor'
              strokeWidth={2.25}
              className='fill-current/30'
            />
          )}
        </div>
        <div
          className={cn(
            'flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300',
            isDark ? 'bg-transparent' : 'transform -translate-x-8'
          )}>
          {isDark ? (
            <SunIcon size={16} color='currentColor' strokeWidth={2.25} />
          ) : (
            <MoonIcon size={16} color='currentColor' strokeWidth={2.25} />
          )}
        </div>
      </div>
    </div>
  )
}
