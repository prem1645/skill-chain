import { z } from 'zod'
import { createHash } from 'crypto'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import { eq } from 'drizzle-orm'

import { protectedProcedure, publicProcedure } from '../lib/orpc'
import { db } from '../db'
import { certificate } from '../db/schema/certificate'
import { serverEnv } from '../lib/env'

// Initialize IPFS client
const ipfsClient = serverEnv.IPFS_API_URL 
  ? create({ url: serverEnv.IPFS_API_URL })
  : null

// Initialize Ethereum provider
const provider = new ethers.JsonRpcProvider(serverEnv.POLYGON_RPC_URL)
const wallet = new ethers.Wallet(serverEnv.ISSUER_PRIVATE_KEY, provider)

// CredentialLedger ABI
const credentialLedgerABI = [
  "function issueCredential(uint256 _certId, address _learnerAddress, bytes32 _certHash) external",
  "function getCredentialHash(uint256 _certId) external view returns (bytes32)",
  "function isCredentialValid(bytes32 _certHash) external view returns (bool)",
  "event CredentialIssued(uint256 indexed certId, address indexed learnerAddress, bytes32 certHash)"
]

const credentialLedgerContract = new ethers.Contract(
  serverEnv.CREDENTIAL_LEDGER_ADDRESS,
  credentialLedgerABI,
  wallet
)

