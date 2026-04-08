import { motion, AnimatePresence } from "framer-motion";
import NotificationItem from "./NotificationItem";
import { useRef, useEffect } from "react";

const NotificationDropdown = ({
  notifications = [],
  onRead,
  onDelete,
  onMarkAll,
  isOpen = true,
  onClose = () => {}
}) => {
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-3 w-96 rounded-2xl shadow-2xl z-50 overflow-hidden bg-white"
        >
          {/* Gradient header */}
          <div className="bg-linear-to-r from-blue-600 via-blue-500 to-purple-600 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-lg">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-blue-100 text-xs">
                    {unreadCount} new notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onMarkAll}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-all backdrop-blur-sm border border-white/30"
                >
                  Mark all
                </motion.button>
              )}
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-96 overflow-y-auto custom-scroll">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <p className="text-5xl mb-3">🔔</p>
                <p className="text-slate-600 font-medium text-sm">No notifications yet</p>
                <p className="text-slate-400 text-xs mt-1">You'll see updates here</p>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
                className="p-4 space-y-0"
              >
                <AnimatePresence mode="popLayout">
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n._id}
                      data={n}
                      onRead={onRead}
                      onDelete={onDelete}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Footer info */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 p-3 bg-slate-50">
              <p className="text-xs text-slate-500 text-center">
                Total {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;