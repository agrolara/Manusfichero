export type UserRole = 'admin' | 'supervisor' | 'operator';

export interface RolePermissions {
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewAllData: boolean;
  canEditAllData: boolean;
  canDeleteData: boolean;
  canExportReports: boolean;
  canManageRoles: boolean;
  canAccessAdminPanel: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canViewAllData: true,
    canEditAllData: true,
    canDeleteData: true,
    canExportReports: true,
    canManageRoles: true,
    canAccessAdminPanel: true,
  },
  supervisor: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewAllData: true,
    canEditAllData: false,
    canDeleteData: false,
    canExportReports: true,
    canManageRoles: false,
    canAccessAdminPanel: false,
  },
  operator: {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canViewAllData: false,
    canEditAllData: false,
    canDeleteData: false,
    canExportReports: false,
    canManageRoles: false,
    canAccessAdminPanel: false,
  },
};

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return rolePermissions[role][permission];
}

export function canPerformAction(role: UserRole, action: string): boolean {
  const permissions = rolePermissions[role];
  
  switch (action) {
    case 'create_user':
      return permissions.canCreateUsers;
    case 'edit_user':
      return permissions.canEditUsers;
    case 'delete_user':
      return permissions.canDeleteUsers;
    case 'view_all_data':
      return permissions.canViewAllData;
    case 'edit_all_data':
      return permissions.canEditAllData;
    case 'delete_data':
      return permissions.canDeleteData;
    case 'export_reports':
      return permissions.canExportReports;
    case 'manage_roles':
      return permissions.canManageRoles;
    case 'access_admin':
      return permissions.canAccessAdminPanel;
    default:
      return false;
  }
}
