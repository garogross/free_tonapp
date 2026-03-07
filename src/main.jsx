import { init, miniApp } from "@telegram-apps/sdk";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { api } from "./api/axios.js";
import App from "./App.jsx";
import { NotificationProvider } from "./components/NotificationProvider";
import "./styles/_global.scss";

function Root() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sdkInitialized, setSdkInitialized] = useState(false);

  useEffect(() => {
    const initializeTelegramSDK = async () => {
      try {
        await init();
        if (miniApp.ready.isAvailable()) {
          await miniApp.ready();
          console.log("MiniApp is ready");
        }
        setSdkInitialized(true);
      } catch (error) {
        console.error("Error initializing MiniApp SDK:", error);
        setSdkInitialized(true);
      }
    };
    initializeTelegramSDK();
  }, []);

  useEffect(() => {
    if (!sdkInitialized) return;

    const fetchUser = async () => {
      try {
        const response = await api.get("/api/login");
        setUser(response.data.user);
      } catch (error) {
        console.error("fetch  user error", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [sdkInitialized]);

  if (loadingUser) {
    return <div></div>;
  }

  return (
    <NotificationProvider>
      <App user={user} loadingUser={loadingUser} />
    </NotificationProvider>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
