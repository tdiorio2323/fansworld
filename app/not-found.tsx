export default function NotFound() {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <h1 className="mb-2 font-display text-5xl">404</h1>
      <p className="text-white/70">Page not found.</p>
      <a href="/" className="mt-4 inline-block underline">
        Go home
      </a>
    </div>
  )
}
