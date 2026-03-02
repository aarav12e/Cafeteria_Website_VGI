import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useMemo } from 'react';
import { getAdminToken } from './useAdminAuth';

const useAxios = () => {
    const { getToken } = useAuth();

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: 'http://localhost:5000/api',
        });

        instance.interceptors.request.use(async (config) => {
            // If admin token exists in sessionStorage, use it (admin panel requests)
            const adminToken = getAdminToken();
            if (adminToken) {
                config.headers.Authorization = `Bearer ${adminToken}`;
                return config;
            }

            // Otherwise use Clerk token (user requests)
            try {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                // Not signed in via Clerk — continue without token
            }

            return config;
        });

        return instance;
    }, [getToken]);

    return axiosInstance;
};

export default useAxios;
