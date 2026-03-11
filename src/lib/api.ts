import { createClient } from '@/lib/supabase/client'
import {
Profile,
Snippet,
Tag,
SnippetShare,
CreateSnippetInput,
UpdateSnippetInput,
SignUpInput,
LoginInput
} from '@/types'

// ============ AUTH API ============

export const authApi = {
// Sign Up
async signUp({ email, password, display_name, username }: SignUpInput) {
  const supabase = createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username,
        display_name,
      })

    if (profileError) throw profileError
  }

  return authData
},

// Login
async login({ email, password }: LoginInput) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
},

// Logout
async logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
},

// Get Current User
async getUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
},

// Get Current Profile
async getProfile() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data as Profile
},
}

// ============ SNIPPETS API ============

export const snippetsApi = {
// Get User's Snippets
async getMySnippets() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  // Add empty tags array
  const snippets = data.map(snippet => ({
    ...snippet,
    tags: []
  }))

  return snippets as Snippet[]
},

// Get Single Snippet
async getSnippet(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('snippets')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  if (error) throw error

  return {
    ...data,
    tags: [],
    profile: data.profiles
  } as Snippet & { profile: Profile }
},

// Create Snippet
async createSnippet(input: CreateSnippetInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: snippet, error: snippetError } = await supabase
    .from('snippets')
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description,
      language: input.language,
      code: input.code,
      is_public: input.is_public,
    })
    .select()
    .single()

  if (snippetError) throw snippetError

  return snippet as Snippet
},

// Update Snippet
async updateSnippet({ id, ...input }: UpdateSnippetInput) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('snippets')
    .update({
      title: input.title,
      description: input.description,
      language: input.language,
      code: input.code,
      is_public: input.is_public,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data as Snippet
},

// Delete Snippet
async deleteSnippet(id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('snippets')
    .delete()
    .eq('id', id)

  if (error) throw error
},
}

// ============ SHARES API ============

export const sharesApi = {
// Get Snippet Shares
async getShares(snippetId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('snippet_shares')
    .select('*, profiles:shared_with(*)')
    .eq('snippet_id', snippetId)

  if (error) throw error

  return data.map(share => ({
    ...share,
    profile: share.profiles
  })) as SnippetShare[]
},

// Share with User
async shareWithUser(snippetId: string, username: string) {
  const supabase = createClient()

  // Find user by username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    throw new Error('No account found with that username')
  }

  // Check if sharing with self
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.id === profile.id) {
    throw new Error('You cannot share a snippet with yourself')
  }

  // Create share
  const { data, error } = await supabase
    .from('snippet_shares')
    .insert({
      snippet_id: snippetId,
      shared_with: profile.id,
    })
    .select()
    .single()

  if (error) throw error
  return data as SnippetShare
},

// Remove Share
async removeShare(shareId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('snippet_shares')
    .delete()
    .eq('id', shareId)

  if (error) throw error
},
}

// ============ TAGS API ============

export const tagsApi = {
// Get All Tags
async getAllTags() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) throw error
  return data as Tag[]
},
}