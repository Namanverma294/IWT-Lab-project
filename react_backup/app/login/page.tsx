"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Navigation } from "@/components/navigation"
import { Calendar, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User, GraduationCap, Users, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const roleInfo = [
  {
    role: "student",
    label: "Student / HOD",
    description: "View event listings and details",
    icon: GraduationCap,
    email: "student@college.edu"
  },
  {
    role: "nr",
    label: "Nodal Representative",
    description: "Manage club events and registrations",
    icon: Users,
    email: "nr.techclub@college.edu"
  },
  {
    role: "fc",
    label: "Faculty Coordinator",
    description: "Oversee club activities and approvals",
    icon: User,
    email: "fc.cultural@college.edu"
  },
  {
    role: "oc",
    label: "Event Coordinator",
    description: "Full access to assigned event management",
    icon: Shield,
    email: "oc.hackathon@college.edu"
  }
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const success = await login(email, password)
    
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Try one of the demo accounts below.")
    }
  }

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("demo123")
    const success = await login(demoEmail, "demo123")
    if (success) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            {/* Left Column - Info */}
            <div className="hidden lg:block">
              <div className="sticky top-32">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">EventHub</h1>
                    <p className="text-sm text-muted-foreground">College Event Management</p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold tracking-tight mb-4 text-balance">
                  Sign in to manage your events
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Access your dashboard to view, create, and manage campus events. 
                  Your permissions depend on your assigned role.
                </p>

                {/* Role Cards */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    User Roles
                  </p>
                  {roleInfo.map((info) => {
                    const Icon = info.icon
                    return (
                      <button
                        key={info.role}
                        onClick={() => {
                          setSelectedRole(info.role)
                          handleDemoLogin(info.email)
                        }}
                        className={cn(
                          "w-full flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50 transition-all text-left hover:border-accent/50 hover:bg-card",
                          selectedRole === info.role && "border-accent bg-card"
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <Icon className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{info.label}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{info.description}</p>
                          <code className="text-xs text-accent mt-2 block font-mono">{info.email}</code>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="mx-auto w-full max-w-md lg:mx-0">
              <div className="lg:hidden mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold">EventHub</span>
                </div>
                <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                <p className="text-muted-foreground">Sign in to your account to continue</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="hidden lg:block mb-6">
                  <h3 className="text-xl font-semibold">Sign in</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your credentials to access your dashboard
                  </p>
                </div>

                {error && (
                  <div className="mb-6 flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@college.edu"
                        className="w-full rounded-lg border border-border bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full rounded-lg border border-border bg-input py-3 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border bg-input text-accent focus:ring-accent"
                      />
                      <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-accent hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Mobile Demo Accounts */}
                <div className="lg:hidden mt-8 pt-6 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-4">
                    Quick Demo Login
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {roleInfo.map((info) => (
                      <button
                        key={info.role}
                        onClick={() => handleDemoLogin(info.email)}
                        className="text-left p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <p className="text-xs font-medium text-foreground">{info.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{info.email}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  {"Don't have access?"}{" "}
                  <Link href="/contact" className="text-accent hover:underline">
                    Contact admin
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
