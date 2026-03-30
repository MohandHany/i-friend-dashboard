/**
 * Permission Helper Utilities
 * 
 * This file contains helper functions and constants for managing permissions
 * throughout the application.
 */

/**
 * Permission Names - Define all available permissions
 * These match the permission names in the database exactly as returned from the API
 * 
 * API Response format:
 * {
 *   "id": "...",
 *   "name": "Dashboard", // This is the permission name we use
 *   "createdAt": "...",
 *   "updatedAt": "..."
 * }
 */
export const PERMISSIONS = {
  // Main Permissions (as stored in database)
  DASHBOARD: "Dashboard",
  REVENUE: "Revenue",
  ANALYSIS: "Analysis",
  SUBSCRIPTION: "Subscription",
  USERS: "Users",
  NOTIFICATION: "Notification",
  FEEDBACK: "Feedback",
  SETTINGS: "Settings",
  LOYALTY: "Loyalty",
  PAYMENT: "Payment",
  HELP_AND_SUPPORT: "Help And Support",
} as const;

/**
 * Permission Groups - Group related permissions
 * Since each module has a single permission in the database, each group contains just one permission
 */
export const PERMISSION_GROUPS = {
  DASHBOARD: [PERMISSIONS.DASHBOARD] as string[],
  REVENUE: [PERMISSIONS.REVENUE] as string[],
  ANALYSIS: [PERMISSIONS.ANALYSIS] as string[],
  SUBSCRIPTION: [PERMISSIONS.SUBSCRIPTION] as string[],
  USERS: [PERMISSIONS.USERS] as string[],
  NOTIFICATION: [PERMISSIONS.NOTIFICATION] as string[],
  FEEDBACK: [PERMISSIONS.FEEDBACK] as string[],
  SETTINGS: [PERMISSIONS.SETTINGS] as string[],
  LOYALTY: [PERMISSIONS.LOYALTY] as string[],
  PAYMENT: [PERMISSIONS.PAYMENT] as string[],
  HELP_AND_SUPPORT: [PERMISSIONS.HELP_AND_SUPPORT] as string[],
};


/**
 * Check if user has ANY of the given permissions (OR logic)
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Check if user has ALL of the given permissions (AND logic)
 */
export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Check if user can view a specific module
 */
export function canViewModule(
  userPermissions: string[],
  module: keyof typeof PERMISSION_GROUPS
): boolean {
  const modulePermissions = PERMISSION_GROUPS[module];
  return hasAnyPermission(userPermissions, modulePermissions);
}

/**
 * Check if user can manage a specific module (full CRUD access)
 */
export function canManageModule(
  userPermissions: string[],
  module: keyof typeof PERMISSION_GROUPS
): boolean {
  const modulePermissions = PERMISSION_GROUPS[module];
  // Check if has "manage_*" permission
  const managePermission = modulePermissions.find((p) =>
    p.startsWith("manage_")
  );
  return managePermission
    ? userPermissions.includes(managePermission)
    : false;
}

/**
 * Get all permissions for a specific module
 */
export function getModulePermissions(
  module: keyof typeof PERMISSION_GROUPS
): string[] {
  return PERMISSION_GROUPS[module];
}

/**
 * Get permissions that user is missing for a module
 */
export function getMissingPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): string[] {
  return requiredPermissions.filter(
    (permission) => !userPermissions.includes(permission)
  );
}

/**
 * Filter items based on permissions
 * Useful for filtering lists of items where each item has required permissions
 */
export function filterByPermissions<T extends { requiredPermissions?: string[] }>(
  items: T[],
  userPermissions: string[]
): T[] {
  return items.filter((item) => {
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true;
    }
    return hasAnyPermission(userPermissions, item.requiredPermissions);
  });
}
