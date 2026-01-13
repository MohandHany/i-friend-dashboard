"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import EmailIcon from "@/public/email-icon";
import PasswordIcon from "@/public/password-icon";
import VisibleIcon from "@/public/visible-icon";
import UnvisibleIcon from "@/public/unvisible-icon";

export default function SignInContent() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-24">
        <div className="mb-8 select-none">
          <h2 className="text-xl font-medium text-gray-500">Welcome back</h2>
          <h1 className="mt-2 text-3xl font-medium text-black">
            Sign in to Dashboard !
          </h1>
        </div>

        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base text-black select-none">
              Email address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <EmailIcon className="h-5 w-5 fill-natural-text" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="info@example.com"
                className="h-12 border-gray-100 bg-natural pl-10 text-natural-text placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base text-black select-none">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <PasswordIcon className="h-5 w-5 fill-natural-text" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="h-12 border-gray-100 bg-natural px-10 text-natural-text placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <VisibleIcon className="h-5 w-5 fill-natural-text" />
                ) : (
                  <UnvisibleIcon className="h-5 w-5 fill-natural-text" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label
              htmlFor="remember"
              className="text-sm font-medium text-gray-400 cursor-pointer"
            >
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            className="mt-4 h-12 w-full bg-primary-blue text-base font-medium text-white hover:bg-primary-blue-hover"
          >
            Sign in
          </Button>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="hidden w-1/2 m-3 rounded-3xl items-center justify-center bg-[linear-gradient(180deg,#9CC3FE,#0066FF,#030712)] p-12 lg:flex">
        <div className="relative h-full w-full max-w-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/sign-in-image.png"
              alt="Dashboard Preview"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
