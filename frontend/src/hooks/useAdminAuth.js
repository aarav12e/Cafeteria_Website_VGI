/**
 * useAdminAuth — reads the admin JWT from sessionStorage
 * and exposes helper methods for admin auth.
 */

export const isAdminLoggedIn = () => {
    return !!sessionStorage.getItem('adminToken');
};

export const getAdminToken = () => {
    return sessionStorage.getItem('adminToken');
};

export const logoutAdmin = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
};
