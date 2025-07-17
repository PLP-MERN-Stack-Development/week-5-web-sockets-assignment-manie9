"use client"

import { useEffect, useState } from "react"
import { useSocketContext } from "../context/SocketContext"
import { X, Bell } from "lucide-react"

const NotificationPanel = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const { notifications } = useSocketContext()
  const [recentNotifications, setRecentNotifications] = useState([])

  useEffect(() => {
    // Keep only recent notifications (last 10)
    setRecentNotifications(notifications.slice(-10))
  }, [notifications])

  if (recentNotifications.length === 0) return null

  return (
    <>
      {/* Notification bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
      >
        <Bell className="h-6 w-6" />
        {recentNotifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {recentNotifications.length}
          </span>
        )}
      </button>

      {/* Notification panel */}
      {showNotifications && (
        <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="p-4">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default NotificationPanel
