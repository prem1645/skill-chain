// web/src/app/(portal)/learner/page.tsx
'use client'

import { useEffect, useState } from 'react'

import { useAuth } from '@/components/providers/auth-context'
import type { Certificate } from '@/lib/blockchainService'
import { getIssuedCertificates, mockLearnerLogin } from '@/lib/blockchainService'

// Extended type for certificate listing
interface LearnerCertificate extends Certificate {
  issuer: string
}

const LearnerPortal = () => {
  const { isLoggedIn, learnerId, loginLearner } = useAuth()
  const [localId, setLocalId] = useState('')
  const [certificates, setCertificates] = useState<LearnerCertificate[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchLearnerCertificates = async () => {
      if (isLoggedIn && learnerId) {
        setIsLoading(true)
        try {
          const allCerts = await getIssuedCertificates()
          // Filter certificates by learnerId (assuming rollNo is the learner ID)
          const learnerCerts = allCerts.filter(cert => cert.rollNo === learnerId)
          setCertificates(learnerCerts as LearnerCertificate[])
        } catch (error) {
          console.error('Failed to fetch certificates:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchLearnerCertificates()
  }, [isLoggedIn, learnerId])

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
    <div className='space-y-8'>
      {/* Header */}
      <div className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white'>
        <h1 className='text-4xl font-bold mb-2'>
          Welcome, Learner! 👋
        </h1>
        <p className='text-indigo-100 text-lg'>
          View and manage your blockchain-verified skill certificates
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Certificates</p>
              <p className='text-3xl font-bold text-gray-900'>{certificates.length}</p>
            </div>
            <div className='text-3xl'>📜</div>
          </div>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Verified Certificates</p>
              <p className='text-3xl font-bold text-gray-900'>
                {certificates.filter(c => c.transactionHash && c.transactionHash !== `0x${'0'.repeat(64)}`).length}
              </p>
            </div>
            <div className='text-3xl'>✅</div>
          </div>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Skills Earned</p>
              <p className='text-3xl font-bold text-gray-900'>{new Set(certificates.map(c => c.course)).size}</p>
            </div>
            <div className='text-3xl'>🎯</div>
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='p-6 border-b border-gray-100'>
          <h2 className='text-2xl font-semibold text-gray-900'>My Certificates</h2>
          <p className='text-gray-600 mt-1'>Your verified skill credentials</p>
        </div>
        
        <div className='p-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
              <span className='ml-3 text-gray-600'>Loading your certificates...</span>
            </div>
          ) : certificates.length > 0 ? (
            <div className='grid gap-6'>
              {certificates.map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>🎓</div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>No certificates yet</h3>
              <p className='text-gray-500 mb-6'>
                Your certificates will appear here once they are issued by an authorized institution.
              </p>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto'>
                <p className='text-blue-700 text-sm'>
                  💡 <strong>Tip:</strong> Make sure your institution has issued certificates for your completed courses.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Components (could be moved to /components) ---

const MockLogin = ({ handleLogin, setLearnerId, learnerId }: any) => (
  <div className='flex items-center justify-center min-h-[60vh] p-4'>
    <div className='bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md'>
      <div className='text-center mb-8'>
        <div className='w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
          <span className='text-white text-2xl'>👨‍🎓</span>
        </div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Learner Portal</h2>
        <p className='text-gray-600'>Access your skill certificates</p>
      </div>
      
      <form onSubmit={handleLogin} className='space-y-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Learner ID
          </label>
          <input
            type='text'
            placeholder='Enter your Learner ID'
            value={learnerId}
            onChange={(e) => setLearnerId(e.target.value)}
            required
            className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors'
          />
        </div>
        
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <p className='text-blue-700 text-sm'>
            <strong>Demo:</strong> Use <span className='font-mono bg-blue-100 px-1 rounded'>LID007</span> to access sample certificates
          </p>
        </div>
        
        <button
          type='submit'
          className='w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg hover:shadow-xl'>
          Access My Certificates
        </button>
      </form>
    </div>
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

  const isVerified = certificate.transactionHash && certificate.transactionHash !== `0x${'0'.repeat(64)}`

  return (
    <div className='bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden'>
      <div className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>📜</span>
              </div>
              <div>
                <h3 className='text-xl font-bold text-gray-900'>{certificate.course}</h3>
                <p className='text-sm text-gray-600'>
                  Issued by: {certificate.issuer || 'NCVET Authority'}
                </p>
              </div>
            </div>
            
            <div className='grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4'>
              <div>
                <span className='font-medium'>Certificate ID:</span>
                <div className='font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1'>
                  {certificate.id}
                </div>
              </div>
              <div>
                <span className='font-medium'>Completed:</span>
                <div className='mt-1'>{certificate.completionDate}</div>
              </div>
            </div>
            
            <div className='flex items-center gap-2 mb-4'>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isVerified ? '✅ Blockchain Verified' : '⏳ Pending Verification'}
              </span>
              {certificate.ipfsCid && (
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                  🌐 IPFS Stored
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className='flex flex-wrap gap-2'>
          <ActionButton 
            label='👁️ View' 
            onClick={onView} 
            color='bg-blue-500 hover:bg-blue-600' 
          />
          <ActionButton
            label='📥 Download PDF'
            onClick={onDownload}
            color='bg-green-500 hover:bg-green-600'
          />
          <ActionButton
            label='🔗 Link to DigiLocker'
            onClick={onDigiLocker}
            color='bg-yellow-500 hover:bg-yellow-600'
          />
        </div>
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
    className={`text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200 ${color} shadow-sm hover:shadow-md whitespace-nowrap`}>
    {label}
  </button>
)

export default LearnerPortal
