'use client'

import { useTags } from '@/hooks'
import { useUIStore } from '@/stores/uiStore'
import { Badge } from '@/components/ui/badge'
import { Tag } from '@/types'

export default function TagFilter() {
  const { data: tags } = useTags()
  const { selectedTags, toggleTag } = useUIStore()

  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {(tags as Tag[]).map((tag) => (
        <Badge
          key={tag.id}
          variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => toggleTag(tag.name)}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  )
}