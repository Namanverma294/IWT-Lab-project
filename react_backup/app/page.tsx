"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { EventCard } from "@/components/event-card"
import { FilterBar } from "@/components/filter-bar"
import { events, categories } from "@/lib/mock-data"
import { Calendar, Users, Building, Sparkles } from "lucide-react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [eventType, setEventType] = useState<"all" | "inter-college" | "intra-college">("all")
  const [category, setCategory] = useState("all")

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = eventType === "all" || event.type === eventType
      const matchesCategory = category === "all" || event.category === category

      return matchesSearch && matchesType && matchesCategory
    })
  }, [searchQuery, eventType, category])

  const stats = useMemo(() => ({
    total: events.length,
    interCollege: events.filter(e => e.type === "inter-college").length,
    intraCollege: events.filter(e => e.type === "intra-college").length,
    totalAttendees: events.reduce((sum, e) => sum + e.attendees, 0)
  }), [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Spring 2026 Events Now Live</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
              Discover Campus Events
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed max-w-2xl">
              Your hub for inter-college and intra-college events. Browse, register, and participate in workshops, competitions, cultural fests, and more.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground md:text-3xl">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Building className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground md:text-3xl">{stats.interCollege}</p>
                  <p className="text-sm text-muted-foreground">Inter-College</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Building className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground md:text-3xl">{stats.intraCollege}</p>
                  <p className="text-sm text-muted-foreground">Intra-College</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground md:text-3xl">{stats.totalAttendees.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Participants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Upcoming Events</h2>
            <p className="text-muted-foreground">Browse and register for campus events</p>
          </div>

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            eventType={eventType}
            onTypeChange={setEventType}
            category={category}
            onCategoryChange={setCategory}
            categories={categories}
          />

          {/* Events Grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
              >
                <EventCard
                  id={event.id}
                  title={event.title}
                  club={event.club}
                  date={event.date}
                  time={event.time}
                  location={event.location}
                  attendees={event.attendees}
                  type={event.type}
                  category={event.category}
                />
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="mt-12 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-4">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No events found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">EventHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              College Event Management Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
