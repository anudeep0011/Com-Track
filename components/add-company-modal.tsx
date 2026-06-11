"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, url: string) => void
}

export function AddCompanyModal({ isOpen, onClose, onSave }: AddCompanyModalProps) {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({})

  // Reset inputs and errors when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setName("")
      setUrl("")
      setErrors({})
    }
  }, [isOpen])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { name?: string; url?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Company name is required"
    }

    if (!url.trim()) {
      newErrors.url = "URL is required"
    } else if (!url.startsWith("https://")) {
      newErrors.url = "URL must start with https://"
    } else {
      try {
        new URL(url)
      } catch {
        newErrors.url = "Please enter a valid URL (e.g. https://careers.company.com)"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(name.trim(), url.trim())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md border border-neutral-800 bg-neutral-950 text-neutral-50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Add Company</DialogTitle>
          <DialogDescription className="text-sm text-neutral-400">
            Add a company and their careers page URL to track.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Company Name
            </label>
            <Input
              id="name"
              placeholder="e.g. Google"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-neutral-700 focus-visible:border-neutral-700 h-10"
              autoFocus
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="url" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Careers Page URL
            </label>
            <Input
              id="url"
              placeholder="https://careers.google.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-invalid={!!errors.url}
              className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-neutral-700 focus-visible:border-neutral-700 h-10"
            />
            {errors.url && (
              <p className="text-xs text-red-500 font-medium">{errors.url}</p>
            )}
          </div>

          <DialogFooter className="pt-4 flex flex-row items-center justify-end gap-2 border-t border-neutral-900">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200 transition-colors h-10 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-950 font-semibold shadow-sm transition-colors h-10 px-4"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
