import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import Signup from "../pages/auth/Signup";
import Signin from "../pages/auth/Signin";
import { lazy, Suspense } from "react";
import Loader from "../components/common/Loader";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Unauthorized = lazy(() => import("../pages/common/Unauthorized"));
const FarmerDashboard = lazy(() => import("../pages/dashboard/FarmerDashboard"));
const SubscriberDashboard = lazy(() => import("../pages/dashboard/SubscriberDashboard"));
const PlotList = lazy(() => import("../pages/plot/PlotList"));
const CreatePlot = lazy(() => import("../pages/plot/CreatePlot"));  
const MyPlots = lazy(() => import("../pages/plot/MyPlots"));
const EditPlot = lazy(() => import("../pages/plot/EditPlot"));
export const router = createBrowserRouter([
    {
        path:"/create-plot",
        element:(
            <Suspense fallback={<Loader fullScreen/>}>
                <ProtectedRoute allowedRoles={["Farmer"]}>
                    <CreatePlot/>
                </ProtectedRoute>
            </Suspense>
        )
    },
    {
        path:"/plots",
        element: (
            <Suspense fallback={<Loader fullScreen/>}>
                <ProtectedRoute>
                    <PlotList/>
                </ProtectedRoute>
            </Suspense>
        )
    },
    {
        path:"/my-plots",
        element: (
            <Suspense fallback={<Loader fullScreen/>}>
                <ProtectedRoute>
                    <MyPlots/>
                </ProtectedRoute>
            </Suspense>
        )
    },
    {
        path:"/edit-plot/:id",
        element: (
            <Suspense fallback={<Loader fullScreen/>}>
                <ProtectedRoute>
                    <EditPlot/>
                </ProtectedRoute>
            </Suspense>
        )
    },
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
            <Suspense fallback={<Loader fullScreen/>}>
                <ProtectedRoute>
                    <Dashboard/>
                </ProtectedRoute>
            </Suspense>
        )
    },
    {
        path:"/farmer",
        element:(
            <Suspense fallback={<Loader fullScreen/>}>
                <ProtectedRoute allowedRoles={["Farmer"]}>
                    <FarmerDashboard/>
                </ProtectedRoute>
            </Suspense>
        )
    },
    {
        path:"/subscriber",
        element:(
            <Suspense fallback={<Loader fullScreen/>}>
                <ProtectedRoute allowedRoles={["Subscriber"]}>
                    <SubscriberDashboard/>
                </ProtectedRoute>
            </Suspense>
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