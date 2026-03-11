# SnippetVault

A public code snippet manager built for developers to save, organize, search, and share reusable code snippets.

## Live Demo

🔗 [https://snippet-vault-your-url.vercel.app](https://snippet-vault-your-url.vercel.app)

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** TailwindCSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **State Management:**
  - Server State: TanStack Query v5
  - UI State: Zustand
- **Image Export:** html-to-image

## Features

- ✅ Email/Password Authentication
- ✅ Create, Edit, Delete Snippets
- ✅ Public/Private Snippet Toggle
- ✅ Search Snippets (Debounced)
- ✅ Tag Filtering
- ✅ Share via Public URL
- ✅ Share with Specific Users
- ✅ Export Snippet as PNG Image
- ✅ Copy to Clipboard
- ✅ Public Profile Page (/u/[username])
- ✅ Public Snippet Page (/s/[id])
- ✅ Responsive Design (Desktop/Tablet/Mobile)

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/sudharsan8621/SnippetVault.git
cd SnippetVault



2. Install Dependencies
npm install



3. Environment Variables
Create .env.local file in root directory:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


4. Run Development Server
npm run dev


Open http://localhost:3000

Supabase Configuration
Database Tables
profiles - User profiles (extends auth.users)
snippets - Code snippets storage
tags - Tag labels
snippet_tags - Junction table for snippet-tag relationship
snippet_shares - Sharing permissions
Row Level Security (RLS)
All tables have RLS enabled:

Users can only CRUD their own snippets
Public snippets visible to everyone
Shared snippets visible to shared users
Project Structure

src/
├── app/
│   ├── (auth)/login, signup
│   ├── dashboard/
│   ├── s/[id]/          # Public snippet page
│   └── u/[username]/    # Public profile page
├── components/
│   ├── ui/              # shadcn components
│   └── snippets/        # Snippet components
├── hooks/               # TanStack Query hooks
├── lib/
│   ├── api.ts           # API functions
│   └── supabase/        # Supabase clients
├── stores/              # Zustand stores
└── types/               # TypeScript types


Architectural Decisions
TanStack Query for Server State - Automatic caching, background refetching, optimistic updates
Zustand for UI State - Lightweight, simple API for filters, modals, active states
Supabase RLS - Database-level security instead of API middleware
shadcn/ui - Customizable, accessible components
Known Trade-offs
Tags feature simplified (no tag management UI)
Syntax highlighting uses basic styling (not full Prism/Shiki)
Image export limited to 50 lines
Author
Built by [Your Name] for WeframeTech Frontend Internship Assignment.

