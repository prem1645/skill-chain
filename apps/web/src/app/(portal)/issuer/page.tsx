// web/src/app/(portal)/issuer/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { StatCard } from '@/components/ui/stat-card'
import type { Certificate } from '@/lib/blockchainService'
import { getIssuedCertificates } from '@/lib/blockchainService'

const IssuerDashboard = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const certs = await getIssuedCertificates()
        setCertificates(certs)
      } catch (error) {
        console.error('Failed to fetch certificates:', error)
        // Optionally set an error state here
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  const { issuedToday, totalIssued } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const issuedTodayCount = certificates.filter((c) =>
      c.timestamp.toISOString().startsWith(today)
    ).length
    return { issuedToday: issuedTodayCount, totalIssued: certificates.length }
  }, [certificates])

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>
              NCVET Issuing Authority Dashboard
            </h1>
            <p className='text-blue-100 text-lg'>
              Manage and issue blockchain-backed skill certificates
            </p>
          </div>
          <Link
            href='/issuer/issue'
            className='bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl flex items-center gap-2'>
            <span className='text-xl'>+</span>
            Issue New Certificate
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <StatCard 
          title='Certificates Issued Today' 
          value={issuedToday} 
          icon='📅'
          color='blue'
        />
        <StatCard 
          title='Total Certificates Issued' 
          value={totalIssued} 
          icon='📜'
          color='green'
        />
        <StatCard 
          title='Active Certificates' 
          value={certificates.filter(c => c.transactionHash).length} 
          icon='✅'
          color='purple'
        />
      </div>

      {/* Certificate Log */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='p-6 border-b border-gray-100'>
          <h2 className='text-2xl font-semibold text-gray-900'>Certificate Registry</h2>
          <p className='text-gray-600 mt-1'>All issued certificates with blockchain verification</p>
        </div>
        <IssuedCertificateLog data={certificates} isLoading={isLoading} />
      </div>
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
  <div className='overflow-x-auto'>
    {isLoading ? (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-gray-600'>Loading certificates...</span>
      </div>
    ) : data.length === 0 ? (
      <div className='text-center py-12'>
        <div className='text-6xl mb-4'>📜</div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>No certificates issued yet</h3>
        <p className='text-gray-500'>Start by issuing your first certificate to see it here.</p>
      </div>
    ) : (
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Learner
            </th>
            <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Course
            </th>
            <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Certificate ID
            </th>
            <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Blockchain Hash
            </th>
            <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Status
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((cert) => (
            <tr key={cert.id} className='hover:bg-gray-50 transition-colors'>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                    <span className='text-blue-600 font-medium text-sm'>
                      {cert.learnerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className='text-sm font-medium text-gray-900'>{cert.learnerName}</div>
                    <div className='text-sm text-gray-500'>{cert.rollNo}</div>
                  </div>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm font-medium text-gray-900'>{cert.course}</div>
                <div className='text-sm text-gray-500'>Completed: {cert.completionDate}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                  {cert.id}
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded'>
                  {cert.transactionHash.slice(0, 12)}...
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  cert.transactionHash && cert.transactionHash !== `0x${'0'.repeat(64)}`
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {cert.transactionHash && cert.transactionHash !== `0x${'0'.repeat(64)}`
                    ? '✅ Verified'
                    : '⏳ Pending'
                  }
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)

export default IssuerDashboard
