import { useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import { getMe } from '../services/authService';
import { authStart, authSuccess, authFailure } from '../features/auth/authSlice';

const useAuthInit = () => {
    const dispatch = useDispatch();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(()=>{
        const init = async () => {
            try{
                dispatch(authStart());
                const response = await getMe();
                dispatch(authSuccess(response));
                localStorage.setItem("hasSession", "true");
            } catch (error) {
                dispatch(authFailure(null));
                localStorage.removeItem("hasSession");
            } finally {
                setIsInitialized(true);
            }
        };
        init();
    }, [dispatch]);

    return isInitialized;
}

export default useAuthInit;
