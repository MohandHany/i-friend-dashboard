"use client";

import SettingsIcon from "@/public/settings-icon";
import HomeIcon from "@/public/home-icon";
import RevenuesIcon from "@/public/revenues-icon";
import AnalysisIcon from "@/public/analysis-icon";
import SubscriptionsIcon from "@/public/subscriptions-icon";
import PaymentIcon from "@/public/card-icon";
import UsersIcon from "@/public/users-icon";
import NotificationsIcon from "@/public/notifications-icon";
import FeedBackIcon from "@/public/feed-back-icon";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const menuItems = [
  {
    name: "Home",
    href: "/",
    iconName: HomeIcon,
  },
  {
    name: "Revenues",
    href: "/revenues",
    iconName: RevenuesIcon,
  },
  {
    name: "Analysis",
    href: "/analysis",
    iconName: AnalysisIcon,
  },
  {
    name: "Subscriptions Management",
    href: "/subscriptions",
    iconName: SubscriptionsIcon,
  },
  {
    name: "Payment Methods",
    href: "/payment",
    iconName: PaymentIcon,
  },
  {
    name: "Users Management",
    href: "/users",
    iconName: UsersIcon,
  },
  {
    name: "Notifications",
    href: "/notifications",
    iconName: NotificationsIcon,
  },
  {
    name: "Feedback",
    href: "/feedback",
    iconName: FeedBackIcon,
  },
  {
    name: "Settings",
    href: "/settings",
    iconName: SettingsIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 w-76 h-screen bg-dark-blue flex flex-col p-2 z-[100]">
      {/* Logo */}
      <div className="flex items-center justify-center p-4">
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
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

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
