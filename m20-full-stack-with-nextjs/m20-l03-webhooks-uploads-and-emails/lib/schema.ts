import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  course: text('course').notNull(),
  amount: integer('amount').notNull(),
  status: text('status').notNull().default('pending'),
  sessionId: text('session_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const webhookEvents = pgTable('webhook_events', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  receivedAt: timestamp('received_at').defaultNow().notNull(),
})
