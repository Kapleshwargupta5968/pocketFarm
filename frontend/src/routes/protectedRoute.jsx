import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({children, allowedRoles}) => {
    const {user, loading} = useSelector((state)=>state.auth);
    
    if(loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if(!user){
        return <Navigate to="/signin" replace/>
    }
    if(allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to="/unauthorized" replace/>
    }
    return children;
}

export default ProtectedRoute;