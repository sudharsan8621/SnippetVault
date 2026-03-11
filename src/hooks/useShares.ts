'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sharesApi } from '@/lib/api'
import { toast } from 'sonner'

// Get snippet shares
export function useShares(snippetId: string | null) {
return useQuery({
  queryKey: ['shares', snippetId],
  queryFn: () => sharesApi.getShares(snippetId!),
  enabled: !!snippetId,
})
}

// Share with user mutation
export function useShareWithUser() {
const queryClient = useQueryClient()

return useMutation({
  mutationFn: ({ snippetId, email }: { snippetId: string; email: string }) =>
    sharesApi.shareWithUser(snippetId, email),
  onSuccess: (data, variables) => {
    queryClient.invalidateQueries({ queryKey: ['shares', variables.snippetId] })
    toast.success('Snippet shared!')
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Failed to share snippet')
  },
})
}

// Remove share mutation
export function useRemoveShare() {
const queryClient = useQueryClient()

return useMutation({
  mutationFn: ({ shareId, snippetId }: { shareId: string; snippetId: string }) =>
    sharesApi.removeShare(shareId),
  onSuccess: (data, variables) => {
    queryClient.invalidateQueries({ queryKey: ['shares', variables.snippetId] })
    toast.success('Share removed!')
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Failed to remove share')
  },
})
}