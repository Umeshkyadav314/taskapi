"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Footer } from "@/components/footer"

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">TaskAPI</div>
          <div className="flex gap-2 md:gap-4 items-center">
            <ThemeToggle />
            <div className="flex gap-2 md:gap-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex bg-transparent">
                      Dashboard
                    </Button>
                    <Button variant="outline" size="sm" className="sm:hidden bg-transparent">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      localStorage.removeItem("token")
                      localStorage.removeItem("user")
                      setIsLoggedIn(false)
                      router.push("/")
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex bg-transparent">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Scalable REST API</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A production-ready REST API with JWT authentication, role-based access control, and full CRUD operations.
          Built with Next.js, TypeScript, and PostgreSQL.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2 text-foreground">JWT Authentication</h3>
            <p className="text-muted-foreground">Secure token-based authentication with password hashing</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Role-Based Access</h3>
            <p className="text-muted-foreground">Admin and user roles with permission-based endpoints</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Task Management</h3>
            <p className="text-muted-foreground">Full CRUD operations with validation and error handling</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Next.js 16",
            "TypeScript",
            "React 19",
            "PostgreSQL",
            "JWT Auth",
            "REST API",
            "Tailwind CSS",
            "Validation",
          ].map((tech) => (
            <div key={tech} className="bg-card border border-border rounded p-4 text-center text-foreground">
              {tech}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
