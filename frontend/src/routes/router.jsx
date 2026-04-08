import { createBrowserRouter, Navigate, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProtectedRoute from "./protectedRoute";
import Signup from "../pages/auth/Signup";
import Signin from "../pages/auth/Signin";
import React, { lazy, Suspense } from "react";
import Loader from "../components/common/Loader";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const Unauthorized = lazy(() => import("../pages/common/Unauthorized"));
const PlotList = lazy(() => import("../pages/plot/PlotList"));
const CreatePlot = lazy(() => import("../pages/plot/CreatePlot"));
const MyPlots = lazy(() => import("../pages/plot/MyPlots"));
const EditPlot = lazy(() => import("../pages/plot/EditPlot"));
const Subscriptions = lazy(() => import("../pages/subscription/Subscriptions"));
const Payments = lazy(() => import("../pages/payment/Payments"));
const Home = lazy(() => import("../pages/home/Home"));
const About = lazy(() => import("../pages/home/About"));
const PlotDetails = lazy(() => import("../pages/plot/PlotDetails"));
const MySubscriptions = lazy(() => import("../pages/subscription/mySubscriptions"));

const withSuspense = (Component) => (
  <Suspense fallback={<Loader fullScreen />}>
    <Component />
  </Suspense>
);

export const RootLayout = () => {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
      >
        {element && React.cloneElement(element, { key: location.pathname })}
      </motion.div>
    </AnimatePresence>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <DashboardHome />
          </Suspense>
        ),
      },
      {
        path: "plots",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute allowedRoles={["Subscriber"]}>
              <PlotList />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "plots/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute allowedRoles={["Subscriber"]}>
              <PlotDetails />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "my-plots",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <MyPlots />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "create-plot",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute allowedRoles={["Farmer"]}>
              <CreatePlot />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "edit-plot/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <EditPlot />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "subscriptions",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "my-subscriptions",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute allowedRoles={["Subscriber"]}>
              <MySubscriptions />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "payments",
        element: (
          <Suspense fallback={<Loader />}>
            <ProtectedRoute allowedRoles={["Subscriber", "Farmer"]}>
              <Payments />
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },

  { path: "/plots", element: <Navigate to="/dashboard/plots" replace /> },
  { path: "/my-plots", element: <Navigate to="/dashboard/my-plots" replace /> },
  { path: "/create-plot", element: <Navigate to="/dashboard/create-plot" replace /> },
  { path: "/edit-plot/:id", element: <Navigate to="/dashboard/edit-plot/:id" replace /> },
  { path: "/subscriptions", element: <Navigate to="/dashboard/subscriptions" replace /> },
  { path: "/payments", element: <Navigate to="/dashboard/payments" replace /> },
  { path: "/farmer", element: <Navigate to="/dashboard" replace /> },
  { path: "/subscriber", element: <Navigate to="/dashboard" replace /> },

  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <Unauthorized />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <Suspense fallback={<Loader fullScreen />}>
        <About />
      </Suspense>
    ),
  },
      {
        path: "*",
        element: <h1 className="p-6">404 Not Found</h1>,
      },
    ]
  }
]);