'use client'

import { useState, useRef } from 'react'
import { Snippet } from '@/types'
import { useShares, useShareWithUser, useRemoveShare } from '@/hooks'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { toPng } from 'html-to-image'

interface ShareMenuProps {
  snippet: Snippet
  open: boolean
  onClose: () => void
}

export default function ShareMenu({ snippet, open, onClose }: ShareMenuProps) {
  const { data: shares } = useShares(snippet.id)
  const { mutate: shareWithUser, isPending: isSharing } = useShareWithUser()
  const { mutate: removeShare } = useRemoveShare()

  const [email, setEmail] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/s/${snippet.id}` : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleShareWithUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    shareWithUser({ snippetId: snippet.id, email: email.trim() }, { onSuccess: () => setEmail('') })
  }

  const handleExportImage = async () => {
    if (!codeRef.current) return
    setIsExporting(true)
    try {
      const dataUrl = await toPng(codeRef.current, { backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.download = `${snippet.title}.png`
      link.href = dataUrl
      link.click()
      toast.success('Image exported!')
    } catch {
      toast.error('Failed to export')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Share Snippet</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Public URL</h3>
            {snippet.is_public ? (
              <div className="flex gap-2">
                <Input value={publicUrl} readOnly className="text-sm" />
                <Button onClick={handleCopyLink}>{linkCopied ? 'Copied!' : 'Copy'}</Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded">Make snippet public to share via URL.</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Share with Users</h3>
            <form onSubmit={handleShareWithUser} className="flex gap-2 mb-4">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter username" />
              <Button type="submit" disabled={isSharing}>{isSharing ? 'Sharing...' : 'Share'}</Button>
            </form>
            {shares && shares.length > 0 && (
              <div className="space-y-2">
                {shares.map((share) => (
                  <div key={share.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{share.profile?.display_name}</span>
                    <Button size="sm" variant="destructive" onClick={() => removeShare({ shareId: share.id, snippetId: snippet.id })}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Export as Image</h3>
            <Button onClick={handleExportImage} disabled={isExporting} className="w-full">
              {isExporting ? 'Exporting...' : 'Download PNG'}
            </Button>
          </div>
        </div>

        {/* Hidden element for image export */}
        <div className="absolute left-[-9999px]">
          <div ref={codeRef} className="p-6 bg-white" style={{ width: '600px' }}>
            <h2 className="text-lg font-bold mb-2">{snippet.title}</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm">{snippet.code.split('\n').slice(0, 50).join('\n')}</pre>
            <p className="text-center text-gray-400 text-sm mt-4">Created with SnippetVault</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}