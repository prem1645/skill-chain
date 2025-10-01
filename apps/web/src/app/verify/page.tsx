// web/src/app/verify/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Certificate, getCertificateByHashOrId } from '@/lib/blockchainService'

const VerificationPortal = () => {
  const [identifier, setIdentifier] = useState('')
  const [result, setResult] = useState<Certificate | null | undefined>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return

    setIsLoading(true)
    setResult(undefined) // Clear previous result

    // Simulate blockchain lookup delay
    setTimeout(() => {
      const certificate = getCertificateByHashOrId(identifier.trim())
      setResult(certificate)
      setIsLoading(false)
    }, 1000)
  }

  // Simulating QR Code Scan (just pre-populates the field)
  const handleQRScan = () => {
    setIdentifier('CERT-1001') // Mock an ID from a QR code scan
    handleVerify({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className='p-8 max-w-xl mx-auto text-center'>
      <h1 className='text-3xl font-bold text-gray-800 mb-4'>
        Certificate Verification Portal 🛡️
      </h1>
      <p className='text-gray-500 mb-8'>
        Enter the Certificate ID or Transaction Hash to verify its authenticity
        on the blockchain.
      </p>

      <form onSubmit={handleVerify} className='flex flex-col gap-4 mb-8'>
        <input
          type='text'
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder='Enter Certificate ID or Transaction Hash'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg'
        />
        <div className='flex gap-4'>
          <button
            type='submit'
            disabled={isLoading || !identifier.trim()}
            className='flex-1 py-3 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 disabled:bg-gray-400'>
            {isLoading ? 'Verifying...' : 'Verify Certificate'}
          </button>
          <button
            type='button'
            onClick={handleQRScan}
            className='py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition duration-200'>
            QR Code Scan 📷 (Mock)
          </button>
        </div>
      </form>

      {/* Verification Result Page (Integrated) */}
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
      <div className='bg-green-50 border-l-4 border-green-500 p-6 rounded-lg text-left shadow-lg'>
        <h2 className='text-3xl font-extrabold text-green-700 mb-4'>
          ✅ VERIFIED
        </h2>
        <p className='text-green-600 mb-4 font-semibold'>
          Immutable Proof Found on Blockchain
        </p>

        <div className='grid grid-cols-2 gap-y-2 text-sm'>
          <Detail label='Learner Name' value={result.learnerName} />
          <Detail label='Course' value={result.course} />
          <Detail label='Completion Date' value={result.completionDate} />
          <Detail label='Certificate ID' value={result.id} isMono />
          <Detail
            label='Blockchain Hash'
            value={result.transactionHash}
            isMono
            isHash
          />
          <Detail
            label='Issued On'
            value={new Date(result.timestamp).toLocaleDateString()}
          />
        </div>
      </div>
    )
  } else {
    // FAILURE: Show INVALID CERTIFICATE message.
    return (
      <div className='bg-red-50 border-l-4 border-red-500 p-6 rounded-lg text-left shadow-lg'>
        <h2 className='text-3xl font-extrabold text-red-700 mb-4'>
          ❌ INVALID CERTIFICATE
        </h2>
        <p className='text-red-600 font-semibold'>
          Hash Mismatch/Not Found on the Blockchain Ledger.
        </p>
        <p className='mt-2 text-sm text-red-500'>
          Please check the ID or Hash and try again.
        </p>
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
  <>
    <span className='font-medium text-gray-600'>{label}:</span>
    <span
      className={`text-gray-800 ${isMono ? 'font-mono text-xs break-all' : ''}`}>
      {isHash ? `${value.slice(0, 12)}...${value.slice(-8)}` : value}
    </span>
  </>
)

export default VerificationPortal
