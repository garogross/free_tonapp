import React, { useState, useCallback } from 'react';
import { NotificationContext } from './NotificationContext';
import './NotificationStyles.css';

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, duration = 3000) => {
    const id = Date.now();
    setNotifications([{ id, message, type: 'normal' }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  const showError = useCallback((message, duration = 3000) => {
    const id = Date.now();
    setNotifications([{ id, message, type: 'error' }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, showError }}>
      {children}
      <div className="notification-wrapper">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={type === 'error' ? 'notification-error' : 'notification'}>
            {message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
