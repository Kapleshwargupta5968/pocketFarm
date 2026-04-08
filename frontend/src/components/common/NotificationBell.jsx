import { motion } from "framer-motion";

const NotificationBell = ({ count = 0, onClick, isOpen = false }) => {
  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover="hover"
      initial="normal"
      onClick={onClick}
    >
      <motion.div
        variants={{
          normal: {
            scale: 1,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          },
          hover: {
            scale: 1.08,
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)"
          }
        }}
        transition={{ duration: 0.3 }}
        className="w-10 h-10 rounded-full bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center border-2 border-slate-200 hover:border-slate-300 transition-colors relative overflow-hidden"
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-white/30"
          animate={{
            x: ["0%", "400%"],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          style={{
            transform: "skewX(-20deg)"
          }}
        />

        {/* Bell icon */}
        <motion.svg
          className="w-6 h-6 text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={isOpen ? { rotate: 10 } : {}}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </motion.svg>

        {/* Notification Badge */}
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.15 }}
            className="absolute -top-2 -right-2 bg-linear-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg"
          >
            <span>{count > 99 ? "99+" : count}</span>
          </motion.div>
        )}

        {/* Pulse animation when new notifications */}
        {count > 0 && (
          <motion.div
            animate={{ scale: [1, 1.3], opacity: [1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-red-500"
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default NotificationBell;
