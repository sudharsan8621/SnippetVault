'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useUIStore } from '@/stores/uiStore'

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useUIStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [localQuery, setSearchQuery])

  return (
    <Input
      type="text"
      placeholder="Search snippets..."
      value={localQuery}
      onChange={(e) => setLocalQuery(e.target.value)}
      className="max-w-sm"
    />
  )
}