"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth-context"
import { categories } from "@/lib/mock-data"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Globe, 
  Building,
  Plus,
  X,
  Save
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CreateEventPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "",
    type: "inter-college" as "inter-college" | "intra-college",
    category: categories[0],
    registrationDeadline: "",
  })

  const [rules, setRules] = useState<string[]>([""])
  const [prizes, setPrizes] = useState<string[]>([""])
  const [requirements, setRequirements] = useState<string[]>([""])

  if (!user || !["nr", "fc", "oc"].includes(user.role)) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-8">
              You do not have permission to create events.
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    console.log("Event data:", { ...formData, rules, prizes, requirements })
    router.push("/dashboard")
  }

  const addListItem = (
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList([...list, ""])
  }

  const updateListItem = (
    index: number, 
    value: string, 
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newList = [...list]
    newList[index] = value
    setList(newList)
  }

  const removeListItem = (
    index: number, 
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.length > 1) {
      setList(list.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Create New Event</h1>
            <p className="text-muted-foreground mt-2">Fill in the details to create a new event</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Basic Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Event Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter event title"
                    className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your event..."
                    className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Event Type *
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "inter-college" })}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-3 rounded-lg border p-4 transition-all",
                        formData.type === "inter-college"
                          ? "border-accent bg-accent/10"
                          : "border-border bg-secondary/50 hover:bg-secondary"
                      )}
                    >
                      <Globe className={cn(
                        "h-5 w-5",
                        formData.type === "inter-college" ? "text-accent" : "text-muted-foreground"
                      )} />
                      <div className="text-left">
                        <p className={cn(
                          "font-medium",
                          formData.type === "inter-college" ? "text-accent" : "text-foreground"
                        )}>Inter-College</p>
                        <p className="text-xs text-muted-foreground">Visible to all users</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "intra-college" })}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-3 rounded-lg border p-4 transition-all",
                        formData.type === "intra-college"
                          ? "border-accent bg-accent/10"
                          : "border-border bg-secondary/50 hover:bg-secondary"
                      )}
                    >
                      <Building className={cn(
                        "h-5 w-5",
                        formData.type === "intra-college" ? "text-accent" : "text-muted-foreground"
                      )} />
                      <div className="text-left">
                        <p className={cn(
                          "font-medium",
                          formData.type === "intra-college" ? "text-accent" : "text-foreground"
                        )}>Intra-College</p>
                        <p className="text-xs text-muted-foreground">College students only</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date & Location */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Date & Location</h2>
              
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                    <Calendar className="inline h-4 w-4 mr-2 text-accent" />
                    Event Date *
                  </label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                    <Clock className="inline h-4 w-4 mr-2 text-accent" />
                    Event Time *
                  </label>
                  <input
                    id="time"
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                    <MapPin className="inline h-4 w-4 mr-2 text-accent" />
                    Location *
                  </label>
                  <input
                    id="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter venue"
                    className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-foreground mb-2">
                    Registration Deadline *
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    required
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-foreground mb-2">
                    <Users className="inline h-4 w-4 mr-2 text-accent" />
                    Max Participants *
                  </label>
                  <input
                    id="maxParticipants"
                    type="number"
                    required
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                    placeholder="Enter max participants"
                    className="w-full rounded-lg border border-border bg-input py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Rules & Guidelines</h2>
              <div className="space-y-3">
                {rules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => updateListItem(index, e.target.value, rules, setRules)}
                      placeholder={`Rule ${index + 1}`}
                      className="flex-1 rounded-lg border border-border bg-input py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem(index, rules, setRules)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem(rules, setRules)}
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Add Rule
                </button>
              </div>
            </div>

            {/* Prizes */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Prizes</h2>
              <div className="space-y-3">
                {prizes.map((prize, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={prize}
                      onChange={(e) => updateListItem(index, e.target.value, prizes, setPrizes)}
                      placeholder={`Prize ${index + 1}`}
                      className="flex-1 rounded-lg border border-border bg-input py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem(index, prizes, setPrizes)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem(prizes, setPrizes)}
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Add Prize
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Requirements</h2>
              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => updateListItem(index, e.target.value, requirements, setRequirements)}
                      placeholder={`Requirement ${index + 1}`}
                      className="flex-1 rounded-lg border border-border bg-input py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem(index, requirements, setRequirements)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem(requirements, setRequirements)}
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Add Requirement
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/dashboard"
                className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <Save className="h-4 w-4" />
                Create Event
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
