import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
const { username } = await params

const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('username', username)
  .single()

if (!profile) {
  notFound()
}

const { data: snippets } = await supabase
  .from('snippets')
  .select('*')
  .eq('user_id', profile.id)
  .eq('is_public', true)
  .order('created_at', { ascending: false })

return (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link href="/" className="text-xl font-bold">SnippetVault</Link>
      </div>
    </header>

    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl">
            {profile.display_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.display_name}</h1>
            <p className="text-gray-500">@{profile.username}</p>
            <p className="text-sm">{snippets?.length || 0} public snippets</p>
          </div>
        </div>
      </div>
    </div>

    <main className="max-w-6xl mx-auto px-4 py-8">
      {!snippets?.length ? (
        <p className="text-center text-gray-500">No public snippets yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snippets.map((snippet) => (
            <Link key={snippet.id} href={`/s/${snippet.id}`} className="bg-white border rounded-lg p-4 hover:shadow-md">
              <h3 className="font-semibold mb-2">{snippet.title}</h3>
              <Badge variant="outline">{snippet.language}</Badge>
              <pre className="bg-gray-100 rounded p-2 text-sm mt-2 overflow-hidden">
                {snippet.code.split('\n').slice(0, 3).join('\n')}
              </pre>
            </Link>
          ))}
        </div>
      )}
    </main>
  </div>
)
}