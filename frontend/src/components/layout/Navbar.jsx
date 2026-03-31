import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../../services/notificationService";

import { setNotifications } from "../../features/notification/notificationSlice";
import { UserOutlined } from "@ant-design/icons";

import NotificationDropdown from "../notification/NotificationDropdown";

const Navbar = () => {
  const dispatch = useDispatch();

  const { notifications, count } = useSelector(
    (state) => state.notification
  );
  const { user } = useSelector((state) => state.auth);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getMyNotifications();

        dispatch(
          setNotifications({
            notifications: data.notifications || [],
            count: (data.notifications || []).filter((n) => !n.isRead).length
          })
        );
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [dispatch]);


  const handleReadNotification = async (id) => {
    try {
      await markAsRead(id);

      const updated = notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );

      dispatch(
        setNotifications({
          notifications: updated,
          count: updated.filter((n) => !n.isRead).length
        })
      );
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

      const updated = notifications.filter((n) => n._id !== id);

      dispatch(
        setNotifications({
          notifications: updated,
          count: updated.filter((n) => !n.isRead).length
        })
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-lg font-bold text-green-600">
        🌱 PocketFarm
      </h1>

      <div className="flex items-center gap-4 relative">

        <div
          className="cursor-pointer"
          onClick={() => {
            setOpenProfile(!openProfile);
            setOpenNotifications(false);
          }}
        >
          <UserOutlined />
        </div>

        {openProfile && (
          <div className="absolute right-0 top-12 w-56 bg-white shadow-xl rounded-xl p-4 z-50 border">
            <div className="flex flex-col gap-1 mb-2">
              <span className="text-gray-800 font-semibold text-sm">
                {user?.name}
              </span>
              <span className="text-gray-500 text-xs">
                {user?.email}
              </span>
            </div>

            <hr className="my-2" />

            <button className="w-full text-left px-2 py-1 hover:bg-red-100 text-red-500 rounded text-sm">
              Logout
            </button>
          </div>
        )}

        <div
          className="relative cursor-pointer"
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
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;