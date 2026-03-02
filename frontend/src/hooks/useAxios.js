import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useMemo } from 'react';

const useAxios = () => {
    const { getToken } = useAuth();

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: 'http://localhost:5000/api',
        });

        instance.interceptors.request.use(async (config) => {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return instance;
    }, [getToken]);

    return axiosInstance;
};

export default useAxios;
