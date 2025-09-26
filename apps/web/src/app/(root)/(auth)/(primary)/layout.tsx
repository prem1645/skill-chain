import Link from 'next/link'

import { RayLogoWithTextProps } from '@/components/icons/logo'
import RandomQuote from '@/components/ui/random-quote'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import WavyBackground from '@/components/ui/wavy-background'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2'>
      <WavyBackground className='h-full items-center justify-center hidden lg:flex'>
        <div className='relative hidden h-full w-full flex-col border-r p-10 lg:flex'>
          <div className='z-10 flex items-center gap-2'>
            <Link href='/' className='z-10 flex items-center gap-2'>
              <RayLogoWithTextProps width={80} color='#ffffff' />
            </Link>
          </div>
          <div className='z-10 mt-auto mb-auto'>
            <RandomQuote />
          </div>
        </div>
      </WavyBackground>
      <div>
        <div className='absolute top-7 right-5 z-10'>
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  )
}
