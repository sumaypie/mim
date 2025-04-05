// 权限管理工具类

const SUPER_ADMIN_PHONE = '18511256591';

// 用户角色枚举
const UserRole = {
  SUPER_ADMIN: 'super_admin',
  STUDIO: 'studio',
  MODEL: 'model',
  CUSTOMER: 'customer'
};

// 权限检查函数
const checkPermission = (userInfo, requiredRole) => {
  if (!userInfo) return false;
  
  // 超级管理员拥有所有权限
  if (userInfo.phone === SUPER_ADMIN_PHONE) {
    return true;
  }

  // 其他用户根据角色判断权限
  return userInfo.role === requiredRole;
};

// 判断是否为超级管理员
const isSuperAdmin = (userInfo) => {
  return userInfo && userInfo.phone === SUPER_ADMIN_PHONE;
};

module.exports = {
  UserRole,
  checkPermission,
  isSuperAdmin
};