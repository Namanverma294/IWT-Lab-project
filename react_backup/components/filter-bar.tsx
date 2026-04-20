"use client"

import { Search, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  eventType: "all" | "inter-college" | "intra-college"
  onTypeChange: (type: "all" | "inter-college" | "intra-college") => void
  category: string
  onCategoryChange: (category: string) => void
  categories: string[]
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  eventType,
  onTypeChange,
  category,
  onCategoryChange,
  categories,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-input py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
        </div>

        {/* Event Type */}
        <div className="flex rounded-lg border border-border bg-secondary/50 p-1">
          {(["all", "inter-college", "intra-college"] as const).map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                eventType === type
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type === "all" ? "All" : type === "inter-college" ? "Inter" : "Intra"}
            </button>
          ))}
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
