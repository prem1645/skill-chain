import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
  foreignKey,
} from 'drizzle-orm/pg-core'
import { user } from './auth.schema'

export const certificate = pgTable('certificate', {
  id: uuid('id').primaryKey().defaultRandom(),
  certId: integer('cert_id').notNull().unique(), // Sequential certificate ID
  learnerName: text('learner_name').notNull(),
  courseName: text('course_name').notNull(),
  nsqfLevel: integer('nsqf_level').notNull(),
  completionDate: timestamp('completion_date').notNull(),
  marks: integer('marks'),
  issuerId: uuid('issuer_id').notNull(), // Reference to issuer user
  learnerAddress: varchar('learner_address', { length: 42 }), // Ethereum address
  certHash: varchar('cert_hash', { length: 64 }), // SHA-256 hash
  ipfsCid: text('ipfs_cid'), // IPFS Content ID
  transactionHash: varchar('transaction_hash', { length: 66 }), // Blockchain tx hash
  metadata: jsonb('metadata'), // Full certificate JSON metadata
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => [
  foreignKey({
    name: 'fk_certificate_issuer_id',
    columns: [table.issuerId],
    foreignColumns: [user.id],
  }).onDelete('cascade'),
])

export type Certificate = typeof certificate.$inferSelect
export type CertificateInsert = typeof certificate.$inferInsert