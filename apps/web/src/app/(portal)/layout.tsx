import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function NavigationLink({ href, children, currentPath }: { href: string; children: React.ReactNode; currentPath: string }) {
  const isActive = currentPath.startsWith(href)
  
  return (
    <Button 
      asChild 
      variant={isActive ? "default" : "ghost"}
      className={`${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'}`}
    >
      <Link href={href}>
        {children}
      </Link>
    </Button>
  )
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
      <header className='border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50'>
        <div className='mx-auto max-w-7xl px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link href='/' className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>SC</span>
                </div>
                <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                  Skill Chain
                </span>
              </Link>
              <Badge variant="secondary" className='hidden sm:inline-flex'>
                NCVET Portal
              </Badge>
            </div>
            
            <nav className='flex items-center gap-2'>
              <NavigationLink href='/issuer' currentPath={pathname}>
                🏛️ Issuer
              </NavigationLink>
              <NavigationLink href='/learner' currentPath={pathname}>
                👨‍🎓 Learner
              </NavigationLink>
              <NavigationLink href='/verify' currentPath={pathname}>
                🔍 Verify
              </NavigationLink>
              <Button asChild variant="outline" size="sm">
                <Link href='/'>
                  🏠 Home
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className='mx-auto max-w-7xl px-4 py-8'>
        <div className='min-h-[calc(100vh-8rem)]'>
          {children}
        </div>
      </main>
      
      <footer className='border-t bg-white/80 backdrop-blur-sm mt-16'>
        <div className='mx-auto max-w-7xl px-4 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='text-sm text-gray-600'>
              © 2024 Skill Chain. Built with blockchain technology for secure skill certification.
            </div>
            <div className='flex items-center gap-4 text-sm text-gray-500'>
              <span>Powered by Polygon</span>
              <span>•</span>
              <span>NSQF Compliant</span>
              <span>•</span>
              <span>DigiLocker Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
