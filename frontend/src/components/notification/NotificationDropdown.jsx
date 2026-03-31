import React from 'react'
import NotificationItem from './NotificationItem'

const NotificationDropdown = ({notifications, onRead, onDelete, onMarkAllRead}) => {
  return (
    <>
      <div className='absolute right-0 top-12 w-80 bg-white shadow-lg rounded-lg p-3 z-50'>
        <h3 className='font-semibold mb-2'>Notifications</h3>

        <button className='text-xs text-blue-500 mb-3' onClick={onMarkAllRead}>Mark all as read</button>
        
        {
            notifications.length === 0 ? (
                <p className='text-gray-500 text-sm'>No notifications</p>
            ) : (
                notifications.map((eachNotification) => (
                    <NotificationItem key={eachNotification.id} data={eachNotification} onRead={onRead} onDelete={onDelete} />
                ))
            )
        }
      </div>
    </>
  )
}

export default NotificationDropdown
