import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Megaphone,
  Handshake,
  Gavel,
  Settings,
} from "lucide-react";

export const adminNav = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/admin"          },
  { icon: Users,           label: "Users",           href: "/admin/users"    },
  { icon: ShieldCheck,     label: "KYC Reviews",     href: "/admin/kyc"      },
  { icon: Megaphone,       label: "Advertisements",  href: "/admin/ads"      },
  { icon: Handshake,       label: "Deals",           href: "/admin/deals"    },
  { icon: Gavel,           label: "Auctions",        href: "/admin/auctions" },
];

export const adminBottomNav = [
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];