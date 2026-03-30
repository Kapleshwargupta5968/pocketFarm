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
            }catch(error){
                dispatch(authFailure(error?.response?.data?.message || "Failed to authenticate"));
            } finally {
                setIsInitialized(true);
            }
        };
        init();
    }, [dispatch]);

    return isInitialized;
}

export default useAuthInit;
