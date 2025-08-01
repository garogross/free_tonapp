import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { init, miniApp } from '@telegram-apps/sdk'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './components/NotificationProvider';

const initializeTelegramSDK = async () => {
  try {
    await init();
    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('MiniApp is ready');
    }
  }
  catch (error) {
    console.error('Error initializing MiniApp SDK:', error);
  }
};

initializeTelegramSDK();

createRoot(document.getElementById('root')).render(
    <NotificationProvider>
      <App />
    </NotificationProvider>,
)
