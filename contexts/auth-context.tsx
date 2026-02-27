"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import "@/services/queries/auth/interceptors";
import { getMe, type MyDataType } from '@/services/queries/settings/user/get/get-me';
import { getAllRoles, type RoleItemsData } from '@/services/queries/settings/role/get/get-all-roles';
import { getFirstAccessibleRoute } from '@/lib/menu-routes';

/* Store authentication token in local storage */
export const setAuthToken = (accessToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("accessToken", accessToken);
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  }
};

/* Retrieve authentication token from local storage */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("accessToken");
  }
  return null;
};

/* Remove authentication token from local storage */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("rememberMe");
    document.cookie = 'accessToken=; path=/; max-age=0';
  }
};

/* Check if user is authenticated */
export const isAuthenticated = (): boolean => {
  const accessToken = getAuthToken();
  return !!accessToken;
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: MyDataType['user'] | null;
  userRole: RoleItemsData | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  checkAuth: () => void;
  fetchUserData: () => Promise<string[]>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<MyDataType['user'] | null>(null);
  const [userRole, setUserRole] = useState<RoleItemsData | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const router = useRouter();



  const fetchUserData = async (): Promise<string[]> => {
    const accessToken = getAuthToken();
    if (!accessToken) return [];

    try {
      const userResponse = await getMe();

      if (userResponse.success && userResponse.data) {
        const userData = userResponse.data.user;
        setUser(userData);

        // Check if permissions are included in the user data
        if (userData.dashboardUserRole?.dashboardRolePermissions) {
          // Extract permissions directly from user data
          const userPermissions = userData.dashboardUserRole.dashboardRolePermissions.map(
            rp => rp.permission.name
          );

          setPermissions(userPermissions);

          // Create userRole object for reference
          setUserRole({
            id: '',
            name: userData.role,
            dashboardRolePermissions: userData.dashboardUserRole.dashboardRolePermissions.map(rp => ({
              id: '',
              dashboardUserRoleId: '',
              permissionsId: rp.permission.id,
              permission: rp.permission
            }))
          } as any);

          return userPermissions;
        }

        // Fallback: Fetch all roles if permissions not in user data
        const rolesResponse = await getAllRoles();

        if (rolesResponse.success && rolesResponse.data) {
          const currentUserRole = rolesResponse.data.find(
            role => role.name === userData.role
          );

          if (currentUserRole) {
            setUserRole(currentUserRole);

            const userPermissions = currentUserRole.dashboardRolePermissions.map(
              rp => rp.permission.name
            );

            setPermissions(userPermissions);
            return userPermissions;
          } else if (process.env.NODE_ENV === 'development') {
            console.warn('[Auth] No matching role found for user:', userData.role);
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth] Failed to fetch user data:', error);
      }
    }

    return [];
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const checkAuth = async () => {
    try {
      const accessToken = getAuthToken();
      setIsAuthenticated(!!accessToken);

      if (accessToken) {
        await fetchUserData();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (accessToken: string) => {
    setAuthToken(accessToken);
    toast(`Log-in successfully, hey 👋`);

    setIsAuthenticated(true);
    const userPermissions = await fetchUserData();

    // Redirect to first accessible page based on permissions
    const firstAccessiblePage = getFirstAccessibleRoute(userPermissions);
    router.replace(firstAccessiblePage);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setUserRole(null);
    setPermissions([]);

    toast.message(`Log-out successfully, see you soon 🙌`);
    router.replace('/sign-in');

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      userRole,
      permissions,
      hasPermission,
      login,
      logout,
      checkAuth,
      fetchUserData,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
