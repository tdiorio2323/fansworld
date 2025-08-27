type PageProps = { params: Promise<{ username: string }> }

export function generateStaticParams() {
  return [{ username: "demo" }]
}

export default async function Page({ params }: PageProps) {
  const { username } = await params
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Creator</h1>
      <p className="mt-2">Username: {username}</p>
      <p className="mt-4">
        <a className="text-blue-600 underline" href="/unlock">
          Unlock
        </a>
      </p>
    </main>
  )
}
