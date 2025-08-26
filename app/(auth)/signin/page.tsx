'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const signInEmail = async (e:any) => { e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message); else window.location.href = '/discover';
  };
  const signInGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google', options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/discover` }
    });
    if (error) alert(error.message);
  };
  return (
    <div className="mx-auto max-w-sm p-6">
      <form onSubmit={signInEmail} className="space-y-3">
        <input className="w-full border p-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full border p-2" type="submit">Sign In</button>
      </form>
      <hr className="my-4" />
      <button onClick={signInGoogle} className="w-full border p-2">Continue with Google</button>
    </div>
  );
}