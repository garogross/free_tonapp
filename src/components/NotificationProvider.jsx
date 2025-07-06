import React, { useState, useCallback } from 'react';
import { NotificationContext } from './NotificationContext';
import './NotificationStyles.css';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, duration = 3000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="notification-wrapper">
        {notifications.map(({ id, message }) => (
          <div key={id} className="notification">{message}</div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
