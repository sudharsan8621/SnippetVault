'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { snippetsApi } from '@/lib/api'
import { CreateSnippetInput, UpdateSnippetInput } from '@/types'
import { toast } from 'sonner'
import { useUIStore } from '@/stores/uiStore'

// Get user's snippets
export function useSnippets() {
return useQuery({
  queryKey: ['snippets'],
  queryFn: snippetsApi.getMySnippets,
})
}

// Get single snippet
export function useSnippet(id: string | null) {
return useQuery({
  queryKey: ['snippet', id],
  queryFn: () => snippetsApi.getSnippet(id!),
  enabled: !!id,
})
}

// Create snippet mutation
export function useCreateSnippet() {
const queryClient = useQueryClient()
const { setFormOpen } = useUIStore()

return useMutation({
  mutationFn: (input: CreateSnippetInput) => snippetsApi.createSnippet(input),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['snippets'] })
    setFormOpen(false)
    toast.success('Snippet created!')
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Failed to create snippet')
  },
})
}

// Update snippet mutation
export function useUpdateSnippet() {
const queryClient = useQueryClient()
const { setFormOpen, setEditingSnippetId } = useUIStore()

return useMutation({
  mutationFn: (input: UpdateSnippetInput) => snippetsApi.updateSnippet(input),
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['snippets'] })
    queryClient.invalidateQueries({ queryKey: ['snippet', data.id] })
    setFormOpen(false)
    setEditingSnippetId(null)
    toast.success('Snippet updated!')
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Failed to update snippet')
  },
})
}

// Delete snippet mutation (with optimistic update)
export function useDeleteSnippet() {
const queryClient = useQueryClient()
const { setActiveSnippetId, setDeleteSnippetId } = useUIStore()

return useMutation({
  mutationFn: (id: string) => snippetsApi.deleteSnippet(id),
  onMutate: async (id) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['snippets'] })

    // Snapshot previous value
    const previousSnippets = queryClient.getQueryData(['snippets'])

    // Optimistically remove from list
    queryClient.setQueryData(['snippets'], (old: any) =>
      old?.filter((snippet: any) => snippet.id !== id)
    )

    return { previousSnippets }
  },
  onSuccess: () => {
    setActiveSnippetId(null)
    setDeleteSnippetId(null)
    toast.success('Snippet deleted!')
  },
  onError: (error: Error, id, context) => {
    // Rollback on error
    queryClient.setQueryData(['snippets'], context?.previousSnippets)
    toast.error(error.message || 'Failed to delete snippet', {
      action: {
        label: 'Retry',
        onClick: () => snippetsApi.deleteSnippet(id),
      },
    })
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['snippets'] })
  },
})
}