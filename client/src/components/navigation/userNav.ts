import {
  LayoutDashboard,
  TrendingUp,
  Heart,
  Package,
  ListPlus,
  Gavel,
  Handshake,
  Wallet,
  MessageCircle,
  Bell,
  Settings,
} from "lucide-react";

export const userNav = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/user",                   requireKyc: false },
  { icon: TrendingUp,      label: "Marketplace",    href: "/user/marketplace",       requireKyc: false },
  { icon: Heart,           label: "Preferences",    href: "/user/preferences",       requireKyc: true  },
  { icon: Package,         label: "Inventory",      href: "/user/inventory",         requireKyc: true  },
  { icon: ListPlus,        label: "My Listings",    href: "/user/listings",          requireKyc: true  },
  { icon: Gavel,           label: "My Bids",        href: "/user/bids",              requireKyc: true  },
  { icon: Gavel,           label: "Bids Received",  href: "/user/bids/received",     requireKyc: true  },
  { icon: Handshake,       label: "Deals",          href: "/user/deals",             requireKyc: true  },
  { icon: Wallet,          label: "Payments",       href: "/user/payments",          requireKyc: true  },
  { icon: MessageCircle,   label: "Messages",       href: "/user/messages",          requireKyc: true  },
  { icon: Bell,            label: "Notifications",  href: "/user/notifications",     requireKyc: false },
  { icon: MessageCircle,   label: "Advertisements", href: "/user/advertisements",    requireKyc: true  },
];
export const userBottomNav = [
  { icon: Settings, label: "Settings", href: "/user/settings" },
];
