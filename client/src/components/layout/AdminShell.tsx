import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond, LayoutDashboard, Users, ShieldCheck,
  Megaphone, Handshake, Gavel, LogOut, Menu, X, ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { authActions } from "@/store/slices/authSlice";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/admin" },
  { icon: Users,           label: "Users",         href: "/admin/users" },
  { icon: ShieldCheck,     label: "KYC Reviews",   href: "/admin/kyc" },
  { icon: Megaphone,       label: "Advertisements", href: "/admin/ads" },
  { icon: Handshake,       label: "Deals",          href: "/admin/deals" },
  { icon: Gavel,           label: "Auctions",       href: "/admin/auctions" },
];

interface AdminShellProps {
  children: React.ReactNode;
}

const AdminShell = ({ children }: AdminShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { user }  = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(authActions.logoutRequest());
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-3">
          <Diamond className="h-8 w-8 text-accent" />
          <div>
            <span className="font-display text-lg font-semibold text-primary block">
              Reyu Diamond
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.href === "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="hidden lg:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-accent/20 text-accent font-semibold text-sm">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium text-primary text-sm">{user?.name || "Admin"}</div>
                  <div className="text-xs text-muted-foreground">Administrator</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile user */}
        <div className="lg:hidden flex items-center gap-3 p-3 rounded-xl bg-muted">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-accent/20 text-accent font-semibold text-sm">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-primary text-sm">{user?.name || "Admin"}</div>
            <div className="text-xs text-muted-foreground">Administrator</div>
          </div>
          <button onClick={handleLogout} className="text-destructive">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile topbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <Diamond className="h-6 w-6 text-accent" />
          <span className="font-display font-semibold text-primary">Admin</span>
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 flex-col bg-card border-r border-border z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-card border-r border-border z-50 flex flex-col"
            >
              <div className="flex justify-end p-4">
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        
          {children}
     
      </main>
    </div>
  );
};

export default AdminShell;