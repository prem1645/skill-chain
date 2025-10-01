import type { Metadata, Viewport } from 'next'

import Providers from '@/components/providers/providers'
import { Satoshi } from '@/lib/fonts'

import './globals.css'

export const metadata: Metadata = {
  title: 'Skill Chain',
  description: 'Skill Chain',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${Satoshi.variable} font-medium tracking-[.1px] antialiased`}>
        <Providers>
          <div className='grid grid-rows-[auto_1fr] h-svh'>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
