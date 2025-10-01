// web/src/app/(portal)/issuer/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { StatCard } from '@/components/ui/stat-card'
import { Certificate, getIssuedCertificates } from '@/lib/blockchainService'

const IssuerDashboard = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // mimic async fetch to avoid hydration mismatch
    const id = setTimeout(() => {
      setCertificates(getIssuedCertificates())
      setIsLoading(false)
    }, 0)
    return () => clearTimeout(id)
  }, [])

  const { issuedToday, totalIssued } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const issuedTodayCount = certificates.filter((c) =>
      c.timestamp.toISOString().startsWith(today)
    ).length
    return { issuedToday: issuedTodayCount, totalIssued: certificates.length }
  }, [certificates])

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-6'>
        NCVET Issuing Authority Dashboard 🏛️
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <StatCard title='Certificates Issued Today' value={issuedToday} />
        <StatCard title='Total Certificates Issued' value={totalIssued} />
      </div>

      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold'>Actions</h2>
        <Link
          href='/issuer/issue'
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150'>
          + Issue New Certificate
        </Link>
      </div>

      <IssuedCertificateLog data={certificates} isLoading={isLoading} />
    </div>
  )
}

const IssuedCertificateLog = ({
  data,
  isLoading,
}: {
  data: Certificate[]
  isLoading: boolean
}) => (
  <div className='bg-white p-6 rounded-lg shadow-lg overflow-x-auto'>
    <h3 className='text-xl font-semibold mb-4'>Issued Certificate Log</h3>
    {isLoading ? (
      <div className='text-gray-500 text-sm'>Loading...</div>
    ) : data.length === 0 ? (
      <div className='text-gray-500 text-sm'>No certificates issued yet.</div>
    ) : (
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Learner Name
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Course
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Cert ID
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Transaction Hash
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((cert) => (
            <tr key={cert.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {cert.learnerName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {cert.course}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-mono'>
                {cert.id}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-green-600 font-mono'>
                {cert.transactionHash.slice(0, 10)}...
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)

export default IssuerDashboard
