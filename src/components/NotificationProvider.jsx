import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { NotificationContext } from "./NotificationContext";
import "./NotificationStyles.scss";

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, duration = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications([{ id, message, type: "normal", duration }]);
    setTimeout(() => {
      // setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  const showError = useCallback((message, duration = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications([{ id, message, type: "error", duration }]);
    setTimeout(() => {
      // setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, showError }}>
      {children}
      <div className="notification-wrapper">
        {notifications.map(({ id, message, type, duration }) => (
          <div
            key={id}
            className={clsx(
              "notification",
              type === "error" && "notification-error",
            )}
            style={{ animationDuration: `${duration}ms` }}
          >
            {message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
