"use client"

import * as React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Trash2,
  Edit2,
  MoreVertical,
  MapPin,
  Building2,
  ExternalLink,
  Calendar,
  Sparkles,
  User,
} from "lucide-react"

export interface Company {
  id: string
  name: string
  url: string
  addedAt: string
  location?: string
  hiringAgency?: string
  appliedOn?: string
  contactPerson?: string
  status?: string
  interviewDate?: string
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

  // Format date helper (e.g. "2026-07-08" -> "Jul 8, 2026")
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "Interested":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20"
      case "Applied":
        return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
      case "Interviewing":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
      case "Offered":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 animate-pulse"
      case "Rejected":
        return "text-rose-450 bg-rose-500/10 border-rose-500/20"
      default:
        return "text-neutral-400 bg-neutral-900 border-neutral-850"
    }
  }

  return (
    <Card
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-visible border border-neutral-800 bg-neutral-900/30 p-6 text-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:bg-neutral-900/60 hover:shadow-lg hover:shadow-neutral-950/80 rounded-xl"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-snug truncate group-hover:text-neutral-50 transition-colors flex items-center gap-1.5">
            {company.name}
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-neutral-500 mt-1 truncate max-w-full font-mono">
            {displayUrl}
          </p>
        </div>

        {/* Status Badge + Three dots menu container */}
        <div className="flex items-center gap-2 shrink-0">
          {company.status && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getStatusStyles(
                company.status
              )}`}
            >
              {company.status}
            </span>
          )}

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMenuToggle}
              className="h-8 w-8 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-md transition-all duration-200"
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
      </div>

      {/* Meta tags: Location and Hiring Agency */}
      {(company.location || company.hiringAgency) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-neutral-900/60">
          {company.location && (
            <span
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-950/40 px-2.5 py-1 rounded border border-neutral-900"
              title={`Location: ${company.location}`}
            >
              <MapPin className="h-3 w-3 text-neutral-500" />
              {company.location}
            </span>
          )}
          {company.hiringAgency && (
            <span
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-950/40 px-2.5 py-1 rounded border border-neutral-900"
              title={`Hiring Agency: ${company.hiringAgency}`}
            >
              <Building2 className="h-3 w-3 text-neutral-500" />
              {company.hiringAgency}
            </span>
          )}
        </div>
      )}

      {/* Extended details: Applied On, Contact Person, Interview Date */}
      {(company.appliedOn || company.contactPerson || company.interviewDate) && (
        <div className="mt-4 pt-3 border-t border-neutral-900/60 space-y-2 text-xs text-neutral-400">
          {company.appliedOn && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
              <span>
                Applied on:{" "}
                <strong className="text-neutral-200 font-medium">
                  {formatDate(company.appliedOn)}
                </strong>
              </span>
            </div>
          )}
          {company.interviewDate && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>
                Interview date:{" "}
                <strong className="text-cyan-300 font-medium">
                  {formatDate(company.interviewDate)}
                </strong>
              </span>
            </div>
          )}
          {company.contactPerson && (
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
              <span>
                Contacted to:{" "}
                <strong className="text-neutral-200 font-medium">
                  {company.contactPerson}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}


