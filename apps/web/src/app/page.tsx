// web/src/app/page.tsx
import Link from 'next/link'

import { getIssuedCertificates } from '@/lib/blockchainService'

const LandingPage = () => {
  const totalCertificates = getIssuedCertificates().length

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center pt-20'>
      <header className='text-center max-w-4xl mx-auto px-4'>
        <h1 className='text-5xl font-extrabold text-gray-900 mb-4'>
          Secure, Verifiable Skill Credentials 🎓
        </h1>
        <h2 className='text-3xl font-semibold text-blue-600 mb-6'>
          Powered by Blockchain Technology
        </h2>
        <p className='text-xl text-gray-600 mb-10'>
          Our platform eliminates fraud by minting every skill certificate as an
          immutable record on a decentralised ledger, providing instant,
          tamper-proof verification for learners, employers, and institutions.
        </p>

        <div className='flex justify-center space-x-6'>
          <Link
            href='/verify'
            className='bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105'>
            Verify a Certificate
          </Link>
          <Link
            href='/learner'
            className='bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105'>
            Learner Portal
          </Link>
        </div>
      </header>

      <section className='mt-20 w-full max-w-5xl px-4'>
        <h3 className='text-2xl font-bold text-gray-800 text-center mb-8'>
          Key Value Propositions
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          <ValueCard
            title='Immutability'
            description='Certificates cannot be altered or deleted once recorded.'
            emoji='🔒'
          />
          <ValueCard
            title='Instant Verification'
            description='Verify authenticity in seconds without contacting the issuer.'
            emoji='⏱️'
          />
          <ValueCard
            title='Global Trust'
            description='A unified, transparent record system trusted worldwide.'
            emoji='🌎'
          />
        </div>
      </section>

      <section className='mt-16 mb-20 p-6 bg-white rounded-xl shadow-2xl text-center'>
        <p className='text-2xl font-bold text-gray-800'>
          Total Certificates Minted:{' '}
          <span className='text-4xl text-blue-600 ml-2'>
            {totalCertificates}
          </span>
        </p>
      </section>

      <footer className='w-full bg-gray-800 text-white text-center py-4'>
        <div className='max-w-7xl mx-auto text-sm'>
          &copy; {new Date().getFullYear()} VeriCert Platform.
          <Link href='/issuer' className='ml-4 underline hover:text-blue-400'>
            Issuer Login
          </Link>
        </div>
      </footer>
    </div>
  )
}

// --- Component (could be moved to /components) ---

const ValueCard = ({
  title,
  description,
  emoji,
}: {
  title: string
  description: string
  emoji: string
}) => (
  <div className='p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300'>
    <div className='text-4xl mb-4'>{emoji}</div>
    <h4 className='text-xl font-semibold text-gray-900 mb-2'>{title}</h4>
    <p className='text-gray-500 text-sm'>{description}</p>
  </div>
)

export default LandingPage
