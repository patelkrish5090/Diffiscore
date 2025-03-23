import { Link, Outlet, useRouter } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Upload, 
  Search, 
  Menu, 
  Sun, 
  Moon, 
  Book, 
  FileText, 
  BarChart2,
  Settings,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useState, useEffect } from "react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Book, label: "Subjects", path: "/subjects" },
  { icon: FileText, label: "Questions", path: "/questions" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
]

export function RootLayout() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [activeItem, setActiveItem] = useState(router.state.location.pathname)

  // Update active item when route changes
  useEffect(() => {
    setActiveItem(router.state.location.pathname)
  }, [router.state.location.pathname])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const unsubscribe = router.subscribe("onBeforeLoad", () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 768 && isSidebarOpen) {
        const sidebar = document.getElementById('sidebar')
        const menuButton = document.getElementById('menu-button')
        if (sidebar && !sidebar.contains(event.target) && !menuButton?.contains(event.target)) {
          setIsSidebarOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSidebarOpen])

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden border-b p-4 flex items-center justify-between sticky top-0 z-50 bg-background">
        <h1 className="font-bold text-xl">DiffiScore</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            id="menu-button"
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] md:h-screen relative">
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          id="sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform duration-200 ease-in-out md:translate-x-0 md:relative",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-6">
            <h1 className="font-bold text-xl">DiffiScore</h1>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = activeItem === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                  )}
                  onClick={() => {
                    setActiveItem(item.path)
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false)
                    }
                  }}
                >
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors",
                    isActive 
                      ? "text-inherit" 
                      : "text-muted-foreground group-hover:text-primary"
                  )} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}