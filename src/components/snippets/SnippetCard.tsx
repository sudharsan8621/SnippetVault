'use client'

import { Snippet } from '@/types'
import { Badge } from '@/components/ui/badge'
import { useUIStore } from '@/stores/uiStore'

interface SnippetCardProps {
  snippet: Snippet
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const { setActiveSnippetId } = useUIStore()

  const codePreview = snippet.code.split('\n').slice(0, 3).join('\n')

  return (
    <div
      onClick={() => setActiveSnippetId(snippet.id)}
      className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg truncate">{snippet.title}</h3>
        <Badge variant={snippet.is_public ? 'default' : 'secondary'}>
          {snippet.is_public ? 'Public' : 'Private'}
        </Badge>
      </div>

      <Badge variant="outline" className="mb-2">
        {snippet.language}
      </Badge>

      <pre className="bg-gray-100 rounded p-2 text-sm overflow-hidden mb-2">
        <code className="text-gray-800">{codePreview}</code>
      </pre>

      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {snippet.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}