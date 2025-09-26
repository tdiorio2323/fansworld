export default function Footer() {
  return (
    <footer className="mt-16 pb-10">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-6 py-4">
        <span className="text-sm text-white/70">© {new Date().getFullYear()} Cabana</span>
        <nav className="flex gap-4 text-sm">
          <a href="/about" className="text-white/80 hover:text-white">
            About
          </a>
          <a href="/terms" className="text-white/80 hover:text-white">
            Terms
          </a>
          <a href="/privacy" className="text-white/80 hover:text-white">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  )
}
