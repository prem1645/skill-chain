'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { orpc } from '@/utils/orpc'

export default function Home() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions())

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center max-w-4xl mx-auto'>
          <Badge variant="secondary" className='mb-4'>
            🚀 Powered by Blockchain Technology
          </Badge>
          <h1 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6'>
            Skill Chain
          </h1>
          <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
            Revolutionizing skill certification with immutable blockchain credentials. 
            Issue, verify, and manage digital certificates with complete transparency and security.
          </p>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
            <Button asChild size="lg" className='text-lg px-8 py-6'>
              <Link href="/issuer">
                🏛️ Issuer Portal
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className='text-lg px-8 py-6'>
              <Link href="/learner">
                👨‍🎓 Learner Portal
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className='text-lg px-8 py-6'>
              <Link href="/verify">
                🔍 Verify Certificate
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid md:grid-cols-3 gap-8 mb-16'>
          <Card className='text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm'>
            <CardHeader>
              <div className='mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                <span className='text-2xl'>🔐</span>
              </div>
              <CardTitle>Immutable Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='text-base'>
                Certificates are stored on blockchain with cryptographic proof, making them tamper-proof and verifiable.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className='text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm'>
            <CardHeader>
              <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                <span className='text-2xl'>⚡</span>
              </div>
              <CardTitle>Instant Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='text-base'>
                Verify any certificate instantly using our public verification portal or QR code scanning.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className='text-center border-0 shadow-lg bg-white/70 backdrop-blur-sm'>
            <CardHeader>
              <div className='mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
                <span className='text-2xl'>🌐</span>
              </div>
              <CardTitle>Global Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className='text-base'>
                Built with NSQF compliance and ready for DigiLocker integration for government recognition.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* API Status */}
        <Card className='max-w-md mx-auto border-0 shadow-lg bg-white/70 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <div
                className={`h-3 w-3 rounded-full ${healthCheck.data ? 'bg-green-500' : 'bg-red-500'}`}
              />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              {healthCheck.isLoading
                ? 'Checking system status...'
                : healthCheck.data
                  ? '✅ All systems operational'
                  : '❌ Service temporarily unavailable'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
