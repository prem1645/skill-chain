// web/src/app/(portal)/issuer/issue/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { FormInput } from '@/components/ui/form-input'
import { mintCertificate } from '@/lib/blockchainService'

const CertificateIssuancePage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    learnerName: '',
    course: '',
    rollNo: '',
    completionDate: '',
  })
  const [isMinting, setIsMinting] = useState(false)
  const [status, setStatus] = useState<{
    message: string
    isError: boolean
  } | null>(null)
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    // basic validation
    const newErrors: Record<string, string | null> = {}
    if (!formData.learnerName.trim())
      newErrors.learnerName = 'Learner name is required'
    if (!formData.course.trim()) newErrors.course = 'Course name is required'
    if (!formData.rollNo.trim()) newErrors.rollNo = 'Roll number is required'
    if (!formData.completionDate)
      newErrors.completionDate = 'Completion date is required'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsMinting(true)

    try {
      const newCert = await mintCertificate(formData)
      setStatus({
        message: `Certificate successfully minted! Hash: ${newCert.transactionHash.slice(0, 10)}...`,
        isError: false,
      })
      setIsMinting(false)
      // Optional: Redirect back to dashboard after a delay
      setTimeout(() => router.push('/issuer'), 3000)
    } catch (error) {
      console.error(error)
      setIsMinting(false)
      setStatus({
        message: 'Error minting certificate. Please try again.',
        isError: true,
      })
    }
  }

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* Header */}
      <div className='bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white'>
        <h1 className='text-4xl font-bold mb-2'>Certificate Issuance Form</h1>
        <p className='text-green-100 text-lg'>
          Create and mint blockchain-backed skill certificates for learners
        </p>
      </div>

      {/* Form */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='p-6 border-b border-gray-100'>
          <h2 className='text-2xl font-semibold text-gray-900'>Certificate Details</h2>
          <p className='text-gray-600 mt-1'>Fill in the learner and course information below</p>
        </div>
        
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <FormInput
              label='Learner Full Name'
              name='learnerName'
              value={formData.learnerName}
              onChange={handleChange}
              required
              error={errors.learnerName ?? null}
              placeholder='Enter learner\'s full name'
            />
            <FormInput
              label='Roll Number / Learner ID'
              name='rollNo'
              value={formData.rollNo}
              onChange={handleChange}
              required
              error={errors.rollNo ?? null}
              placeholder='e.g., LID007'
            />
          </div>
          
          <FormInput
            label='Course Name'
            name='course'
            value={formData.course}
            onChange={handleChange}
            required
            error={errors.course ?? null}
            placeholder='e.g., Digital Marketing Fundamentals'
          />
          
          <FormInput
            label='Course Completion Date'
            name='completionDate'
            type='date'
            value={formData.completionDate}
            onChange={handleChange}
            required
            error={errors.completionDate ?? null}
          />

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <div className='flex items-start gap-3'>
              <div className='text-blue-600 text-xl'>ℹ️</div>
              <div>
                <h3 className='font-medium text-blue-900 mb-1'>Important Notice</h3>
                <p className='text-blue-700 text-sm'>
                  Once issued, this certificate will be permanently recorded on the blockchain and cannot be modified. 
                  Please verify all information before submitting.
                </p>
              </div>
            </div>
          </div>

          <button
            type='submit'
            disabled={isMinting}
            className={`w-full py-4 text-white font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-3 ${
              isMinting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
            }`}>
            {isMinting ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                Generating & Minting Certificate...
              </>
            ) : (
              <>
                <span className='text-xl'>🚀</span>
                Generate & Mint Certificate
              </>
            )}
          </button>

          {status && (
            <div className={`p-4 rounded-lg border ${
              status.isError 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <div className='flex items-center gap-2'>
                <span className='text-xl'>{status.isError ? '❌' : '✅'}</span>
                <span className='font-medium'>{status.message}</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default CertificateIssuancePage
