import Link from 'next/link'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='border-b bg-white'>
        <div className='mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <Link href='/' className='text-xl font-bold'>
            Skill Chain
          </Link>
          <nav className='flex items-center gap-4 text-sm'>
            <Link href='/issuer' className='hover:text-blue-600'>
              Issuer
            </Link>
            <Link href='/learner' className='hover:text-blue-600'>
              Learner
            </Link>
            <Link href='/verify' className='hover:text-blue-600'>
              Verify
            </Link>
          </nav>
        </div>
      </header>
      <main className='mx-auto max-w-6xl px-4 py-8'>{children}</main>
    </div>
  )
}
