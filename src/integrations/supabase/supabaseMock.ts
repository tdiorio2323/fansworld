// Minimal runtime mock for Supabase client to allow building/running
// without external services. Returns benign data and no-ops for side effects.

type Result<T = any> = Promise<{ data: T; error: null } | { data: null; error: Error }>;

const ok = <T>(data: T): Result<T> => Promise.resolve({ data, error: null });

// Chainable query builder stub
const query = () => {
  const api: any = {
    select: () => ok<any[]>([]),
    insert: () => ok<any[]>([]),
    upsert: () => ok<any[]>([]),
    update: () => ok<any[]>([]),
    delete: () => ok<any[]>([]),
    eq: () => api,
    in: () => api,
    ilike: () => api,
    like: () => api,
    contains: () => api,
    order: () => api,
    limit: () => api,
    range: () => api,
    single: () => ok<any | null>(null),
    maybeSingle: () => ok<any | null>(null),
  };
  return api;
};

const mockUser = null as any; // stay unauthenticated by default

export const supabase: any = {
  from: () => query(),
  rpc: () => ok(null),
  functions: {
    invoke: async (_name: string, _opts?: any) => ({ data: { url: '/' }, error: null }),
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: { path: 'mock/path' }, error: null }),
      remove: async () => ({ data: null, error: null }),
      createSignedUrl: async () => ({ data: { signedUrl: '/' }, error: null }),
      getPublicUrl: (_path: string) => ({ data: { publicUrl: '/' } }),
    }),
  },
  channel: (_name: string) => ({
    on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    subscribe: () => ({ unsubscribe: () => {} }),
    unsubscribe: () => {},
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: mockUser }, error: null }),
    onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: { user: mockUser, session: null }, error: null }),
    signInWithOAuth: async () => ({ data: { provider: 'mock' }, error: null }),
    signUp: async () => ({ data: { user: mockUser }, error: null }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ data: {}, error: null }),
  },
};

