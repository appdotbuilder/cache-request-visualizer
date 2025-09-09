import { text, pgTable, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enum definitions for the database
export const requestStateEnum = pgEnum('request_state', ['failed', 'success']);
export const httpMethodEnum = pgEnum('http_method', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']);

// Requests table
export const requestsTable = pgTable('requests', {
  id: text('id').primaryKey(),
  project_id: text('project_id').notNull(),
  method: httpMethodEnum('method').notNull(),
  received_time: timestamp('received_time').notNull(),
  state: requestStateEnum('state').notNull(),
  cache_key: text('cache_key'), // Nullable - not all requests have cache keys
  origin_request_id: text('origin_request_id'), // Nullable - references another request
  seed_request_id: text('seed_request_id'), // Nullable - references another request
  is_origin: boolean('is_origin').notNull().default(false),
  is_seed: boolean('is_seed').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type Request = typeof requestsTable.$inferSelect; // For SELECT operations
export type NewRequest = typeof requestsTable.$inferInsert; // For INSERT operations

// Export all tables for proper query building
export const tables = { 
  requests: requestsTable 
};