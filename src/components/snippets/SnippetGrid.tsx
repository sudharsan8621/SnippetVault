'use client'

import { useMemo } from 'react'
import { useSnippets } from '@/hooks'
import { useUIStore } from '@/stores/uiStore'
import SnippetCard from './SnippetCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export default function SnippetGrid() {
  const { data: snippets, isLoading, error } = useSnippets()
  const { searchQuery, selectedTags, resetFilters } = useUIStore()

  const filteredSnippets = useMemo(() => {
    if (!snippets) return []

    return snippets.filter((snippet) => {
      const matchesSearch =
        searchQuery === '' ||
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTags =
        selectedTags.length === 0 ||
        snippet.tags?.some((tag) => selectedTags.includes(tag.name))

      return matchesSearch && matchesTags
    })
  }, [snippets, searchQuery, selectedTags])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border rounded-lg p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-20 w-full mb-2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load snippets</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (!snippets || snippets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No snippets yet. Create your first one!</p>
      </div>
    )
  }

  if (filteredSnippets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No snippets match your filters</p>
        <Button variant="outline" onClick={resetFilters}>Clear filters</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredSnippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  )
}