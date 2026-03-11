import { create } from 'zustand'

interface UIState {
// Active snippet (for detail panel)
activeSnippetId: string | null
setActiveSnippetId: (id: string | null) => void

// Share menu
isShareMenuOpen: boolean
setShareMenuOpen: (open: boolean) => void

// Search
searchQuery: string
setSearchQuery: (query: string) => void

// Tag filters
selectedTags: string[]
setSelectedTags: (tags: string[]) => void
toggleTag: (tag: string) => void
clearTags: () => void

// Create/Edit form
isFormOpen: boolean
setFormOpen: (open: boolean) => void
editingSnippetId: string | null
setEditingSnippetId: (id: string | null) => void

// Delete confirmation
deleteSnippetId: string | null
setDeleteSnippetId: (id: string | null) => void

// Reset all filters
resetFilters: () => void
}

export const useUIStore = create<UIState>((set) => ({
// Active snippet
activeSnippetId: null,
setActiveSnippetId: (id) => set({ activeSnippetId: id }),

// Share menu
isShareMenuOpen: false,
setShareMenuOpen: (open) => set({ isShareMenuOpen: open }),

// Search
searchQuery: '',
setSearchQuery: (query) => set({ searchQuery: query }),

// Tag filters
selectedTags: [],
setSelectedTags: (tags) => set({ selectedTags: tags }),
toggleTag: (tag) =>
  set((state) => ({
    selectedTags: state.selectedTags.includes(tag)
      ? state.selectedTags.filter((t) => t !== tag)
      : [...state.selectedTags, tag],
  })),
clearTags: () => set({ selectedTags: [] }),

// Create/Edit form
isFormOpen: false,
setFormOpen: (open) => set({ isFormOpen: open }),
editingSnippetId: null,
setEditingSnippetId: (id) => set({ editingSnippetId: id, isFormOpen: id !== null }),

// Delete confirmation
deleteSnippetId: null,
setDeleteSnippetId: (id) => set({ deleteSnippetId: id }),

// Reset all filters
resetFilters: () =>
  set({
    searchQuery: '',
    selectedTags: [],
  }),
}))