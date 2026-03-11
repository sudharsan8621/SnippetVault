// User Profile type
export interface Profile {
id: string
username: string
display_name: string
avatar_url: string | null
created_at: string
}

// Snippet type
export interface Snippet {
id: string
user_id: string
title: string
description: string | null
language: string
code: string
is_public: boolean
created_at: string
updated_at: string
tags?: Tag[]
}

// Tag type
export interface Tag {
id: string
name: string
}

// Snippet Tag junction type
export interface SnippetTag {
snippet_id: string
tag_id: string
}

// Snippet Share type
export interface SnippetShare {
id: string
snippet_id: string
shared_with: string
created_at: string
profile?: Profile
}

// Create Snippet input type
export interface CreateSnippetInput {
title: string
description?: string
language: string
code: string
is_public: boolean
tags?: string[]
}

// Update Snippet input type
export interface UpdateSnippetInput {
id: string
title?: string
description?: string
language?: string
code?: string
is_public?: boolean
tags?: string[]
}

// Auth types
export interface SignUpInput {
email: string
password: string
display_name: string
username: string
}

export interface LoginInput {
email: string
password: string
}

// Language options (PDF specified - fixed select list)
export const LANGUAGES = [
'javascript',
'typescript',
'python',
'java',
'csharp',
'cpp',
'go',
'rust',
'ruby',
'php',
'swift',
'kotlin',
'html',
'css',
'sql',
'bash',
'json',
'yaml',
'markdown'
] as const

export type Language = typeof LANGUAGES[number]