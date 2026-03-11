'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { SignUpInput, LoginInput } from '@/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Get current user
export function useUser() {
return useQuery({
  queryKey: ['user'],
  queryFn: authApi.getUser,
})
}

// Get current profile
export function useProfile() {
return useQuery({
  queryKey: ['profile'],
  queryFn: authApi.getProfile,
})
}

// Sign up mutation
export function useSignUp() {
const router = useRouter()
const queryClient = useQueryClient()

return useMutation({
  mutationFn: (input: SignUpInput) => authApi.signUp(input),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user'] })
    queryClient.invalidateQueries({ queryKey: ['profile'] })
    toast.success('Welcome to SnippetVault!')
    router.push('/dashboard')
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Sign up failed')
  },
})
}

// Login mutation
export function useLogin() {
const router = useRouter()
const queryClient = useQueryClient()

return useMutation({
  mutationFn: (input: LoginInput) => authApi.login(input),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user'] })
    queryClient.invalidateQueries({ queryKey: ['profile'] })
    router.push('/dashboard')
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Login failed')
  },
})
}

// Logout mutation
export function useLogout() {
const router = useRouter()
const queryClient = useQueryClient()

return useMutation({
  mutationFn: authApi.logout,
  onSuccess: () => {
    queryClient.clear()
    router.push('/login')
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Logout failed')
  },
})
}