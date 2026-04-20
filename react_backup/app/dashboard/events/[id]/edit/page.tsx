"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth-context"
import { events, categories, Event } from "@/lib/mock-data"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Globe, 
  Building,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Mail,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock registrations data
const mockRegistrations = [
  { id: "r1", name: "Rahul Sharma", email: "rahul.s@college.edu", registeredAt: "2026-04-01", status: "confirmed" },
  { id: "r2", name: "Priya Patel", email: "priya.p@college.edu", registeredAt: "2026-04-02", status: "confirmed" },
  { id: "r3", name: "Amit Kumar", email: "amit.k@college.edu", registeredAt: "2026-04-03", status: "pending" },
  { id: "r4", name: "Sneha Singh", email: "sneha.s@college.edu", registeredAt: "2026-04-04", status: "confirmed" },
  { id: "r5", name: "Vikram Reddy", email: "vikram.r@college.edu", registeredAt: "2026-04-05", status: "pending" },
]

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const event = events.find(e => e.id === id)

  const [activeTab, setActiveTab] = useState<"details" | "registrations">("details")
  const [formData, setFormData] = useState<Partial<Event> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        maxParticipants: event.maxParticipants,
        type: event.type,
        category: event.category,
        registrationDeadline: event.registrationDeadline,
      })
    }
  }, [event])

  if (!user || !["nr", "fc", "oc"].includes(user.role)) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20 mb-6">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-8">
              You do not have permission to edit events.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    )
  }

  if (!event || !formData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Event Not Found</h1>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      // Simulate API call
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  event.type === "inter-college" 
                    ? "bg-accent/20 text-accent" 
                    : "bg-secondary text-secondary-foreground"
                )}>
                  {event.type === "inter-college" ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Building className="h-3 w-3" />
                  )}
                  {event.type === "inter-college" ? "Inter-College" : "Intra-College"}
                </span>
                <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  {event.category}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{event.title}</h1>
              <p className="text-muted-foreground mt-1">{event.club}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-lg border border-border bg-secondary/50 p-1 mb-8 w-fit">
            <button
              onClick={() => setActiveTab("details")}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-all",
                activeTab === "details"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Event Details
            </button>
            <button
              onClick={() => setActiveTab("registrations")}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-all",
                activeTab === "registrations"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Registrations ({mockRegistrations.length})
            </button>
          </div>

          {activeTab === "details" ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Edit Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Edit Event Details</h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                        Event Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                          Category
                        </label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="maxParticipants" className="block text-sm font-medium text-foreground mb-2">
                          Max Participants
                        </label>
                        <input
                          id="maxParticipants"
                          type="number"
                          value={formData.maxParticipants}
                          onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                          className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                        <MapPin className="inline h-4 w-4 mr-2 text-accent" />
                        Location
                      </label>
                      <input
                        id="location"
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Event Stats</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Registrations</span>
                      <span className="font-semibold text-foreground">{event.attendees} / {event.maxParticipants}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${(event.attendees / event.maxParticipants) * 100}%` }}
                      />
                    </div>

                    <hr className="border-border" />

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Event Date</p>
                        <p className="font-medium text-foreground">{event.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium text-foreground">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Deadline</p>
                        <p className="font-medium text-foreground">{event.registrationDeadline}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Coordinator</h3>
                  <div className="space-y-3">
                    <p className="font-medium text-foreground">{event.coordinator.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {event.coordinator.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Registrations Tab */
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold text-foreground">Participant Registrations</h2>
                <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Participant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Registered On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockRegistrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">{registration.name}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {registration.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {registration.registeredAt}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                            registration.status === "confirmed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          )}>
                            {registration.status === "confirmed" ? "Confirmed" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {registration.status === "pending" && (
                              <button className="flex items-center gap-1.5 rounded-lg bg-accent/20 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/30 transition-colors">
                                <UserCheck className="h-3.5 w-3.5" />
                                Confirm
                              </button>
                            )}
                            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                              <Mail className="h-3.5 w-3.5" />
                              Email
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
