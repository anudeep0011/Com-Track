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
import { type Company } from "./company-card"

interface AddCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, url: string, location?: string, hiringAgency?: string) => void
  editingCompany?: Company | null
  existingLocations: string[]
  existingHiringAgencies: string[]
}

export function AddCompanyModal({
  isOpen,
  onClose,
  onSave,
  editingCompany = null,
  existingLocations,
  existingHiringAgencies,
}: AddCompanyModalProps) {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  
  // Location States
  const [locationMode, setLocationMode] = useState<"select" | "custom">("select")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [customLocation, setCustomLocation] = useState("")
  
  // Hiring Agency States
  const [hiringAgencyMode, setHiringAgencyMode] = useState<"select" | "custom">("select")
  const [selectedHiringAgency, setSelectedHiringAgency] = useState("")
  const [customHiringAgency, setCustomHiringAgency] = useState("")

  const [errors, setErrors] = useState<{
    name?: string
    url?: string
    location?: string
    hiringAgency?: string
  }>({})

  // Prefill inputs when modal is opened and editingCompany is provided
  useEffect(() => {
    if (isOpen) {
      if (editingCompany) {
        setName(editingCompany.name)
        setUrl(editingCompany.url)
        
        // Set location state
        const loc = editingCompany.location || ""
        if (loc) {
          if (existingLocations.includes(loc)) {
            setLocationMode("select")
            setSelectedLocation(loc)
            setCustomLocation("")
          } else {
            setLocationMode("custom")
            setCustomLocation(loc)
            setSelectedLocation("")
          }
        } else {
          setLocationMode("select")
          setSelectedLocation("")
          setCustomLocation("")
        }

        // Set hiring agency state
        const agency = editingCompany.hiringAgency || ""
        if (agency) {
          if (existingHiringAgencies.includes(agency)) {
            setHiringAgencyMode("select")
            setSelectedHiringAgency(agency)
            setCustomHiringAgency("")
          } else {
            setHiringAgencyMode("custom")
            setCustomHiringAgency(agency)
            setSelectedHiringAgency("")
          }
        } else {
          setHiringAgencyMode("select")
          setSelectedHiringAgency("")
          setCustomHiringAgency("")
        }
      } else {
        // Reset states for a fresh add
        setName("")
        setUrl("")
        setLocationMode("select")
        setSelectedLocation("")
        setCustomLocation("")
        setHiringAgencyMode("select")
        setSelectedHiringAgency("")
        setCustomHiringAgency("")
      }
      setErrors({})
    }
  }, [isOpen, editingCompany, existingLocations, existingHiringAgencies])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}

    if (!name.trim()) {
      newErrors.name = "Company/Job name is required"
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

    // Validate location custom input
    if (locationMode === "custom" && !customLocation.trim()) {
      newErrors.location = "Please enter a location name or click back"
    }

    // Validate hiring agency custom input
    if (hiringAgencyMode === "custom" && !customHiringAgency.trim()) {
      newErrors.hiringAgency = "Please enter a hiring agency name or click back"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const savedLocation = locationMode === "custom" ? customLocation.trim() : selectedLocation
    const savedHiringAgency = hiringAgencyMode === "custom" ? customHiringAgency.trim() : selectedHiringAgency

    onSave(
      name.trim(),
      url.trim(),
      savedLocation || undefined,
      savedHiringAgency || undefined
    )
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md border border-neutral-800 bg-neutral-950 text-neutral-50 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {editingCompany ? "Edit Opportunity" : "Add Opportunity"}
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-400">
            {editingCompany 
              ? "Modify the details of this job opportunity." 
              : "Add a new job/company and its careers page URL."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-4">
          {/* Company/Job Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Company / Job Name
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

          {/* Careers Page URL */}
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

          {/* Location Selection / Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Location
            </label>
            {locationMode === "select" ? (
              <select
                value={selectedLocation}
                onChange={(e) => {
                  if (e.target.value === "__new__") {
                    setLocationMode("custom")
                  } else {
                    setSelectedLocation(e.target.value)
                  }
                }}
                className="bg-neutral-900 border border-neutral-800 text-neutral-100 focus-visible:ring-neutral-700 focus-visible:border-neutral-700 h-10 w-full rounded-md px-3 outline-none transition-colors duration-200"
              >
                <option value="">Select Location (Optional)</option>
                {existingLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
                <option value="__new__" className="text-neutral-400 font-semibold">
                  + Add New Location...
                </option>
              </select>
            ) : (
              <div className="space-y-1.5">
                <Input
                  placeholder="Enter location (e.g. San Francisco, Remote)"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-500 h-10"
                />
                <button
                  type="button"
                  onClick={() => {
                    setLocationMode("select")
                    setSelectedLocation("")
                    setCustomLocation("")
                    if (errors.location) {
                      setErrors((prev) => ({ ...prev, location: undefined }))
                    }
                  }}
                  className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  &larr; Back to existing locations
                </button>
              </div>
            )}
            {errors.location && (
              <p className="text-xs text-red-500 font-medium">{errors.location}</p>
            )}
          </div>

          {/* Hiring Agency Selection / Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Hiring Agency
            </label>
            {hiringAgencyMode === "select" ? (
              <select
                value={selectedHiringAgency}
                onChange={(e) => {
                  if (e.target.value === "__new__") {
                    setHiringAgencyMode("custom")
                  } else {
                    setSelectedHiringAgency(e.target.value)
                  }
                }}
                className="bg-neutral-900 border border-neutral-800 text-neutral-100 focus-visible:ring-neutral-700 focus-visible:border-neutral-700 h-10 w-full rounded-md px-3 outline-none transition-colors duration-200"
              >
                <option value="">Select Hiring Agency (Optional)</option>
                {existingHiringAgencies.map((agency) => (
                  <option key={agency} value={agency}>
                    {agency}
                  </option>
                ))}
                <option value="__new__" className="text-neutral-400 font-semibold">
                  + Add New Hiring Agency...
                </option>
              </select>
            ) : (
              <div className="space-y-1.5">
                <Input
                  placeholder="Enter hiring agency name"
                  value={customHiringAgency}
                  onChange={(e) => setCustomHiringAgency(e.target.value)}
                  className="bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-500 h-10"
                />
                <button
                  type="button"
                  onClick={() => {
                    setHiringAgencyMode("select")
                    setSelectedHiringAgency("")
                    setCustomHiringAgency("")
                    if (errors.hiringAgency) {
                      setErrors((prev) => ({ ...prev, hiringAgency: undefined }))
                    }
                  }}
                  className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  &larr; Back to existing agencies
                </button>
              </div>
            )}
            {errors.hiringAgency && (
              <p className="text-xs text-red-500 font-medium">{errors.hiringAgency}</p>
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

