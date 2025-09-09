import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schema types
import { 
  createRequestInputSchema, 
  cacheKeyQueryInputSchema 
} from './schema';

// Import handlers
import { createRequest } from './handlers/create_request';
import { getCacheRequestTree } from './handlers/get_cache_request_tree';
import { getAllRequests } from './handlers/get_all_requests';
import { getRequestsByProject } from './handlers/get_requests_by_project';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Create a new request record
  createRequest: publicProcedure
    .input(createRequestInputSchema)
    .mutation(({ input }) => createRequest(input)),

  // Get cache request tree for a specific cache key
  getCacheRequestTree: publicProcedure
    .input(cacheKeyQueryInputSchema)
    .query(({ input }) => getCacheRequestTree(input)),

  // Get all requests (for debugging/admin purposes)
  getAllRequests: publicProcedure
    .query(() => getAllRequests()),

  // Get requests by project ID
  getRequestsByProject: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ input }) => getRequestsByProject(input.projectId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();