import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function PublicSnippetPage({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params

const { data: snippet, error } = await supabase
  .from('snippets')
  .select('*, profiles(*)')
  .eq('id', id)
  .eq('is_public', true)
  .single()

if (error || !snippet) {
  notFound()
}

return (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Link href="/" className="text-xl font-bold">SnippetVault</Link>
      </div>
    </header>

    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold">{snippet.title}</h1>
          <Badge variant="outline">{snippet.language}</Badge>
        </div>

        <Link href={`/u/${snippet.profiles?.username}`} className="text-sm text-blue-600 hover:underline mb-4 block">
          By {snippet.profiles?.display_name}
        </Link>

        {snippet.description && <p className="text-gray-600 mb-4">{snippet.description}</p>}

        <pre className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </main>
  </div>
)
}