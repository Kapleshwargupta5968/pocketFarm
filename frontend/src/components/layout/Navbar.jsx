import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../services/socketService";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../../services/notificationService";

import { setNotifications, addNotification, updateNotificationRead, removeNotification } from "../../features/notification/notificationSlice";
import { UserOutlined } from "@ant-design/icons";

import NotificationDropdown from "../notification/NotificationDropdown";
import { logoutUser } from "../../services/authService";

const Navbar = () => {
  const dispatch = useDispatch();

  const { notifications, count } = useSelector(
    (state) => state.notification
  );
  const { user } = useSelector((state) => state.auth);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    // Get user ID - backend returns 'id', but some places might expect '_id'
    const userId = user?.id || user?._id;
    
    if (!userId) {
      console.log("⏳ Waiting for user to load...");
      return;
    }
    
    const fetchNotifications = async () => {
      try {
        console.log("📥 Fetching notifications for user:", userId);
        
        const data = await getMyNotifications();
        console.log("📊 Notifications fetched:", data);
        
        const notificationsArray = data?.notifications || [];
        console.log("📋 Notifications count:", notificationsArray.length);
        
        dispatch(
          setNotifications({
            notifications: notificationsArray,
            count: notificationsArray.filter((n) => !n.isRead).length
          })
        );
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
      }
    };

    // Fetch immediately on user load
    fetchNotifications();
    
    // Then refetch every 5 seconds ONLY if user is loaded
    const interval = setInterval(fetchNotifications, 5000);
    
    return () => clearInterval(interval);
  }, [dispatch, user?.id, user?._id]);

  useEffect(() => {
    const handleNewNotification = (notification) => {
      console.log("🔔 New notification received:", notification);
      dispatch(addNotification(notification));
    };

    socket.on("newNotification", handleNewNotification);
    console.log("✅ Notification listener attached");

    return () => {
      socket.off("newNotification", handleNewNotification);
    };

  }, [dispatch]);

  const handleReadNotification = async (id) => {
    try {
      await markAsRead(id);
      dispatch(updateNotificationRead(id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();

      const updated = notifications.map((n) => ({
        ...n,
        isRead: true
      }));

      dispatch(
        setNotifications({
          notifications: updated,
          count: 0
        })
      );
    } catch (error) {
      console.error("Error marking all notifications:", error);
    }
  };


  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      dispatch(removeNotification(id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleLogout = async () => {
    const response  = await logoutUser();
    if(response?.success){
      window.location.replace("/");
    }
    return response;
  }

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
        Dashboard
      </h1>

      <div className="flex items-center gap-5 relative">

        <div
          className="cursor-pointer w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
          onClick={() => {
            setOpenProfile(!openProfile);
            setOpenNotifications(false);
          }}
        >
          <UserOutlined />
        </div>

        {openProfile && (
          <div className="absolute right-0 top-12 w-56 bg-white shadow-xl shadow-slate-200/50 rounded-2xl p-4 z-50 border border-slate-100">
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-gray-800 font-semibold text-sm">
                {user?.name}
              </span>
              <span className="text-gray-500 text-xs">
                {user?.email}
              </span>
            </div>

            <hr className="my-3 border-slate-100" />

            <button className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 font-medium rounded-xl text-sm transition-colors" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

        <div
          className="relative cursor-pointer w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
          onClick={() => {
            setOpenNotifications(!openNotifications);
            setOpenProfile(false);
          }}
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </div>

        {openNotifications && (
          <NotificationDropdown
            notifications={notifications}
            onRead={handleReadNotification}
            onDelete={handleDeleteNotification}
            onMarkAll={handleMarkAllRead}
            isOpen={openNotifications}
            onClose={() => setOpenNotifications(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;