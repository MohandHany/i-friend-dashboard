"use client";

import api from "@/services/axios";
import type { InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => {
    // Capture refreshToken on successful sign-in only if rememberMe is enabled
    try {
      if (typeof window !== "undefined") {
        const url = response?.config?.url as string | undefined;
        const isSignIn = typeof url === "string" && url.includes("/auth/sign-in");
        if (isSignIn) {
          const rememberMe = localStorage.getItem("rememberMe") === "true";
          const rt = (response?.data?.data?.refreshToken ?? "") as string;
          if (rememberMe && rt) {
            localStorage.setItem("refreshToken", rt);
          } else {
            localStorage.removeItem("refreshToken");
          }
        }
      }
    } catch {}
    return response;
  },
  async (error) => {
    const resp = error?.response;
    const originalRequest = (error?.config || {}) as InternalAxiosRequestConfig & {
      _retry?: boolean;
      headers?: Record<string, unknown>;
    };
    if (!resp) {
      return Promise.reject(error);
    }
    
    if (resp?.status === 401 && !originalRequest._retry && typeof window !== "undefined") {
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (rememberMe && storedRefreshToken) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              if (originalRequest.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              }
              resolve(api(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        try {
          // baseURL already contains '/dashboard', so this hits '/dashboard/auth/refresh-token'
          const res = await api.post("/auth/refresh-token", { refreshToken: storedRefreshToken });
          const newAccessToken: string | undefined = res?.data?.data?.accessToken;
          const newRefreshToken: string | undefined = res?.data?.data?.refreshToken;
          if (newRefreshToken) {
            try { localStorage.setItem("refreshToken", newRefreshToken); } catch {}
          }
          if (newAccessToken) {
            try { localStorage.setItem("accessToken", newAccessToken); } catch {}
            api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            // keep middleware cookie in sync with refreshed token (7 days)
            try { document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; } catch {}
            onRefreshed(newAccessToken);
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            }
            return api(originalRequest);
          }
        } catch {
          // fall through to logout/redirect
        } finally {
          isRefreshing = false;
        }
      }

      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("rememberMe");
        // also clear cookie so middleware won't think user is authenticated
        try { document.cookie = 'accessToken=; path=/; max-age=0'; } catch {}
      } catch {}
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/sign-in") {
          window.location.href = "/sign-in";
        }
        // If already on /sign-in, do not redirect again to avoid reload loop
      }
    }
    return Promise.reject(error);
  }
);

export {};
