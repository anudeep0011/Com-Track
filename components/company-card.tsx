"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export interface Company {
  id: string
  name: string
  url: string
  addedAt: string
}

interface CompanyCardProps {
  company: Company
  onDelete: (id: string) => void
}

export function CompanyCard({ company, onDelete }: CompanyCardProps) {
  const handleCardClick = () => {
    window.open(company.url, "_blank", "noopener,noreferrer")
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete(company.id)
  }

  // Display URL without https:// for cleaner visual aesthetics
  const displayUrl = company.url.replace(/^https:\/\/(www\.)?/, "")

  return (
    <Card
      onClick={handleCardClick}
      className="group relative cursor-pointer overflow-hidden border border-neutral-800 bg-neutral-900/30 p-5 text-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:bg-neutral-900/60 hover:shadow-lg hover:shadow-neutral-950/80 rounded-xl"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-snug truncate group-hover:text-neutral-50 transition-colors">
            {company.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-1.5 truncate max-w-full font-mono">
            {displayUrl}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          className="h-8 w-8 text-neutral-500 hover:text-red-400 hover:bg-red-950/20 rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 transition-all duration-200 -mr-2 -mt-2 shrink-0"
          title="Delete Company"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
