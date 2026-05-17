import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
import { Route, Switch, Router as WouterRouter } from "wouter";

import { TooltipProvider } from "./components/ui/tooltip";
import BlogDetail from "./features/blog/pages/BlogDetails";
import Home from "./features/portfolio/pages/Home";
import NotFound from "./features/portfolio/pages/not-found";
import { ThemeProvider } from "./providers/theme-provider";
import { store } from "./store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

import AdminLayout from "./features/admin/components/AdminLayout";
import BlogsManager from "./features/admin/pages/BlogsManager";
import BlogEditor from "./features/admin/pages/BlogEditor";
import AdminDashboard from "./features/admin/pages/Dashboard";
import EnquiriesManager from "./features/admin/pages/Enquiries";
import InfoManager from "./features/admin/pages/InfoManager";
import AdminLogin from "./features/admin/pages/Login";
import ProjectsManager from "./features/admin/pages/ProjectsManager";
import TechsManager from "./features/admin/pages/TechsManager";
import { ADMIN_BASE, ADMIN_LOGIN_PATH } from "./constants/paths";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog/:id" component={BlogDetail} />

      {/* Admin Routes */}
      <Route path={ADMIN_LOGIN_PATH} component={AdminLogin} />
      
      <Route path={ADMIN_BASE}>
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path={`${ADMIN_BASE}/projects`}>
        <AdminLayout><ProjectsManager /></AdminLayout>
      </Route>
      <Route path={`${ADMIN_BASE}/techs`}>
        <AdminLayout><TechsManager /></AdminLayout>
      </Route>
      <Route path={`${ADMIN_BASE}/blogs`}>
        <AdminLayout><BlogsManager /></AdminLayout>
      </Route>
      <Route path={`${ADMIN_BASE}/blogs/new`}>
        <AdminLayout><BlogEditor /></AdminLayout>
      </Route>
      <Route path={`${ADMIN_BASE}/blogs/edit/:id`}>
        <AdminLayout><BlogEditor /></AdminLayout>
      </Route>
      <Route path={`${ADMIN_BASE}/info`}>
        <AdminLayout><InfoManager /></AdminLayout>
      </Route>
      <Route path={`${ADMIN_BASE}/enquiries`}>
        <AdminLayout><EnquiriesManager /></AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <WouterRouter
              base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}
            >
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
