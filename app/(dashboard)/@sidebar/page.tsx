"use client";

import SettingsIcon from "@/public/settings-icon";
import HomeIcon from "@/public/home-icon";
import RevenuesIcon from "@/public/revenues-icon";
import AnalysisIcon from "@/public/analysis-icon";
import SubscriptionsIcon from "@/public/subscriptions-icon";
import UsersIcon from "@/public/users-icon";
import NotificationsIcon from "@/public/notifications-icon";
import HeadPhoneIcon from "@/public/head-phone-icon";
import FeedBackIcon from "@/public/feed-back-icon";
import { GiftIcon } from "@/public/gift-icon";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useMemo } from "react";
import { MENU_ROUTES } from "@/lib/menu-routes";

type MenuItem = {
  name: string;
  href: string;
  iconName: React.ComponentType<{ className?: string }>;
  requiredPermissions?: string[];
};

// Icon mapping for menu items
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": HomeIcon,
  "/revenues": RevenuesIcon,
  "/analysis": AnalysisIcon,
  "/subscriptions": SubscriptionsIcon,
  "/users-management": UsersIcon,
  "/notifications": NotificationsIcon,
  "/help-and-support": HeadPhoneIcon,
  "/feedback": FeedBackIcon,
  "/refer-and-earn": GiftIcon,
  "/settings": SettingsIcon,
};

// Convert MENU_ROUTES to menuItems with icons
export const menuItems: MenuItem[] = MENU_ROUTES.map(route => ({
  ...route,
  iconName: iconMap[route.href] || HomeIcon,
}));

export default function Sidebar() {
  const pathname = usePathname();
  const { permissions } = useAuth();

  // Filter menu items based on user permissions
  const allowedMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
        return true;
      }

      return item.requiredPermissions.some(permission =>
        permissions.includes(permission)
      );
    });
  }, [permissions]);

  return (
    <aside className="hidden xl:flex fixed top-0 left-0 w-76 h-screen bg-dark-blue flex-col p-2 z-100">
      {/* Logo */}
      <div className="flex items-center justify-center p-3">
        <Image
          src="/IFriend.svg"
          alt="iFriend Logo"
          width={130}
          height={40}
          priority
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar">
        <ul className="list-none mr-2 2xl:mr-0 p-0">
          {allowedMenuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <li key={item.name} className="my-1">
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 p-4
                    text-sm 2xl:text-base no-underline
                    transition-all duration-200 relative
                    tracking-[0.02rem]
                    ${isActive
                      ? "text-primary-blue bg-light-blue rounded-xl"
                      : "text-natural-text hover:text-white group hover:bg-light-blue rounded-xl"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] " />
                  )}
                  <item.iconName className={`${isActive ? "text-primary-blue" : "text-natural-text group-hover:text-white"} duration-200`} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
