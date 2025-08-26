import { supabase } from '@/integrations/supabase/supabase';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthError } from '@supabase/supabase-js';

type Ctx = {
  user: User | null; loading: boolean; signIn(email: string, pw: string): Promise<{ error: AuthError | null }>;
  signUp(email: string, pw: string): Promise<{ error: AuthError | null }>; signOut(): Promise<{ error: AuthError | null }>
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, pw: string) { const { error } = await supabase.auth.signInWithPassword({ email, password: pw }); return { error }; }
  async function signUp(email: string, pw: string) { const { error } = await supabase.auth.signUp({ email, password: pw }); return { error }; }
  async function signOut() { const { error } = await supabase.auth.signOut(); return { error }; }

  return <AuthCtx.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthCtx.Provider>;
}
export function useAuth() {
  const ctx = useContext(AuthCtx); if (!ctx) throw new Error('useAuth outside provider'); return ctx;
}
