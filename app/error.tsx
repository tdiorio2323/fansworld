'use client'

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body>
        <div className="glass mx-auto mt-16 max-w-lg rounded-2xl p-8">
          <h1 className="mb-2 font-display text-3xl">Something broke</h1>
          <p className="text-white/70">{error.message}</p>
          <a href="/" className="mt-4 inline-block underline">
            Reload
          </a>
        </div>
      </body>
    </html>
  )
}
