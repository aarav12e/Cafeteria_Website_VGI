import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const UserSync = () => {
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        const sync = async () => {
            if (isSignedIn) {
                try {
                    const token = await getToken();
                    await axios.post('http://localhost:5000/api/auth/sync', {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log('User synced with backend');
                } catch (error) {
                    console.error('User sync failed', error);
                }
            }
        };

        sync();
    }, [isSignedIn, getToken]);

    return null;
};

export default UserSync;
