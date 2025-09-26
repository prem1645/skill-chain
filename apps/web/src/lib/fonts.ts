import localFont from 'next/font/local'

export const Satoshi = localFont({
  variable: '--font-satoshi',
  src: [
    {
      path: '../../public/fonts/Satoshi-Variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-VariableItalic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  display: 'swap',
})
