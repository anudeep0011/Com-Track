"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase } from "lucide-react"
import { CompanyCard, type Company } from "@/components/company-card"
import { AddCompanyModal } from "@/components/add-company-modal"

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Hydration handling and loading from localStorage
  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem("career_tracker_companies")
    if (stored) {
      try {
        setCompanies(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse stored companies", e)
      }
    }
  }, [])

  const handleAddCompany = (name: string, url: string) => {
    const newCompany: Company = {
      id: crypto.randomUUID(),
      name,
      url,
      addedAt: new Date().toISOString(),
    }
    const updated = [newCompany, ...companies]
    setCompanies(updated)
    localStorage.setItem("career_tracker_companies", JSON.stringify(updated))
  }

  const handleDeleteCompany = (id: string) => {
    const updated = companies.filter((company) => company.id !== id)
    setCompanies(updated)
    localStorage.setItem("career_tracker_companies", JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-neutral-250">
      {/* Glassmorphic Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-neutral-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-neutral-900 border border-neutral-800 p-2 rounded-lg text-neutral-100 shadow-inner">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 via-neutral-100 to-neutral-400">
              Career Tracker
            </span>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-neutral-100 hover:bg-neutral-200 text-neutral-950 font-semibold shadow-sm transition-all duration-200 gap-1.5 rounded-lg h-9 px-4"
          >
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!isMounted ? (
          // Skeleton Loading State during Client-side Hydration
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 border border-neutral-900 bg-neutral-900/10 rounded-xl animate-pulse flex flex-col justify-between p-5"
              >
                <div className="space-y-3">
                  <div className="h-5 bg-neutral-900 rounded w-1/2" />
                  <div className="h-3 bg-neutral-900 rounded w-3/4" />
                </div>
                <div className="h-3 bg-neutral-900 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          // Custom Polished Empty State
          <div className="max-w-md mx-auto my-16 text-center border border-dashed border-neutral-800 bg-neutral-900/10 rounded-2xl p-10 flex flex-col items-center shadow-sm">
            <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-full text-neutral-500 mb-5">
              <Briefcase className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-neutral-200 mb-2">No companies added yet</h2>
            <p className="text-sm text-neutral-400 max-w-xs mb-6 leading-relaxed">
              Start tracking your career opportunities by adding the career page URLs of companies you&apos;re interested in.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800 font-medium transition-all duration-200 gap-1.5 h-9 px-4 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Add your first company
            </Button>
          </div>
        ) : (
          // Responsive Card Grid (3 columns desktop, 2 tablet, 1 mobile)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onDelete={handleDeleteCompany}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 bg-neutral-950 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-neutral-600">
          Career Tracker &copy; {new Date().getFullYear()} &bull; Built with Next.js, Tailwind CSS &amp; shadcn/ui
        </div>
      </footer>

      {/* Modal Dialog */}
      <AddCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCompany}
      />
    </div>
  )
}
