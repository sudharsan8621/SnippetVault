import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">SnippetVault</h1>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>

    {/* Hero Section */}
    <main className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          Save, Share & Manage<br />Your Code Snippets
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          SnippetVault is a lightweight code snippet manager for developers.
          Save reusable bits of code, tag them, and share with anyone.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Login</Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">Save Snippets</h3>
          <p className="text-gray-600">
            Store your code snippets with syntax highlighting for 20+ languages.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-4">🏷️</div>
          <h3 className="text-lg font-semibold mb-2">Organize with Tags</h3>
          <p className="text-gray-600">
            Add tags to your snippets and filter them easily.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl mb-4">🔗</div>
          <h3 className="text-lg font-semibold mb-2">Share Anywhere</h3>
          <p className="text-gray-600">
            Share via public URL, with specific users, or export as image.
          </p>
        </div>
      </div>
    </main>

    {/* Footer */}
    <footer className="bg-white border-t mt-20">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600">
        <p>© 2024 SnippetVault. Built for developers.</p>
      </div>
    </footer>
  </div>
)
}