// web/src/app/(portal)/learner/page.tsx
'use client'

import { useEffect, useState } from 'react'

import { useAuth } from '@/components/providers/auth-context'
import {
  Certificate,
  getCertificateByHashOrId,
  mockLearner,
  mockLearnerLogin,
} from '@/lib/blockchainService'

// Extended type for certificate listing
interface LearnerCertificate extends Certificate {
  issuer: string
}

const LearnerPortal = () => {
  const { isLoggedIn, learnerId, loginLearner } = useAuth()
  const [localId, setLocalId] = useState('')
  const [certificates, setCertificates] = useState<LearnerCertificate[]>([])

  useEffect(() => {
    if (isLoggedIn) {
      // Simulate fetching certificates by Learner ID
      const fetchedCerts = mockLearner.certificates
        .map((mockCert) => {
          const fullCert = getCertificateByHashOrId(mockCert.id)
          return { ...fullCert, ...mockCert } as LearnerCertificate
        })
        .filter((c) => c.id) // Filter out any that weren't "minted"

      setCertificates(fetchedCerts)
    }
  }, [isLoggedIn])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = mockLearnerLogin(localId)
    if (user) {
      loginLearner(user.id)
    } else {
      alert('Invalid Learner ID. Try LID007.')
    }
  }

  if (!isLoggedIn) {
    return (
      <MockLogin
        handleLogin={handleLogin}
        setLearnerId={setLocalId}
        learnerId={localId}
      />
    )
  }

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>
        Welcome, {mockLearner.name}! 👋
      </h1>
      <p className='text-xl font-semibold text-gray-700 mb-8'>
        My Skill Credentials
      </p>

      <div className='space-y-6'>
        {certificates.length > 0 ? (
          certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))
        ) : (
          <div className='text-center p-10 border border-gray-200 rounded-lg'>
            <p className='text-lg text-gray-500'>
              You don't have any certificates yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Components (could be moved to /components) ---

const MockLogin = ({ handleLogin, setLearnerId, learnerId }: any) => (
  <div className='flex items-center justify-center min-h-[400px] p-4'>
    <form
      onSubmit={handleLogin}
      className='bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center'>
      <h2 className='text-2xl font-bold mb-4'>Learner Portal Login 🔑</h2>
      <p className='text-sm text-gray-500 mb-6'>
        Use ID: <span className='font-mono font-bold'>LID007</span>
      </p>
      <input
        type='text'
        placeholder='Enter Learner ID'
        value={learnerId}
        onChange={(e) => setLearnerId(e.target.value)}
        required
        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4'
      />
      <button
        type='submit'
        className='w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition'>
        Login
      </button>
    </form>
  </div>
)

const CertificateCard = ({
  certificate,
}: {
  certificate: LearnerCertificate
}) => {
  // Mock functions
  const onView = () =>
    alert(`Viewing secured certificate for ${certificate.course}.`)
  const onDownload = () => alert(`Downloading PDF for ${certificate.course}.`)
  const onDigiLocker = () =>
    alert(`Mock API integration: Linking ${certificate.id} to DigiLocker.`)

  return (
    <div className='bg-white p-6 rounded-xl shadow-lg border-l-8 border-indigo-500 flex justify-between items-center'>
      <div>
        <p className='text-xl font-bold text-gray-900'>{certificate.course}</p>
        <p className='text-sm text-gray-600 mt-1'>
          Issued by: {certificate.issuer}
        </p>
        <p className='text-xs text-gray-400'>
          ID: <span className='font-mono'>{certificate.id}</span>
        </p>
      </div>
      <div className='flex space-x-3'>
        <ActionButton label='View' onClick={onView} color='bg-blue-500' />
        <ActionButton
          label='Download (PDF)'
          onClick={onDownload}
          color='bg-green-500'
        />
        <ActionButton
          label='Link to DigiLocker'
          onClick={onDigiLocker}
          color='bg-yellow-500'
        />
      </div>
    </div>
  )
}

const ActionButton = ({
  label,
  onClick,
  color,
}: {
  label: string
  onClick: () => void
  color: string
}) => (
  <button
    onClick={onClick}
    className={`text-white text-sm font-medium py-2 px-4 rounded transition duration-150 ${color} hover:opacity-90 whitespace-nowrap`}>
    {label}
  </button>
)

export default LearnerPortal
