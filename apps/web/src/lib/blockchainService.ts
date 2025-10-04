// web/src/lib/blockchainService.ts
import { webEnv } from './env'

export interface Certificate {
  id: string
  learnerName: string
  course: string
  rollNo: string
  completionDate: string
  transactionHash: string
  timestamp: Date
  ipfsCid?: string
}

const API_BASE = webEnv.NEXT_PUBLIC_SERVER_URL

/**
 * Mints a new certificate by calling the backend API.
 */
export const mintCertificate = async (
  details: Omit<Certificate, 'id' | 'transactionHash' | 'timestamp' | 'ipfsCid'>
): Promise<Certificate> => {
  const response = await fetch(`${API_BASE}/api/certificate/issue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(details),
  })

  if (!response.ok) {
    throw new Error(`Failed to mint certificate: ${response.statusText}`)
  }

  const data = await response.json()
  return data.certificate
}

/**
 * Retrieves all issued certificates from the backend.
 */
export const getIssuedCertificates = async (): Promise<Certificate[]> => {
  const response = await fetch(`${API_BASE}/api/certificate`)

  if (!response.ok) {
    throw new Error(`Failed to fetch certificates: ${response.statusText}`)
  }

  const data = await response.json()
  return data.certificates || []
}

/**
 * Retrieves a certificate by its ID for verification.
 */
export const getCertificateById = async (
  certId: string
): Promise<Certificate | null> => {
  const response = await fetch(`${API_BASE}/api/certificate/verify/${certId}`)

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch certificate: ${response.statusText}`)
  }

  const data = await response.json()
  return data.certificate
}

/**
 * Verifies a certificate by comparing on-chain and recalculated hash.
 * Returns the certificate data if valid, null if invalid.
 */
export const verifyCertificate = async (certId: string): Promise<Certificate | null> => {
  const response = await fetch(`${API_BASE}/api/certificate/verify/${certId}`)

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error(`Verification failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.certificate
}

/**
 * Mock login function for learner portal (to be replaced with real auth)
 */
export const mockLearnerLogin = (learnerId: string) => {
  // This is a mock function; in production, integrate with real auth
  return { id: learnerId, name: 'Mock Learner' }
}
