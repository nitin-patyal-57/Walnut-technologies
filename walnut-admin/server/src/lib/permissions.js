// Role → permission matrix. Enforced by requirePermission() on every route;
// the client only uses it to hide UI it can't use anyway.
// Editor prepares drafts; Publisher (or Super Admin) is who pushes them live.
export const ROLES = ['superadmin', 'publisher', 'editor', 'sales', 'hr', 'viewer'];

export const ROLE_LABELS = {
  superadmin: 'Super Admin',
  publisher: 'Publisher',
  editor: 'Editor',
  sales: 'Sales',
  hr: 'HR',
  viewer: 'Viewer',
};

const MATRIX = {
  superadmin: ['*'],
  publisher: ['dashboard:view', 'content:read', 'content:edit', 'content:publish', 'media:read', 'media:manage'],
  editor: ['dashboard:view', 'content:read', 'content:edit', 'media:read', 'media:manage'],
  sales: ['dashboard:view', 'leads:read', 'leads:manage'],
  hr: ['dashboard:view', 'applications:read', 'applications:manage'],
  viewer: ['dashboard:view', 'content:read', 'media:read', 'leads:read'],
};

export function permissionsFor(role) {
  return MATRIX[role] || [];
}

export function can(role, permission) {
  const perms = permissionsFor(role);
  return perms.includes('*') || perms.includes(permission);
}
