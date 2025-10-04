// web/src/app/verify/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { Certificate } from '@/lib/blockchainService'
import { getCertificateById } from '@/lib/blockchainService'

const VerificationPortal = () => {
  const [identifier, setIdentifier] = useState('')
  const [result, setResult] = useState<Certificate | null | undefined>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return

    setIsLoading(true)
    setResult(undefined) // Clear previous result

    try {
      const certificate = await getCertificateById(identifier.trim())
      setResult(certificate)
    } catch (error) {
      console.error('Verification failed:', error)
      setResult(null) // Set to null to indicate failure
    } finally {
      setIsLoading(false)
    }
  }

  // Simulating QR Code Scan (just pre-populates the field)
  const handleQRScan = () => {
    setIdentifier('CERT-1001') // Mock an ID from a QR code scan
    handleVerify({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* Header */}
      <div className='bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center'>
        <h1 className='text-4xl font-bold mb-4'>
          Certificate Verification Portal 🛡️
        </h1>
        <p className='text-green-100 text-lg max-w-2xl mx-auto'>
          Verify the authenticity of any blockchain-backed skill certificate instantly. 
          Enter a Certificate ID or scan a QR code to check its validity.
        </p>
      </div>

      {/* Verification Form */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='p-6 border-b border-gray-100'>
          <h2 className='text-2xl font-semibold text-gray-900'>Verify Certificate</h2>
          <p className='text-gray-600 mt-1'>Enter certificate details to verify authenticity</p>
        </div>
        
        <form onSubmit={handleVerify} className='p-6 space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Certificate ID or Transaction Hash
            </label>
            <input
              type='text'
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder='Enter Certificate ID (e.g., CERT-1001) or Transaction Hash'
              className='w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg transition-colors'
            />
          </div>
          
          <div className='flex flex-col sm:flex-row gap-4'>
            <button
              type='submit'
              disabled={isLoading || !identifier.trim()}
              className='flex-1 py-4 text-white font-semibold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3'>
              {isLoading ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                  Verifying...
                </>
              ) : (
                <>
                  <span className='text-xl'>🔍</span>
                  Verify Certificate
                </>
              )}
            </button>
            <button
              type='button'
              onClick={handleQRScan}
              className='py-4 px-8 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2'>
              <span className='text-xl'>📷</span>
              QR Scan (Demo)
            </button>
          </div>
        </form>
      </div>

      {/* Verification Result */}
      <VerificationResult result={result} isLoading={isLoading} />
    </div>
  )
}

// --- Component (Integrated Verification Result Page) ---

const VerificationResult = ({
  result,
  isLoading,
}: {
  result: Certificate | null | undefined
  isLoading: boolean
}) => {
  if (isLoading || result === undefined) return null

  if (result) {
    // SUCCESS: Show certificate details and a big VERIFIED message.
    return (
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>✅</span>
            </div>
            <div>
              <h2 className='text-3xl font-bold'>VERIFIED</h2>
              <p className='text-green-100'>Certificate is authentic and blockchain-verified</p>
            </div>
          </div>
        </div>
        
        <div className='p-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <Detail label='Learner Name' value={result.learnerName} />
              <Detail label='Course' value={result.course} />
              <Detail label='Completion Date' value={result.completionDate} />
              <Detail label='Certificate ID' value={result.id} isMono />
            </div>
            <div className='space-y-4'>
              <Detail
                label='Blockchain Transaction'
                value={result.transactionHash}
                isMono
                isHash
              />
              <Detail
                label='Issued On'
                value={new Date(result.timestamp).toLocaleDateString()}
              />
              {result.ipfsCid && (
                <Detail label='IPFS Storage' value={result.ipfsCid} isMono />
              )}
            </div>
          </div>
          
          <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
            <div className='flex items-center gap-2 text-green-700'>
              <span className='text-xl'>🔒</span>
              <span className='font-medium'>
                This certificate has been cryptographically verified and recorded on the blockchain ledger.
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    // FAILURE: Show INVALID CERTIFICATE message.
    return (
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>❌</span>
            </div>
            <div>
              <h2 className='text-3xl font-bold'>INVALID CERTIFICATE</h2>
              <p className='text-red-100'>Certificate not found or verification failed</p>
            </div>
          </div>
        </div>
        
        <div className='p-6'>
          <div className='space-y-4'>
            <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-start gap-3'>
                <span className='text-red-600 text-xl'>⚠️</span>
                <div>
                  <h3 className='font-medium text-red-900 mb-1'>Verification Failed</h3>
                  <p className='text-red-700 text-sm'>
                    The certificate ID or transaction hash could not be found in our blockchain ledger. 
                    This could mean:
                  </p>
                  <ul className='text-red-600 text-sm mt-2 ml-4 list-disc space-y-1'>
                    <li>The certificate ID is incorrect</li>
                    <li>The certificate has not been issued yet</li>
                    <li>The certificate has been revoked</li>
                    <li>The transaction hash is invalid</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className='text-center'>
              <p className='text-gray-600 text-sm'>
                Please verify the certificate ID and try again, or contact the issuing authority for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Detail = ({
  label,
  value,
  isMono = false,
  isHash = false,
}: {
  label: string
  value: string
  isMono?: boolean
  isHash?: boolean
}) => (
  <div className='space-y-1'>
    <span className='text-sm font-medium text-gray-600'>{label}</span>
    <div className={`text-gray-900 ${isMono ? 'font-mono text-sm bg-gray-50 px-3 py-2 rounded border' : 'text-base'}`}>
      {isHash ? `${value.slice(0, 12)}...${value.slice(-8)}` : value}
    </div>
  </div>
)

export default VerificationPortal
