import { z } from 'zod';

// Request state enum
export const requestStateSchema = z.enum(['failed', 'success']);
export type RequestState = z.infer<typeof requestStateSchema>;

// HTTP methods enum
export const httpMethodSchema = z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']);
export type HttpMethod = z.infer<typeof httpMethodSchema>;

// Request schema
export const requestSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  method: httpMethodSchema,
  received_time: z.coerce.date(),
  state: requestStateSchema,
  cache_key: z.string().nullable(), // Cache key associated with this request
  origin_request_id: z.string().nullable(), // Reference to the origin request
  seed_request_id: z.string().nullable(), // Reference to the seed request
  is_origin: z.boolean(), // True if this is an origin request
  is_seed: z.boolean(), // True if this is a seed request
  created_at: z.coerce.date(),
});

export type Request = z.infer<typeof requestSchema>;

// Input schema for creating requests
export const createRequestInputSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  method: httpMethodSchema,
  received_time: z.coerce.date(),
  state: requestStateSchema,
  cache_key: z.string().nullable(),
  origin_request_id: z.string().nullable(),
  seed_request_id: z.string().nullable(),
  is_origin: z.boolean(),
  is_seed: z.boolean(),
});

export type CreateRequestInput = z.infer<typeof createRequestInputSchema>;

// Cache key query input schema
export const cacheKeyQueryInputSchema = z.object({
  cache_key: z.string(),
});

export type CacheKeyQueryInput = z.infer<typeof cacheKeyQueryInputSchema>;

// Cache request tree structure for API response
export const cacheRequestTreeSchema = z.object({
  cache_key: z.string(),
  origin_request: requestSchema.nullable(),
  seed_request: requestSchema.nullable(),
  dependent_requests: z.array(requestSchema),
});

export type CacheRequestTree = z.infer<typeof cacheRequestTreeSchema>;