'use client'

import AuthGuard from '@/components/AuthGuard'
import Navbar from '@/components/Navbar'
import SnippetGrid from '@/components/snippets/SnippetGrid'
import SearchBar from '@/components/snippets/SearchBar'
import TagFilter from '@/components/snippets/TagFilter'
import SnippetDetail from '@/components/snippets/SnippetDetail'
import SnippetForm from '@/components/snippets/SnippetForm'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'

export default function DashboardPage() {
  const { setFormOpen } = useUIStore()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">My Snippets</h1>
            <Button onClick={() => setFormOpen(true)}>+ New Snippet</Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <SearchBar />
            <TagFilter />
          </div>

          <SnippetGrid />
          <SnippetDetail />
          <SnippetForm />
        </main>
      </div>
    </AuthGuard>
  )
}