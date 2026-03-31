import React from 'react'

const NotificationItem = () => {
  return (
    <>
      <div onClick={() => onRead(data._id)} className={`p-2 mb-2 rounded-xs cursor-pointer ${data.isRead ? 'bg-gray-100' : 'bg-blue-100'}`}>
        <p className='font-medium'>{data.title}</p>
        <p className='text-sm text-gray-600'>{data.message}</p>
        <p className='text-xs text-gray-500'>{new Date(data.createdAt).toLocaleString()}</p>
      </div>

      <button className='text-xs text-red-500 mt-1' onClick={() => onDelete(data._id)}>Delete</button>
    </>
  )
}

export default NotificationItem
