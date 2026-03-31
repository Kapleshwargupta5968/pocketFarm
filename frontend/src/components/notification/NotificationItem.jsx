const NotificationItem = ({ data, onRead, onDelete }) => {
  return (
    <div
      onClick={() => onRead(data._id)}
      className={`p-2 mb-2 rounded-sm cursor-pointer ${
        data.isRead ? "bg-gray-100" : "bg-blue-100"
      }`}
    >
      <p className="font-medium">{data.title}</p>

      <p className="text-sm text-gray-600">
        {data.message}
      </p>

      <p className="text-xs text-gray-500">
        {new Date(data.createdAt).toLocaleString()}
      </p>


      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onDelete(data._id);
        }}
        className="text-xs text-red-500 mt-1"
      >
        Delete
      </button>
    </div>
  );
};

export default NotificationItem;