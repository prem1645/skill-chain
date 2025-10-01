// web/src/lib/blockchainService.ts

export interface Certificate {
  id: string
  learnerName: string
  course: string
  rollNo: string
  completionDate: string
  transactionHash: string
  timestamp: Date
}

// Simple in-memory store for issued certificates
let certificates: Certificate[] = []

/**
 * Mints a new certificate on the mock blockchain.
 */
export const mintCertificate = (
  details: Omit<Certificate, 'id' | 'transactionHash' | 'timestamp'>
): Certificate => {
  const newId = `CERT-${Date.now()}`
  const mockHash = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`

  const newCertificate: Certificate = {
    ...details,
    id: newId,
    transactionHash: mockHash,
    timestamp: new Date(),
  }

  certificates.push(newCertificate)
  return newCertificate
}

/**
 * Retrieves all issued certificates.
 */
export const getIssuedCertificates = (): Certificate[] => {
  // Return a copy to prevent external modification
  return [...certificates].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )
}

/**
 * Retrieves a certificate by its ID or Hash (for verification).
 */
export const getCertificateByHashOrId = (
  identifier: string
): Certificate | undefined => {
  return certificates.find(
    (c) => c.id === identifier || c.transactionHash === identifier
  )
}

// Add initial mock data
certificates.push({
  id: 'CERT-1001',
  learnerName: 'Ravi Kumar',
  course: 'Full Stack Development',
  rollNo: 'RSD2023001',
  completionDate: '2023-09-15',
  transactionHash: '0xabc123def4567890',
  timestamp: new Date(Date.now() - 86400000), // Yesterday
})

export const mockLearner = {
  id: 'LID007',
  name: 'Ravi Kumar',
  certificates: [
    {
      id: 'CERT-1001',
      course: 'Full Stack Development',
      issuer: 'Training Partner A',
    },
    { id: 'CERT-2005', course: 'Data Science Fundamentals', issuer: 'NCVET' },
  ],
  // Note: The actual certificate data is pulled from the main `certificates` array
}

/**
 * Mock login function
 */
export const mockLearnerLogin = (learnerId: string) => {
  if (learnerId === mockLearner.id) {
    return mockLearner
  }
  return null
}
