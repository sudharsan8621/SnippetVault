'use client'

import { useEffect, useState } from 'react'
import { useCreateSnippet, useUpdateSnippet, useSnippet } from '@/hooks'
import { useUIStore } from '@/stores/uiStore'
import { LANGUAGES } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

export default function SnippetForm() {
  const { isFormOpen, setFormOpen, editingSnippetId, setEditingSnippetId } = useUIStore()
  const { data: editingSnippet } = useSnippet(editingSnippetId)
  const { mutate: createSnippet, isPending: isCreating } = useCreateSnippet()
  const { mutate: updateSnippet, isPending: isUpdating } = useUpdateSnippet()

  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [description, setDescription] = useState('')
  const [code, setCode] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [errors, setErrors] = useState<{ title?: string; language?: string; code?: string }>({})

  useEffect(() => {
    if (editingSnippet) {
      setTitle(editingSnippet.title)
      setLanguage(editingSnippet.language)
      setDescription(editingSnippet.description || '')
      setCode(editingSnippet.code)
      setIsPublic(editingSnippet.is_public)
      setTags(editingSnippet.tags?.map((t) => t.name) || [])
    }
  }, [editingSnippet])

  const handleClose = () => {
    setFormOpen(false)
    setEditingSnippetId(null)
    setTitle('')
    setLanguage('')
    setDescription('')
    setCode('')
    setIsPublic(false)
    setTags([])
    setTagInput('')
    setErrors({})
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const validate = () => {
    const newErrors: { title?: string; language?: string; code?: string } = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!language) newErrors.language = 'Language is required'
    if (!code.trim()) newErrors.code = 'Code is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const snippetData = {
      title: title.trim(),
      language,
      description: description.trim() || undefined,
      code: code.trim(),
      is_public: isPublic,
      tags,
    }

    if (editingSnippetId) {
      updateSnippet({ id: editingSnippetId, ...snippetData })
    } else {
      createSnippet(snippetData)
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <Dialog open={isFormOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingSnippetId ? 'Edit Snippet' : 'Create New Snippet'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My awesome snippet" />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Language *</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this snippet do?" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Code *</label>
            <Textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code here..." className="font-mono min-h-[200px]" />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (press Enter to add)</label>
            <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Add tags..." />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Visibility</label>
              <p className="text-sm text-gray-500">{isPublic ? 'Anyone can view' : 'Only you can view'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Private</span>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              <span className="text-sm">Public</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : editingSnippetId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}