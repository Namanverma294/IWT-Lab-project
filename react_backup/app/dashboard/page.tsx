"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth-context"
import { events } from "@/lib/mock-data"
import { 
  Calendar, 
  Users, 
  Globe, 
  Building, 
  Plus,
  Eye,
  Edit,
  MoreVertical,
  TrendingUp,
  Clock,
  LogOut,
  Settings,
  Bell
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student": return "Student"
      case "hod": return "Head of Department"
      case "nr": return "Nodal Representative"
      case "fc": return "Faculty Coordinator"
      case "oc": return "Event Coordinator"
      default: return "User"
    }
  }

  const canCreateEvents = ["nr", "fc", "oc"].includes(user.role)
  const canManageEvents = ["nr", "fc", "oc"].includes(user.role)

  // Filter events based on user role
  const userEvents = user.role === "oc" 
    ? events.filter(e => user.assignedEvents?.includes(e.id))
    : events.filter(e => e.club === user.club)

  const stats = {
    totalEvents: canManageEvents ? userEvents.length : events.length,
    interCollege: (canManageEvents ? userEvents : events).filter(e => e.type === "inter-college").length,
    intraCollege: (canManageEvents ? userEvents : events).filter(e => e.type === "intra-college").length,
    totalParticipants: (canManageEvents ? userEvents : events).reduce((sum, e) => sum + e.attendees, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-8">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Welcome back,</p>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{user.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                  {getRoleLabel(user.role)}
                </span>
                {user.club && (
                  <span className="text-sm text-muted-foreground">{user.club}</span>
                )}
                {user.department && (
                  <span className="text-sm text-muted-foreground">{user.department}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors">
                <Settings className="h-5 w-5 text-muted-foreground" />
              </button>
              <button 
                onClick={() => {
                  logout()
                  router.push("/")
                }}
                className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 hover:bg-secondary transition-colors"
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Logout</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          {canCreateEvents && (
            <div className="mb-8">
              <Link
                href="/dashboard/create-event"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create New Event
              </Link>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {canManageEvents ? "Your Events" : "Total Events"}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.totalEvents}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">+2</span>
                <span>from last month</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inter-College</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.interCollege}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Globe className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                <span>Open to all colleges</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Intra-College</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.intraCollege}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Building className="h-6 w-6 text-foreground" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                <span>Internal events only</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.totalParticipants.toLocaleString()}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">+15%</span>
                <span>engagement</span>
              </div>
            </div>
          </div>

          {/* Events Table */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                {canManageEvents ? "Managed Events" : "All Events"}
              </h2>
              <Link
                href="/"
                className="text-sm text-accent hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Participants
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
                  {(canManageEvents ? userEvents : events.slice(0, 5)).map((event) => (
                    <tr key={event.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{event.club}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
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
                          {event.type === "inter-college" ? "Inter" : "Intra"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {event.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${(event.attendees / event.maxParticipants) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {event.attendees}/{event.maxParticipants}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/events/${event.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Link>
                          {canManageEvents && (
                            <Link
                              href={`/dashboard/events/${event.id}/edit`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                            >
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Link>
                          )}
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(canManageEvents ? userEvents : events).length === 0 && (
              <div className="py-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
