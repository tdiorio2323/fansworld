#!/usr/bin/env bash
set -euo pipefail

# helper: write a file with content
w() { mkdir -p "$(dirname "$1")"; cat > "$1"; }

# --- MARKETING ---
w "app/(marketing)/layout.tsx" <<'TSX'
export default function Layout({children}:{children:React.ReactNode}) {
  return <div className="min-h-screen">{children}</div>;
}
TSX

w "app/(marketing)/page.tsx" <<'TSX'
export default function Page(){return <main className="p-8"><h1>Cabana</h1></main>}
TSX

for p in pricing features creators about; do
  w "app/(marketing)/$p/page.tsx" <<TSX
export default function Page(){return <main className="p-8"><h1>${p}</h1></main>}
TSX
done

w "app/(marketing)/legal/terms/page.tsx" <<'TSX'
export default function Page(){return <main className="p-8"><h1>Terms</h1></main>}
TSX
w "app/(marketing)/legal/privacy/page.tsx" <<'TSX'
export default function Page(){return <main className="p-8"><h1>Privacy</h1></main>}
TSX

# --- AUTH ---
w "app/(auth)/layout.tsx" <<'TSX'
export default function Layout({children}:{children:React.ReactNode}) {
  return <div className="min-h-screen">{children}</div>;
}
TSX
for p in login register "forgot-password" "verify-email" welcome; do
  w "app/(auth)/$p/page.tsx" <<TSX
export default function Page(){return <main className="p-8"><h1>${p}</h1></main>}
TSX
done

# --- DASHBOARD (creator) ---
w "app/(dashboard)/dashboard/layout.tsx" <<'TSX'
export default function DashboardLayout({children}:{children:React.ReactNode}) {
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="border-r p-4">Sidebar</aside>
      <div className="flex flex-col">
        <header className="border-b p-4">Topbar</header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
TSX

w "app/(dashboard)/dashboard/page.tsx" <<'TSX'
export default function Page(){return <section><h1>Dashboard</h1></section>}
TSX

for p in content subscribers messages earnings settings; do
  w "app/(dashboard)/dashboard/$p/page.tsx" <<TSX
export default function Page(){return <section><h1>${p}</h1></section>}
TSX
done

# --- USER ---
for p in home discover subscriptions messages wallet; do
  w "app/(user)/u/$p/page.tsx" <<TSX
export default function Page(){return <main className="p-8"><h1>${p}</h1></main>}
TSX
done

# --- ADMIN ---
w "app/(admin)/admin/layout.tsx" <<'TSX'
export default function AdminLayout({children}:{children:React.ReactNode}) {
  return <div className="min-h-screen p-6">{children}</div>;
}
TSX
w "app/(admin)/admin/page.tsx" <<'TSX'
export default function Page(){return <section><h1>Admin</h1></section>}
TSX
for p in creators users content; do
  w "app/(admin)/admin/$p/page.tsx" <<TSX
export default function Page(){return <section><h1>${p}</h1></section>}
TSX
done

# --- HELP ---
w "app/(marketing)/help/faq/page.tsx" <<'TSX'
export default function Page(){return <main className="p-8"><h1>FAQ</h1></main>}
TSX
w "app/(marketing)/help/contact/page.tsx" <<'TSX'
export default function Page(){return <main className="p-8"><h1>Contact</h1></main>}
TSX

# --- API STUBS ---
w "app/api/stripe/webhook/route.ts" <<'TS'
export async function POST(_req: Request){ return new Response('ok') }
TS
w "app/api/uploads/sign/route.ts" <<'TS'
export async function POST(_req: Request){ return Response.json({url:'signed-url-placeholder'}) }
TS
w "app/api/profile/route.ts" <<'TS'
export async function GET(){ return Response.json({ok:true}) }
TS

# --- AUTH HELPERS + MIDDLEWARE ---
w "lib/auth.ts" <<'TS'
export async function requireUser(){ return { id:'demo', role:'user'} }
export async function requireAdmin(){ const u = await requireUser(); if(u.role!=='admin') throw new Error('forbidden'); return u; }
TS
w "middleware.ts" <<'TS'
import { NextResponse } from 'next/server'
export function middleware(){ return NextResponse.next() }
export const config = { matcher: ['/dashboard/:path*','/admin/:path*'] }
TS

echo "Scaffold complete."
