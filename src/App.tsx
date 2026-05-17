import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
import { Route, Switch, Router as WouterRouter } from "wouter";

import { TooltipProvider } from "./components/ui/tooltip";
import { ADMIN_BASE, ADMIN_LOGIN_PATH } from "./constants/paths";
import { ThemeProvider } from "./providers/theme-provider";
import { store } from "./store";

// 1. Static Import for Critical Initial Views (Keep home page fast & immediate)
import Home from "./features/portfolio/pages/Home";
import NotFound from "./features/portfolio/pages/not-found";

// 2. Lazy Load Public but Deeper Sub-pages
const BlogDetail = lazy(() => import("./features/blog/pages/BlogDetails"));

// 3. Lazy Load Heavy Admin Sub-ecosystem
const AdminLayout = lazy(() => import("./features/admin/components/AdminLayout"));
const AdminDashboard = lazy(() => import("./features/admin/pages/Dashboard"));
const ProjectsManager = lazy(() => import("./features/admin/pages/ProjectsManager"));
const TechsManager = lazy(() => import("./features/admin/pages/TechsManager"));
const BlogsManager = lazy(() => import("./features/admin/pages/BlogsManager"));
const BlogEditor = lazy(() => import("./features/admin/pages/BlogEditor"));
const InfoManager = lazy(() => import("./features/admin/pages/InfoManager"));
const EnquiriesManager = lazy(() => import("./features/admin/pages/Enquiries"));
const AdminLogin = lazy(() => import("./features/admin/pages/Login"));

// Instantiate outside the component to prevent re-creation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// A clean loading skeleton or spinner for fallback states
const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

// Encapsulating admin nested routing rules to persist the layout container shell
function AdminSubRouter() {
  return (
    <AdminLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={AdminDashboard} />
          <Route path="/projects" component={ProjectsManager} />
          <Route path="/techs" component={TechsManager} />
          <Route path="/blogs" component={BlogsManager} />
          <Route path="/blogs/new" component={BlogEditor} />
          <Route path="/blogs/edit/:id" component={BlogEditor} />
          <Route path="/info" component={InfoManager} />
          <Route path="/enquiries" component={EnquiriesManager} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Core Portfolio Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/blog/:id" component={BlogDetail} />

        {/* Admin Public Gateway */}
        <Route path={ADMIN_LOGIN_PATH} component={AdminLogin} />

        {/* Unified Admin Management Wrapper (Matches both exact and nested Admin Base paths) */}
        <Route path={ADMIN_BASE} nest component={AdminSubRouter} />

        {/* Global Fallback Catch-all Route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Router />
              </div>
            </WouterRouter>
            <Toaster position="bottom-right" closeButton richColors />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;