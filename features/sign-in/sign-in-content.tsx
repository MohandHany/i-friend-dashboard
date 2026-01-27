"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import EmailIcon from "@/public/email-icon";
import PasswordIcon from "@/public/password-icon";
import VisibleIcon from "@/public/visible-icon";
import UnvisibleIcon from "@/public/unvisible-icon";
import { signIn } from "@/services/queries/sign-in/sign-in";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

import IFriendSpinner from "@/components/ifriend-spinner";

export default function SignInContent() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rememberMe") === "true";
      setRememberMe(saved);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast(`Please fill all the fields ❌`);
      setLoading(false);
      return;
    }

    try {
      // Persist rememberMe preference before sign-in so interceptors can capture refreshToken conditionally
      try {
        localStorage.setItem("rememberMe", rememberMe.toString());
        if (!rememberMe) {
          localStorage.removeItem("refreshToken");
        }
      } catch {}
      const result = await signIn(email, password);
      if (result.success && result.accessToken) {
        login(result.accessToken);
      } else {
        toast(`${result.message} ❌`);
      }
    } catch (error) {
      toast(`${error} ❌`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {loading && (
        <div className="fixed inset-0 z-999 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <IFriendSpinner size={96} className="drop-shadow-xl" alt="Loading..." />
        </div>
      )}
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
            <Label htmlFor="email" className="text-sm text-black select-none">
              Email address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <EmailIcon className="h-5 w-5 fill-natural-text" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@example.com"
                className="h-12 border-gray-100 bg-natural pl-10 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm  text-black select-none">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <PasswordIcon className="h-5 w-5 fill-natural-text" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-12 border-gray-100 bg-natural px-10 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
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
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => {
                const next = checked === true;
                setRememberMe(next);
                try {
                  localStorage.setItem("rememberMe", next.toString());
                  if (!next) {
                    localStorage.removeItem("refreshToken");
                  }
                } catch {}
              }}
            />
            <Label
              htmlFor="remember"
              className="text-sm cursor-pointer"
            >
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            className="mt-4 h-12 w-full bg-primary-blue text-base font-medium text-white hover:bg-primary-blue-hover"
            onClick={handleSubmit}
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


