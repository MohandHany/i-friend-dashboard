"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import { menuItems } from "@/app/(dashboard)/@sidebar/page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import SignOutIcon from "@/public/sign-out-icon";
import { getMe } from "@/services/queries/settings/user/get/get-me";
import ArrowDown2Icon from "@/public/arrow-down-2-icon";
import CameraIcon from "@/public/camera-icon";
import HomeIcon from "@/public/home-icon";
import { AvatarCard } from "@/features/profile/avatar-card";
import { Menu, X } from "lucide-react";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export default function Navbar() {
  const [userName, setUserName] = useState<string>("")
  const [userRole, setUserRole] = useState<string>("")
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const pageName = menuItems.find((item) => item.href === pathname)?.name;
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const result = await getMe()
        const userName = result.data?.user?.name as string
        const userRole = result.data?.user?.dashboardUserRole?.name as string
        const userAvatar = result.data?.user?.avatarUrl as string | null
        setUserName(userName ?? "")
        setUserRole(userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "")
        setUserAvatar(userAvatar ?? null)
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 xl:left-[19rem] h-16 bg-white flex items-center justify-between px-4 xl:px-6 z-40 xl:z-50 border-b xl:border-none shadow-sm xl:shadow-none">
        {/* Left Section - Page Title and Mobile Menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{pageName}</h1>
        </div>

        {/* Right Section - Bell Icon and User Info */}
        <div className="flex items-center gap-4">
          {/* User Profile Section with Popover */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="select-none flex items-center gap-2 cursor-pointer hover:bg-natural rounded-lg px-3 py-2 transition-all duration-300">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-all">
                  {userAvatar ? <Image
                    src={userAvatar}
                    alt={userName}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  /> : <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-primary-blue/10 text-primary-blue font-bold">{getInitials(userName)}</div>}
                </div>

                {/* User Info */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-4">{userName}</span>
                  <span className="text-xs font-medium text-primary-blue leading-4">{userRole}</span>
                </div>
                <ArrowDown2Icon className={`h-5! w-5! ${isPopoverOpen ? 'rotate-180' : ''} transition-all duration-300`} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-2 mr-2 outline-none border-none rounded-xl rounded-t-none">
              <Button
                variant="ghost"
                className="w-full justify-start text-natural-text hover:text-primary-blue hover:bg-primary-blue/10 outline-none border-none"
                onClick={() => {
                  setIsPopoverOpen(false)
                  setIsAvatarDialogOpen(true)
                }}
              >
                <CameraIcon className="h-5! w-5!" />
                Profile Picture
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10 outline-none border-none"
                onClick={logout}
              >
                <SignOutIcon className="h-5! w-5!" />
                Sign Out
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        <AvatarCard
          open={isAvatarDialogOpen}
          onOpenChange={setIsAvatarDialogOpen}
          onSuccess={(url) => setUserAvatar(url)}
          currentAvatarUrl={userAvatar}
        />
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-dark-blue flex flex-col p-2 xl:hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 px-2 mb-4 relative w-full h-16">
            <Image
              src="/IFriend.svg"
              alt="iFriend Logo"
              width={130}
              height={40}
              priority
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-light-blue"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar">
            <ul className="list-none mr-2 p-0">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.name} className="my-1">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = item.href;
                      }}
                      className={`w-full text-left flex items-center gap-3 p-4
                      text-sm no-underline transition-all duration-200 relative
                      tracking-[0.02rem]
                      ${isActive
                          ? "text-primary-blue bg-light-blue rounded-xl"
                          : "text-natural-text hover:text-white group hover:bg-light-blue rounded-xl"
                        }
                    `}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-blue rounded-l-xl" />
                      )}
                      <item.iconName className={`${isActive ? "text-primary-blue" : "text-natural-text group-hover:text-white"} duration-200`} />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
