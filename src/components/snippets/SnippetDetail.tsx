'use client'

import { useState } from 'react'
import { useSnippet, useDeleteSnippet } from '@/hooks'
import { useUIStore } from '@/stores/uiStore'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import ShareMenu from './ShareMenu'

export default function SnippetDetail() {
  const { activeSnippetId, setActiveSnippetId, setEditingSnippetId, deleteSnippetId, setDeleteSnippetId } = useUIStore()
  const { data: snippet, isLoading } = useSnippet(activeSnippetId)
  const { mutate: deleteSnippet, isPending: isDeleting } = useDeleteSnippet()

  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleCopy = async () => {
    if (!snippet) return
    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = snippet.code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleEdit = () => {
    if (snippet) setEditingSnippetId(snippet.id)
  }

  const handleDeleteConfirm = () => {
    if (deleteSnippetId) deleteSnippet(deleteSnippetId)
  }

  return (
    <>
      <Sheet open={!!activeSnippetId} onOpenChange={(open) => !open && setActiveSnippetId(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          ) : snippet ? (
            <>
              <SheetHeader>
                <SheetTitle>{snippet.title}</SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{snippet.language}</Badge>
                  <Badge variant={snippet.is_public ? 'default' : 'secondary'}>
                    {snippet.is_public ? 'Public' : 'Private'}
                  </Badge>
                </div>

                {snippet.description && <p className="text-gray-600">{snippet.description}</p>}

                <div className="relative">
                  <Button size="sm" variant="outline" className="absolute top-2 right-2 z-10" onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <pre className="bg-gray-100 rounded p-4 pt-12 overflow-x-auto">
                    <code>{snippet.code}</code>
                  </pre>
                </div>

                {snippet.tags && snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setShowShareMenu(true)}>Share</Button>
                  <Button variant="outline" onClick={handleEdit}>Edit</Button>
                  <Button variant="destructive" onClick={() => setDeleteSnippetId(snippet.id)}>Delete</Button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Snippet not found</p>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!deleteSnippetId} onOpenChange={(open) => !open && setDeleteSnippetId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Snippet</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Are you sure? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteSnippetId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {snippet && <ShareMenu snippet={snippet} open={showShareMenu} onClose={() => setShowShareMenu(false)} />}
    </>
  )
}