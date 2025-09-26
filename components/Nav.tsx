import Link from 'next/link'
import LogoLockup from './LogoLockup'
import Button from './ui/Button'

const links: Array<{ label: string; href: string }> = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Creators', href: '/explore?filter=featured' },
  { label: 'Messages', href: '/messages' },
  { label: 'Studio', href: '/studio' },
  { label: 'About', href: '/#about' },
]

export default function Nav() {
  return (
    <header className="sticky top-4 z-50">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2">
        <Link href="/" className="flex items-center gap-3">
          <LogoLockup />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="text-white/85 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="primary" size="md" className="relative hidden overflow-hidden md:inline-flex">
          <span className="absolute inset-0 opacity-[0.25]" style={{ backgroundImage: 'var(--holo)' }} />
          <span className="relative">Get Started</span>
        </Button>
      </div>
    </header>
  )
}
