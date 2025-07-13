import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import {store} from './app/store.js'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.js'
const root =(document.getElementById('root'))as HTMLElement
createRoot(root).render
(
  <Provider store={store}>
    <StrictMode>
    <App />
    <Toaster position='top-right'/>
  </StrictMode>
  </Provider>
  
)