export const certificateRouter = {
  // Issuance workflow - Step 1: Prepare certificate data
  prepareIssuance: protectedProcedure
    .input(z.object({
      learnerName: z.string(),
      courseName: z.string(),
      nsqfLevel: z.number(),
      completionDate: z.string().datetime(),
      marks: z.number().optional(),
      learnerAddress: z.string().optional(),
    }))
    .handler(async ({ input, context }) => {
      const issuerId = context.session?.user.id
      if (!issuerId) {
        throw new Error('Unauthorized')
      }

      // Generate sequential certId (you might want to use a better sequence generator)
      const lastCert = await db.select().from(certificate).orderBy(certificate.certId).limit(1)
      const nextCertId = lastCert.length > 0 ? lastCert[0].certId + 1 : 1

      // Create certificate metadata
      const metadata = {
        learnerName: input.learnerName,
        courseName: input.courseName,
        nsqfLevel: input.nsqfLevel,
        completionDate: input.completionDate,
        marks: input.marks,
        issuerId: issuerId,
        issuedAt: new Date().toISOString(),
      }

      // Calculate SHA-256 hash
      const certHash = createHash('sha256')
        .update(JSON.stringify(metadata))
        .digest('hex')

      return {
        certId: nextCertId,
        certHash,
        metadata,
      }
    }),

  // Issuance workflow - Step 2: Store off-chain and mint on-chain
  issueCredential: protectedProcedure
    .input(z.object({
      certId: z.number(),
      learnerName: z.string(),
      courseName: z.string(),
      nsqfLevel: z.number(),
      completionDate: z.string().datetime(),
      marks: z.number().optional(),
      learnerAddress: z.string().optional(),
      certHash: z.string(),
    }))
    .handler(async ({ input, context }) => {
      const issuerId = context.session?.user.id
      if (!issuerId) {
        throw new Error('Unauthorized')
      }

      // Upload to IPFS if configured
      let ipfsCid = null
      if (ipfsClient) {
        try {
          const metadata = {
            learnerName: input.learnerName,
            courseName: input.courseName,
            nsqfLevel: input.nsqfLevel,
            completionDate: input.completionDate,
            marks: input.marks,
            issuerId,
            issuedAt: new Date().toISOString(),
          }
          const result = await ipfsClient.add(JSON.stringify(metadata))
          ipfsCid = result.cid.toString()
        } catch (error) {
          console.error('IPFS upload failed:', error)
        }
      }

      // Store certificate in database
      const certData = {
        certId: input.certId,
        learnerName: input.learnerName,
        courseName: input.courseName,
        nsqfLevel: input.nsqfLevel,
        completionDate: new Date(input.completionDate),
        marks: input.marks,
        issuerId,
        learnerAddress: input.learnerAddress,
        certHash: input.certHash,
        ipfsCid: ipfsCid || null,
        metadata: {
          learnerName: input.learnerName,
          courseName: input.courseName,
          nsqfLevel: input.nsqfLevel,
          completionDate: input.completionDate,
          marks: input.marks,
          issuerId,
          issuedAt: new Date().toISOString(),
        },
      }

      const [newCert] = await db.insert(certificate).values(certData).returning()

      // Mint on blockchain
      try {
        const tx = await credentialLedgerContract.issueCredential(
          input.certId,
          input.learnerAddress || ethers.ZeroAddress,
          '0x' + input.certHash
        )
        
        const receipt = await tx.wait()
        await db.update(certificate)
          .set({ transactionHash: receipt.hash })
          .where(eq(certificate.id, newCert.id))
        
        return {
          success: true,
          certId: input.certId,
          transactionHash: receipt.hash,
          ipfsCid,
        }
      } catch (error) {
        console.error('Blockchain transaction failed:', error)
        throw new Error('Failed to issue credential on blockchain')
      }
    }),

  // Verification workflow
  verifyCredential: publicProcedure
    .input(z.object({
      certId: z.number(),
    }))
    .handler(async ({ input }) => {
      // Get certificate from database
      const cert = await db.select().from(certificate).where(eq(certificate.certId, input.certId))
      if (!cert.length) {
        throw new Error('Certificate not found')
      }

      const certificateData = cert[0]

      // Get on-chain hash
      const onChainHash = await credentialLedgerContract.getCredentialHash(input.certId)
      const storedHash = '0x' + certificateData.certHash

      // Compare hashes
      const isValid = onChainHash === storedHash

      return {
        certId: input.certId,
        learnerName: certificateData.learnerName,
        courseName: certificateData.courseName,
        nsqfLevel: certificateData.nsqfLevel,
        completionDate: certificateData.completionDate,
        issuerId: certificateData.issuerId,
        isValid,
        onChainHash,
        storedHash,
        ipfsCid: certificateData.ipfsCid,
        transactionHash: certificateData.transactionHash,
      }
    }),

  // Integration workflow - Mock DigiLocker
  integrateDigiLocker: protectedProcedure
    .input(z.object({
      certId: z.number(),
    }))
    .handler(async ({ input }) => {
      const cert = await db.select().from(certificate).where(eq(certificate.certId, input.certId))
      if (!cert.length) {
        throw new Error('Certificate not found')
      }

      const certificateData = cert[0]

      // Mock DigiLocker payload format
      const digiLockerPayload = {
        certificate: {
          id: certificateData.certId,
          name: certificateData.learnerName,
          course: certificateData.courseName,
          level: certificateData.nsqfLevel,
          issuedDate: certificateData.completionDate,
          issuer: certificateData.issuerId,
          transactionHash: certificateData.transactionHash,
          verificationUrl: `${serverEnv.CORS_ORIGIN}/verify?certId=${certificateData.certId}`,
        },
        format: 'JSON',
        version: '1.0',
      }

      // In a real implementation, this would POST to DigiLocker API
      // For now, we just return the mock payload
      return {
        success: true,
        message: 'Mock DigiLocker integration successful',
        payload: digiLockerPayload,
      }
    }),

  // Get certificate by ID
  getCertificate: publicProcedure
    .input(z.object({
      certId: z.number(),
    }))
    .handler(async ({ input }) => {
      const cert = await db.select().from(certificate).where(eq(certificate.certId, input.certId))
      if (!cert.length) {
        throw new Error('Certificate not found')
      }

      return cert[0]
    }),

  // Get certificates by learner (for dashboard)
  getLearnerCertificates: protectedProcedure
    .handler(async ({ context }) => {
      const userId = context.session?.user.id
      if (!userId) {
        throw new Error('Unauthorized')
      }

      const certs = await db.select()
        .from(certificate)
        .where(eq(certificate.issuerId, userId))
        .orderBy(certificate.createdAt)

      return certs
    }),

  // REST API endpoints for frontend compatibility
  
  // GET /api/certificate - Get all certificates (for issuer dashboard)
  getAllCertificates: publicProcedure
    .handler(async () => {
      const certs = await db.select()
        .from(certificate)
        .orderBy(certificate.createdAt)
      
      // If no certificates exist, return some mock data for demo
      if (certs.length === 0) {
        const mockCertificates = [
          {
            id: 'CERT-1001',
            learnerName: 'John Doe',
            course: 'Digital Marketing Fundamentals',
            rollNo: 'LID007',
            completionDate: '2024-01-15',
            transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
            timestamp: new Date('2024-01-15'),
            ipfsCid: 'QmMockIpfsHash123',
          },
          {
            id: 'CERT-1002',
            learnerName: 'Jane Smith',
            course: 'Web Development Bootcamp',
            rollNo: 'LID008',
            completionDate: '2024-01-20',
            transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
            timestamp: new Date('2024-01-20'),
            ipfsCid: null,
          },
        ]
        
        return {
          certificates: mockCertificates
        }
      }
      
      return {
        certificates: certs.map(cert => ({
          id: `CERT-${cert.certId}`,
          learnerName: cert.learnerName,
          course: cert.courseName,
          rollNo: `LID${cert.certId.toString().padStart(3, '0')}`, // Mock roll number
          completionDate: cert.completionDate.toISOString().split('T')[0],
          transactionHash: cert.transactionHash || `0x${'0'.repeat(64)}`,
          timestamp: cert.createdAt,
          ipfsCid: cert.ipfsCid,
        }))
      }
    }),

  // POST /api/certificate/issue - Issue new certificate
  issueCertificate: publicProcedure
    .input(z.object({
      learnerName: z.string(),
      course: z.string(),
      rollNo: z.string(),
      completionDate: z.string(),
    }))
    .handler(async ({ input }) => {
      // Generate next cert ID
      const lastCert = await db.select().from(certificate).orderBy(certificate.certId).limit(1)
      const nextCertId = lastCert.length > 0 ? lastCert[0].certId + 1 : 1

      // Create certificate metadata
      const metadata = {
        learnerName: input.learnerName,
        courseName: input.course,
        nsqfLevel: 4, // Default NSQF level
        completionDate: input.completionDate,
        issuerId: 'issuer-001', // Mock issuer ID
        issuedAt: new Date().toISOString(),
      }

      // Calculate hash
      const certHash = createHash('sha256')
        .update(JSON.stringify(metadata))
        .digest('hex')

      // Store in database
      const certData = {
        certId: nextCertId,
        learnerName: input.learnerName,
        courseName: input.course,
        nsqfLevel: 4,
        completionDate: new Date(input.completionDate),
        issuerId: 'issuer-001',
        learnerAddress: null,
        certHash: certHash,
        ipfsCid: null,
        metadata: metadata,
      }

      const [newCert] = await db.insert(certificate).values(certData).returning()

      // Mock blockchain transaction
      const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`
      
      await db.update(certificate)
        .set({ transactionHash: mockTxHash })
        .where(eq(certificate.id, newCert.id))

      return {
        certificate: {
          id: `CERT-${nextCertId}`,
          learnerName: input.learnerName,
          course: input.course,
          rollNo: input.rollNo,
          completionDate: input.completionDate,
          transactionHash: mockTxHash,
          timestamp: newCert.createdAt,
        }
      }
    }),

  // GET /api/certificate/verify/:id - Verify certificate by ID
  verifyCertificateById: publicProcedure
    .input(z.object({
      certId: z.string(),
    }))
    .handler(async ({ input }) => {
      // Extract numeric ID from CERT-XXX format
      const numericId = parseInt(input.certId.replace('CERT-', ''))
      
      const cert = await db.select()
        .from(certificate)
        .where(eq(certificate.certId, numericId))
        .limit(1)

      if (!cert.length) {
        // Check for mock data
        if (input.certId === 'CERT-1001') {
          return {
            certificate: {
              id: 'CERT-1001',
              learnerName: 'John Doe',
              course: 'Digital Marketing Fundamentals',
              rollNo: 'LID007',
              completionDate: '2024-01-15',
              transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
              timestamp: new Date('2024-01-15'),
              ipfsCid: 'QmMockIpfsHash123',
            }
          }
        }
        
        return { certificate: null }
      }

      const certificateData = cert[0]
      
      return {
        certificate: {
          id: `CERT-${certificateData.certId}`,
          learnerName: certificateData.learnerName,
          course: certificateData.courseName,
          rollNo: `LID${certificateData.certId.toString().padStart(3, '0')}`,
          completionDate: certificateData.completionDate.toISOString().split('T')[0],
          transactionHash: certificateData.transactionHash || `0x${'0'.repeat(64)}`,
          timestamp: certificateData.createdAt,
          ipfsCid: certificateData.ipfsCid,
        }
      }
    }),
}