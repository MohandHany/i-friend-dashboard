/**
 * Menu Routes Configuration
 * 
 * This file contains the menu items configuration used across the application
 * for navigation and permission-based routing.
 */

import { PERMISSIONS } from './permissions';

export type MenuRoute = {
  name: string;
  href: string;
  requiredPermissions: string[];
};

/**
 * All available menu routes in the application
 * Order matters: first accessible route will be used as default after login
 */
export const MENU_ROUTES: MenuRoute[] = [
  {
    name: "Dashboard",
    href: "/",
    requiredPermissions: [PERMISSIONS.DASHBOARD],
  },
  {
    name: "Revenues",
    href: "/revenues",
    requiredPermissions: [PERMISSIONS.REVENUE],
  },
  {
    name: "Analysis",
    href: "/analysis",
    requiredPermissions: [PERMISSIONS.ANALYSIS],
  },
  {
    name: "Subscriptions Management",
    href: "/subscriptions",
    requiredPermissions: [PERMISSIONS.SUBSCRIPTION],
  },
  {
    name: "Users Management",
    href: "/users-management",
    requiredPermissions: [PERMISSIONS.USERS],
  },
  {
    name: "Notifications",
    href: "/notifications",
    requiredPermissions: [PERMISSIONS.NOTIFICATION],
  },
  {
    name: "Help & Support",
    href: "/help-and-support",
    requiredPermissions: [PERMISSIONS.HELP_AND_SUPPORT],
  },
  {
    name: "Feedback",
    href: "/feedback",
    requiredPermissions: [PERMISSIONS.FEEDBACK],
  },
  {
    name: "Refer & Earn",
    href: "/refer-and-earn",
    requiredPermissions: [PERMISSIONS.LOYALTY],
  },
  {
    name: "Settings",
    href: "/settings",
    requiredPermissions: [PERMISSIONS.SETTINGS],
  },
];

/**
 * Get the first accessible route for a user based on their permissions
 * @param userPermissions - Array of permission names the user has
 * @returns The href of the first accessible route, or "/" as fallback
 */
export function getFirstAccessibleRoute(userPermissions: string[]): string {
  for (const route of MENU_ROUTES) {
    const hasAccess = route.requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );
    if (hasAccess) {
      return route.href;
    }
  }

  // Fallback to home if no accessible routes found
  return "/";
}

/**
 * Filter routes based on user permissions
 * @param userPermissions - Array of permission names the user has
 * @returns Array of routes the user has access to
 */
export function getAccessibleRoutes(userPermissions: string[]): MenuRoute[] {
  return MENU_ROUTES.filter(route => {
    return route.requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );
  });
}
