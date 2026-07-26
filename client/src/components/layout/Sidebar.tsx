import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { userNav, userBottomNav } from "@/components/navigation/userNav";
import { adminNav, adminBottomNav } from "@/components/navigation/adminNav";
import { authActions } from "@/store/slices/authSlice";
import { KycStatusBadge } from "@/components/KycStatusBadge";
import { requestFcmToken, onMessageListener } from "@/utils/fcm"; 
import { toast } from "sonner";

interface SidebarProps {
  role?: "user" | "admin";
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ role, isOpen = false, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, kycStatus, isAuthenticated } = useAppSelector((state) => state.auth);
  const notificationUnread = useAppSelector((state) => state.notifications.unreadCount);
  const chatUnread = useAppSelector((state) => state.chat.totalUnread);
  const isKycApproved = kycStatus === "APPROVED";

  const accountStatus = useAppSelector((s) => s.auth.accountStatus);
  const isBlocked = accountStatus === "SUSPENDED";

  useEffect(() => {
    if (isAuthenticated && user) {
      // Step A: Request permission and send token to backend
      requestFcmToken();

      // Step B: Listen for foreground messages (when app is open)
      onMessageListener()
  .then((payload: any) => { // Use 'any' or 'MessagePayload' to unlock properties
    const { notification, data } = payload;

    toast.success(notification?.title || "New Notification", {
      description: notification?.body,
      action: {
        label: "View",
        onClick: () => {
          if (data?.type === "CHAT") {
            navigate(`/user/messages?id=${data.conversationId}`);
          } else {
            navigate("/user/notifications");
          }
        }
      }
    });
  })
        .catch((err) => console.error("Foreground FCM error:", err));
    }
  }, [isAuthenticated, user, navigate]);

  // ✅ Navigate AFTER saga has set isAuthenticated → false
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    if (onClose) onClose();
    dispatch(authActions.logoutRequest());
    // ❌ No navigate here — useEffect above fires when isAuthenticated flips
  };

  const navItems = role === "admin" ? adminNav : userNav;
  const bottomNavItems = role === "admin" ? adminBottomNav : userBottomNav;

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const homeLink = role === "admin" ? "/admin" : "/user";

const SidebarContent = () => (
  <>
    {/* Logo */}
    <div className="p-6 border-b border-border">
      <Link to={homeLink} className="flex items-center gap-3">
        <Diamond className="h-8 w-8 text-accent" />
        <span className="font-display text-xl font-semibold text-primary">
          Reyu Diamond
        </span>
      </Link>
    </div>

    {/* ← ADD: Blocked Banner */}
    {isBlocked && (
      <div className="mx-4 mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2">
        <Shield className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
        <p className="text-xs text-destructive leading-snug">
          Your account has been suspended. Contact support for help.
        </p>
      </div>
    )}

    {/* Navigation */}
    <nav className="flex-1 p-4 overflow-y-auto scrollbar-premium">
      <ul className="space-y-1">
        {navItems.map((item: any) => {
          // ← CHANGE: isDisabled now includes isBlocked
          const isDisabled = (item.requireKyc && !isKycApproved) || isBlocked;

          let badgeCount = 0;
          if (item.label === "Messages") badgeCount = chatUnread;
          if (item.label === "Notifications") badgeCount = notificationUnread;

          return (
            <li key={item.href}>
              <NavLink
                to={isDisabled ? "#" : item.href}
                end
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    // ← CHANGE: don't redirect to KYC if blocked
                    if (!isBlocked) navigate("/kyc/start");
                  } else {
                    handleNavClick();
                  }
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                    isDisabled
                      ? "opacity-40 text-muted-foreground cursor-not-allowed"
                      : isActive
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-muted-foreground hover:text-primary hover:bg-muted",
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>

                {badgeCount > 0 && !isDisabled && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground shadow-sm">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
                {/* ← CHANGE: show different icons for blocked vs KYC */}
                {isDisabled && (
                  <Shield className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border">
        <ul className="space-y-1 mb-4">
          {bottomNavItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:text-primary hover:bg-muted",
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User Dropdown (Desktop Only) */}
        <div className="hidden lg:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-accent/20 text-accent font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-left">
                  <div className="font-medium text-primary text-sm">
                    {user?.name || "User"}
                  </div>
                  <div className="mt-1">
                    <KycStatusBadge />
                  </div>
                </div>

                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate("/kyc/start")}>
                <Shield className="h-4 w-4 mr-2" />
                KYC Verification
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate("/user/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={handleLogout}
                className="text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile User Preview */}
        <div className="lg:hidden flex items-center gap-3 p-3 rounded-xl bg-muted">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-accent/20 text-accent font-semibold">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-primary text-sm">
              {user?.name || "User"}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 flex-col bg-card border-r border-border z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-card border-r border-border z-50 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;