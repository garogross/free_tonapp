import React, { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { init, miniApp, retrieveRawInitData } from '@telegram-apps/sdk'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './components/NotificationProvider'

function Root() {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [sdkInitialized, setSdkInitialized] = useState(false)

  useEffect(() => {
    const initializeTelegramSDK = async () => {
      try {
        await init()
        if (miniApp.ready.isAvailable()) {
          await miniApp.ready()
          console.log('MiniApp is ready')
        }
        setSdkInitialized(true)
      } catch (error) {
        console.error('Error initializing MiniApp SDK:', error)
        setSdkInitialized(true);
      }
    }
    initializeTelegramSDK()
  }, [])

  useEffect(() => {
    if (!sdkInitialized) return

    const fetchUser = async () => {
      try {
        const dataRaw = retrieveRawInitData()
        const response = await axios.get('/api/login', {
          headers: { Authorization: 'tma ' + dataRaw }
        })
        setUser(response.data.user)
      } catch (error) {
        setUser(null)
      } finally {
        setLoadingUser(false)
      }
    }

    fetchUser()
  }, [sdkInitialized])

  if (loadingUser) {
    return <div></div>
  }

  return (
    <NotificationProvider>
      <App user={user} loadingUser={loadingUser} />
    </NotificationProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <Root />
)
