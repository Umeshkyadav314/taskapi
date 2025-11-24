export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-primary mb-4">TaskAPI</h3>
            <p className="text-sm text-muted-foreground">
              A production-ready REST API with JWT authentication and role-based access control.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#features" className="text-muted-foreground hover:text-foreground transition">
                  Features
                </a>
              </li>
              <li>
                <a href="/#tech-stack" className="text-muted-foreground hover:text-foreground transition">
                  Tech Stack
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition">
                  API Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition">
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} TaskAPI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition">
              Twitter
            </a>
            <a href="#" className="hover:text-foreground transition">
              GitHub
            </a>
            <a href="#" className="hover:text-foreground transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
