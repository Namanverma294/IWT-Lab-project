"use client"

import Link from "next/link"
import { Calendar, MapPin, Users, Clock, Globe, Building } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventCardProps {
  id: string
  title: string
  club: string
  date: string
  time: string
  location: string
  attendees: number
  type: "inter-college" | "intra-college"
  category: string
  image?: string
}

export function EventCard({
  id,
  title,
  club,
  date,
  time,
  location,
  attendees,
  type,
  category,
}: EventCardProps) {
  return (
    <Link href={`/events/${id}`} className="group block">
      <article className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/50 hover:bg-card/80">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  type === "inter-college" 
                    ? "bg-accent/20 text-accent" 
                    : "bg-secondary text-secondary-foreground"
                )}>
                  {type === "inter-college" ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Building className="h-3 w-3" />
                  )}
                  {type === "inter-college" ? "Inter-College" : "Intra-College"}
                </span>
                <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  {category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{club}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-accent/70" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-accent/70" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-accent/70" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-accent/70" />
              <span>{attendees} attending</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              View Details
            </span>
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
