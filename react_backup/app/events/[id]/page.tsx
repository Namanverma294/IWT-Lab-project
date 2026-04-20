"use client"

import { use } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth-context"
import { events } from "@/lib/mock-data"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  Building, 
  ArrowLeft,
  Trophy,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()
  const event = events.find(e => e.id === id)

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
              <AlertTriangle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The event you are looking for does not exist or has been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Check access for intra-college events
  const isIntraCollege = event.type === "intra-college"
  const hasAccess = !isIntraCollege || user !== null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          {/* Access Restriction Banner */}
          {isIntraCollege && !hasAccess && (
            <div className="mb-8 flex items-center gap-4 rounded-xl border border-accent/30 bg-accent/10 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
                <Lock className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Intra-College Event</p>
                <p className="text-sm text-muted-foreground">
                  Sign in with your college account to view full details and register.
                </p>
              </div>
              <Link
                href="/login"
                className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
              >
                Sign In
              </Link>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
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

                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
                  {event.title}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">{event.club}</p>
              </div>

              {/* Description */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">About This Event</h2>
                <p className={cn(
                  "text-muted-foreground leading-relaxed",
                  !hasAccess && "blur-sm select-none"
                )}>
                  {event.description}
                </p>
              </div>

              {/* Rules */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Rules & Guidelines
                </h2>
                <ul className={cn(
                  "space-y-3",
                  !hasAccess && "blur-sm select-none"
                )}>
                  {event.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-accent/70 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prizes */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Prizes
                </h2>
                <ul className={cn(
                  "space-y-3",
                  !hasAccess && "blur-sm select-none"
                )}>
                  {event.prizes.map((prize, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                        {index + 1}
                      </span>
                      <span>{prize}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Requirements</h2>
                <ul className={cn(
                  "space-y-2",
                  !hasAccess && "blur-sm select-none"
                )}>
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info Card */}
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">Event Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{event.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Clock className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium text-foreground">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <MapPin className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Users className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Participants</p>
                      <p className="font-medium text-foreground">
                        {event.attendees} / {event.maxParticipants}
                      </p>
                    </div>
                  </div>

                  <hr className="border-border" />

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Registration Deadline</p>
                    <p className="font-medium text-accent">{event.registrationDeadline}</p>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  disabled={!hasAccess}
                  className={cn(
                    "mt-6 w-full rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    hasAccess
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {hasAccess ? "Register Now" : "Sign in to Register"}
                </button>

                {/* Coordinator Info */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-4">Event Coordinator</h4>
                  <div className={cn(
                    "space-y-3",
                    !hasAccess && "blur-sm select-none"
                  )}>
                    <p className="font-medium text-foreground">{event.coordinator.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{event.coordinator.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{event.coordinator.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              <span className="font-semibold">EventHub</span>
            </div>
            <p className="text-sm text-muted-foreground">College Event Management</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
