"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Calendar, LayoutDashboard, LogIn, Menu, X } from "lucide-react"
import { useState } from "react"

const navItems = [
  { label: "EVENTS", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "FAQ", href: "/faq" },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-transform group-hover:scale-105">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">EventHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-foreground",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogIn className="h-4 w-4" />
            LOGIN
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-border" />
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              LOGIN
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
