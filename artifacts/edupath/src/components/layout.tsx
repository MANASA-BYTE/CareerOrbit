import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Compass, 
  Bot, 
  Bell, 
  User, 
  LogOut,
  Menu,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Exams", href: "/exams", icon: GraduationCap },
    { name: "Notes", href: "/notes", icon: BookOpen },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Careers", href: "/careers", icon: Compass },
    { name: "AI Trends", href: "/ai-trends", icon: Sparkles },
    { name: "AI Mentor", href: "/ai-mentor", icon: Bot },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const NavLinks = () => (
    <div className="flex flex-col gap-2">
      {navigation.map((item) => {
        const isActive = location === item.href || location.startsWith(`${item.href}/`);
        return (
          <Link key={item.name} href={item.href}>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card/50 backdrop-blur-xl">
        <div className="p-6">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="nav-logo">
              <div className="bg-primary p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                EduPath
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.aparId}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground hover:text-foreground" 
            onClick={() => logout()}
            data-testid="btn-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-primary p-1.5 rounded-md">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold tracking-tight">EduPath</span>
            </div>
          </Link>
          
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="btn-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col border-r bg-card/95 backdrop-blur-xl">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="bg-primary p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">EduPath</span>
                </div>
              </div>
              <nav className="flex-1 px-4 py-4 overflow-y-auto">
                <NavLinks />
              </nav>
              <div className="p-4 border-t">
                <Button variant="destructive" className="w-full justify-start" onClick={() => logout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
