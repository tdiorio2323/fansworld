export async function requireUser(){ return { id:'demo', role:'user'} }
export async function requireAdmin(){ const u = await requireUser(); if(u.role!=='admin') throw new Error('forbidden'); return u; }
