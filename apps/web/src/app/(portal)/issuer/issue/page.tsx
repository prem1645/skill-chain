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

  const handleSubmit = (e: React.FormEvent) => {
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
      // Simulate network delay for 'minting'
      setTimeout(() => {
        const newCert = mintCertificate(formData)
        setStatus({
          message: `Certificate successfully minted! Hash: ${newCert.transactionHash.slice(0, 10)}...`,
          isError: false,
        })
        setIsMinting(false)
        // Optional: Redirect back to dashboard after a delay
        setTimeout(() => router.push('/issuer'), 3000)
      }, 1500)
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
    <div className='p-8 max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Certificate Issuance Form 📝</h1>

      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-xl'>
        <FormInput
          label='Learner Full Name'
          name='learnerName'
          value={formData.learnerName}
          onChange={handleChange}
          required
          error={errors.learnerName ?? null}
        />
        <FormInput
          label='Course Name'
          name='course'
          value={formData.course}
          onChange={handleChange}
          required
          error={errors.course ?? null}
        />
        <FormInput
          label='Roll Number / Learner ID'
          name='rollNo'
          value={formData.rollNo}
          onChange={handleChange}
          required
          error={errors.rollNo ?? null}
        />
        <FormInput
          label='Completion Date'
          name='completionDate'
          type='date'
          value={formData.completionDate}
          onChange={handleChange}
          required
          error={errors.completionDate ?? null}
        />

        <button
          type='submit'
          disabled={isMinting}
          className={`w-full py-3 mt-6 text-white font-semibold rounded-lg transition duration-200 
            ${isMinting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
          {isMinting
            ? 'Generating & Minting on Blockchain...'
            : 'Generate & Mint Certificate'}
        </button>

        {status && (
          <div
            className={`p-4 mt-4 rounded-lg text-sm ${status.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  )
}

export default CertificateIssuancePage
