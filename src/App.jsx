import { RouterProvider, createRouter, createRootRoute, createRoute } from "@tanstack/react-router"
import { RootLayout } from "./components/layout/root-layout"
import { DashboardPage } from "./pages/dashboard"
import { UploadPage } from "./pages/upload"
import { SearchPage } from "./pages/search"
import { SubjectsPage } from "./pages/subjects"
import { QuestionsPage } from "./pages/questions"
import { AnalyticsPage } from "./pages/analytics"
import { SettingsPage } from "./pages/settings"
import { Toaster } from "./components/ui/sonner"
import { ThemeProvider } from "./components/theme-provider"
import { AnimatePresence } from "framer-motion"

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
})

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: UploadPage,
})

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchPage,
})

const subjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subjects",
  component: SubjectsPage,
})

const questionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/questions",
  component: QuestionsPage,
})

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: AnalyticsPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  uploadRoute,
  searchRoute,
  subjectsRoute,
  questionsRoute,
  analyticsRoute,
  settingsRoute,
])

const router = createRouter({ routeTree })

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <AnimatePresence mode="wait">
        <RouterProvider router={router} />
      </AnimatePresence>
      <Toaster position="top-right" expand={true} closeButton richColors />
    </ThemeProvider>
  )
}

export default App