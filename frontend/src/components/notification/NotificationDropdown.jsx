import NotificationItem from "./NotificationItem";

const NotificationDropdown = ({
  notifications = [],
  onRead,
  onDelete,
  onMarkAll
}) => {
  return (
    <div className="absolute right-0 top-12 w-80 bg-white shadow-lg rounded-lg p-3 z-50">

  
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Notifications</h3>

        <button
          onClick={onMarkAll}
          className="text-xs text-blue-500"
        >
          Mark all
        </button>
      </div>

    
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No notifications
        </p>
      ) : (
        notifications.map((n) => (
          <NotificationItem
            key={n._id}
            data={n}
            onRead={onRead}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default NotificationDropdown;