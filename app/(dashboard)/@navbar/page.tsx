"use client";

import { usePathname } from "next/navigation";
import { menuItems } from "@/app/(dashboard)/@sidebar/page";

interface NavbarProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export default function Navbar({
  userName = "Mahmoud A Elkarim",
  userRole = "Administrator",
  userAvatar = "/Ellipse 16.png",
}: NavbarProps) {

  const pathname = usePathname();
  const pageName = menuItems.find((item) => item.href === pathname)?.name;

  return (
    <nav className="fixed top-0 right-0 left-76 h-16 bg-white flex items-center justify-between px-6 z-50">
      {/* Left Section - Page Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">{pageName}</h1>
      </div>

      {/* Right Section - Bell Icon and User Info */}
      <div className="flex items-center gap-4">

        {/* User Profile Section */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-light-natural rounded-lg px-3 py-2 transition-colors">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary-blue flex items-center justify-center overflow-hidden">
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-white font-semibold text-sm">${userName.split(" ").map(n => n[0]).join("")}</span>`;
                }
              }}
            />
          </div>

          {/* User Info */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{userName}</span>
            <span className="text-xs text-gray-500">{userRole}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
