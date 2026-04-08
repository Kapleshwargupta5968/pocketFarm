import { motion } from "framer-motion";

const NotificationItem = ({ data, onRead, onDelete }) => {
  const getIconAndColor = (type) => {
    const typeMap = {
      SUBSCRIPTION: { icon: "🎉", bgGradient: "from-blue-500 to-blue-600", lightBg: "bg-blue-50" },
      UPDATE: { icon: "✏️", bgGradient: "from-purple-500 to-purple-600", lightBg: "bg-purple-50" },
      EXPIRY: { icon: "⏰", bgGradient: "from-orange-500 to-orange-600", lightBg: "bg-orange-50" },
      PAYMENT: { icon: "💰", bgGradient: "from-green-500 to-green-600", lightBg: "bg-green-50" }
    };
    return typeMap[type] || { icon: "📢", bgGradient: "from-slate-500 to-slate-600", lightBg: "bg-slate-50" };
  };

  const { icon, bgGradient, lightBg } = getIconAndColor(data.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, x: 4 }}
      onClick={() => onRead(data._id)}
      className={`group relative mb-3 rounded-xl cursor-pointer overflow-hidden transition-all duration-300 ${
        data.isRead ? lightBg : `bg-linear-to-r ${bgGradient}`
      } p-4 border-2 ${
        data.isRead ? "border-slate-200 hover:border-slate-300" : "border-transparent hover:shadow-lg"
      }`}
    >
      {/* Animated background gradient for unread */}
      {!data.isRead && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 opacity-20"
        />
      )}

      <div className="relative z-10">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-2">
          <motion.span
            animate={!data.isRead ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl shrink-0"
          >
            {icon}
          </motion.span>
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-sm leading-tight ${
              data.isRead ? "text-slate-700" : "text-white"
            }`}>
              {data.title}
            </p>
          </div>
          {!data.isRead && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-white shrink-0 mt-1"
            />
          )}
        </div>

        {/* Message */}
        <p className={`text-xs leading-relaxed mb-3 ${
          data.isRead ? "text-slate-600" : "text-white/90"
        }`}>
          {data.message}
        </p>

        {/* Footer with time and action */}
        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs ${
            data.isRead ? "text-slate-500" : "text-white/70"
          }`}>
            {new Date(data.createdAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>

          {/* Delete button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data._id);
            }}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              data.isRead 
                ? "bg-red-100 text-red-600 hover:bg-red-200" 
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            ✕
          </motion.button>
        </div>
      </div>

      {/* Hover effect line */}
      {data.isRead && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default NotificationItem;