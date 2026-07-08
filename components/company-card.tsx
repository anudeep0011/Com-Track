"use client"

import * as React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, MoreVertical, MapPin, Building2, ExternalLink } from "lucide-react"

export interface Company {
  id: string
  name: string
  url: string
  addedAt: string
  location?: string
  hiringAgency?: string
}

interface CompanyCardProps {
  company: Company
  onDelete: (id: string) => void
  onEdit: (company: Company) => void
}

export function CompanyCard({ company, onDelete, onEdit }: CompanyCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleCardClick = () => {
    window.open(company.url, "_blank", "noopener,noreferrer")
  }

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setMenuOpen(!menuOpen)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setMenuOpen(false)
    onEdit(company)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setMenuOpen(false)
    onDelete(company.id)
  }

  // Display URL without https:// for cleaner visual aesthetics
  const displayUrl = company.url.replace(/^https:\/\/(www\.)?/, "")

  return (
    <Card
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-visible border border-neutral-800 bg-neutral-900/30 p-5 text-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:bg-neutral-900/60 hover:shadow-lg hover:shadow-neutral-950/80 rounded-xl"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-snug truncate group-hover:text-neutral-50 transition-colors flex items-center gap-1.5">
            {company.name}
            <ExternalLink className="h-3 w-3 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-neutral-500 mt-1.5 truncate max-w-full font-mono">
            {displayUrl}
          </p>
        </div>

        {/* Three dots menu container */}
        <div className="relative shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMenuToggle}
            className="h-8 w-8 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-md transition-all duration-200 -mr-2 -mt-2"
            title="Options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {menuOpen && (
            <>
              {/* Overlay to close menu when clicking outside */}
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setMenuOpen(false)
                }}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-32 origin-top-right rounded-lg border border-neutral-800 bg-neutral-950 p-1 shadow-xl z-50 text-sm">
                <button
                  onClick={handleEditClick}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Meta tags: Location and Hiring Agency */}
      {(company.location || company.hiringAgency) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-neutral-900">
          {company.location && (
            <span 
              className="inline-flex items-center gap-1 text-xs text-neutral-400 bg-neutral-950/40 px-2 py-0.5 rounded border border-neutral-900"
              title={`Location: ${company.location}`}
            >
              <MapPin className="h-3 w-3 text-neutral-500" />
              {company.location}
            </span>
          )}
          {company.hiringAgency && (
            <span 
              className="inline-flex items-center gap-1 text-xs text-neutral-400 bg-neutral-950/40 px-2 py-0.5 rounded border border-neutral-900"
              title={`Hiring Agency: ${company.hiringAgency}`}
            >
              <Building2 className="h-3 w-3 text-neutral-500" />
              {company.hiringAgency}
            </span>
          )}
        </div>
      )}
    </Card>
  )
}

