"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase, MapPin, Building2, ListFilter } from "lucide-react"
import { CompanyCard, type Company } from "@/components/company-card"
import { AddCompanyModal } from "@/components/add-company-modal"

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)

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

  const handleSaveCompany = (
    name: string,
    url: string,
    location?: string,
    hiringAgency?: string,
    appliedOn?: string,
    contactPerson?: string,
    status?: string,
    interviewDate?: string
  ) => {
    let updated: Company[]

    if (editingCompany) {
      // Edit existing company
      updated = companies.map((c) =>
        c.id === editingCompany.id
          ? {
              ...c,
              name,
              url,
              location: location || undefined,
              hiringAgency: hiringAgency || undefined,
              appliedOn: appliedOn || undefined,
              contactPerson: contactPerson || undefined,
              status: status || undefined,
              interviewDate: interviewDate || undefined,
            }
          : c
      )
      setEditingCompany(null)
    } else {
      // Add new company
      const newCompany: Company = {
        id: crypto.randomUUID(),
        name,
        url,
        location: location || undefined,
        hiringAgency: hiringAgency || undefined,
        appliedOn: appliedOn || undefined,
        contactPerson: contactPerson || undefined,
        status: status || undefined,
        interviewDate: interviewDate || undefined,
        addedAt: new Date().toISOString(),
      }
      updated = [newCompany, ...companies]
    }

    setCompanies(updated)
    localStorage.setItem("career_tracker_companies", JSON.stringify(updated))
  }

  const handleDeleteCompany = (id: string) => {
    const updated = companies.filter((company) => company.id !== id)
    setCompanies(updated)
    localStorage.setItem("career_tracker_companies", JSON.stringify(updated))
  }

  const handleEditClick = (company: Company) => {
    setEditingCompany(company)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCompany(null)
  }

  // Extract unique locations and agencies from current list of companies
  const existingLocations = useMemo(() => {
    const locs = companies.map((c) => c.location?.trim()).filter(Boolean) as string[]
    return Array.from(new Set(locs)).sort()
  }, [companies])

  const existingHiringAgencies = useMemo(() => {
    const agencies = companies.map((c) => c.hiringAgency?.trim()).filter(Boolean) as string[]
    return Array.from(new Set(agencies)).sort()
  }, [companies])

  // Group and sort companies: Location first (alphabetical), then Hiring Agency (alphabetical, Direct first)
  const sortedGroupedCompanies = useMemo(() => {
    const groups: { [location: string]: { [agency: string]: Company[] } } = {}

    companies.forEach((company) => {
      const loc = company.location?.trim() || "Unspecified Location"
      const agency = company.hiringAgency?.trim() || "Direct Application"

      if (!groups[loc]) {
        groups[loc] = {}
      }
      if (!groups[loc][agency]) {
        groups[loc][agency] = []
      }
      groups[loc][agency].push(company)
    })

    // Sort locations: Alphabetical, putting "Unspecified Location" at the very end
    const sortedLocations = Object.keys(groups).sort((a, b) => {
      if (a === "Unspecified Location") return 1
      if (b === "Unspecified Location") return -1
      return a.localeCompare(b)
    })

    return sortedLocations.map((loc) => {
      const agencyGroups = groups[loc]
      
      // Sort agencies: "Direct Application" first, others alphabetical
      const sortedAgencies = Object.keys(agencyGroups).sort((a, b) => {
        if (a === "Direct Application") return -1
        if (b === "Direct Application") return 1
        return a.localeCompare(b)
      })

      const agenciesList = sortedAgencies.map((agency) => {
        // Sort jobs inside each agency group by date added (newest first)
        const sortedJobs = [...agencyGroups[agency]].sort(
          (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        )
        return {
          agency,
          companies: sortedJobs,
        }
      })

      const totalJobsInLocation = agenciesList.reduce((sum, ag) => sum + ag.companies.length, 0)

      return {
        location: loc,
        totalJobs: totalJobsInLocation,
        agencies: agenciesList,
      }
    })
  }, [companies])

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
          // Grouped Display Layout
          <div className="space-y-12">
            {/* List sorting notification banner */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-900/20 border border-neutral-900 px-4 py-2.5 rounded-lg max-w-fit">
              <ListFilter className="h-3.5 w-3.5" />
              <span>Automatically sorted by <strong>Location</strong> and grouped by <strong>Hiring Agency</strong>.</span>
            </div>

            {sortedGroupedCompanies.map((locGroup) => (
              <section key={locGroup.location} className="space-y-6">
                {/* Location Heading */}
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
                  <h2 className="text-xl font-semibold text-neutral-250 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-neutral-500 shrink-0" />
                    <span>{locGroup.location}</span>
                  </h2>
                  <span className="text-xs bg-neutral-900 text-neutral-400 border border-neutral-850 px-2.5 py-0.5 rounded-full font-medium">
                    {locGroup.totalJobs} {locGroup.totalJobs === 1 ? "job" : "jobs"}
                  </span>
                </div>

                {/* Subgroups (Agencies) under this location */}
                <div className="space-y-8 pl-1 sm:pl-3">
                  {locGroup.agencies.map((agencyGroup) => (
                    <div key={agencyGroup.agency} className="space-y-4">
                      {/* Agency Subheading */}
                      <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        <span>{agencyGroup.agency}</span>
                        <span className="text-neutral-600 font-normal lowercase">
                          ({agencyGroup.companies.length} {agencyGroup.companies.length === 1 ? "job" : "jobs"})
                        </span>
                      </h3>

                      {/* Jobs list grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agencyGroup.companies.map((company) => (
                          <CompanyCard
                            key={company.id}
                            company={company}
                            onDelete={handleDeleteCompany}
                            onEdit={handleEditClick}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
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

      {/* Add/Edit Modal Dialog */}
      <AddCompanyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCompany}
        editingCompany={editingCompany}
        existingLocations={existingLocations}
        existingHiringAgencies={existingHiringAgencies}
      />
    </div>
  )
}

