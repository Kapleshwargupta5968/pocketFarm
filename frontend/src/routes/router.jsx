import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import Signup from "../pages/auth/Signup";
import Signin from "../pages/auth/Signin";
import FarmerDashboard from "../pages/dashboard/FarmerDashboard";
import SubscriberDashboard from "../pages/dashboard/SubscriberDashboard";
import Unauthorized from "../pages/common/Unauthorized";
import Dashboard from "../pages/dashboard/Dashboard";

export const router = createBrowserRouter([
    {
        path:"/signup",
        element:<Signup/>
    },
    {
        path:"/signin",
        element:<Signin/>
    },
    {
        path:"/dashboard",
        element:(
            <ProtectedRoute>
                <Dashboard/>
            </ProtectedRoute>
        )
    },
    {
        path:"/farmer",
        element:(
            <ProtectedRoute allowedRoles={["Farmer"]}>
                <FarmerDashboard/>
            </ProtectedRoute>
        )
    },
    {
        path:"/subscriber",
        element:(
            <ProtectedRoute allowedRoles={["Subscriber"]}>
                <SubscriberDashboard/>
            </ProtectedRoute>
        )
    },
    {
        path:"/unauthorized",
        element:<Unauthorized/>
    },
    {
        path:"/",
        element: <Navigate to="/dashboard" replace/>
    },
    {
        path:"*",
        element:<h1 className="p-6">404 Not Found</h1>
    }
]);