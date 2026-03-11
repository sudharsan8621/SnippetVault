'use client'

import { useQuery } from '@tanstack/react-query'
import { tagsApi } from '@/lib/api'

// Get all tags
export function useTags() {
return useQuery({
  queryKey: ['tags'],
  queryFn: tagsApi.getAllTags,
})
}