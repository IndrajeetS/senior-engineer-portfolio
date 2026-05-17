import { Button } from "@/components/ui/button";
import { ADMIN_LOGIN_PATH } from "@/constants/paths";
import { useAdminLogout } from "@/features/admin/api/admin.api";
import { secureStorage } from "@/utils/secureStorage";
import {
  Briefcase,
  FileText,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  User,
  Wrench
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { mutate: logout } = useAdminLogout();

  // 🛡️ Auth Guard: Kick out users without a valid token
  useEffect(() => {
    const token = secureStorage.getItem("auth_token");
    if (!token) {
      setLocation(`~${ADMIN_LOGIN_PATH}`);
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    // We clear locally first or on settlement to ensure the user is actually logged out in the UI
    // regardless of server-side state (which might have already expired).
    logout(undefined, {
      onSettled: () => {
        secureStorage.removeItem("auth_token");
        setLocation(`~${ADMIN_LOGIN_PATH}`);
      }
    });
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: Briefcase },
    { href: "/techs", label: "Technologies", icon: Wrench },
    { href: "/blogs", label: "Blogs", icon: FileText },
    { href: "/info", label: "Site Info", icon: Info },
    { href: "/enquiries", label: "Enquiries", icon: Mail },
  ];

  if (location === `~${ADMIN_LOGIN_PATH}`) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <User className="text-primary" /> Admin Panel
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors
                  ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"}
                `}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b bg-card flex items-center justify-between px-8 md:hidden">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          {/* Mobile menu could go here */}
        </header>
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
