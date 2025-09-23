import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // ✅ import AuthProvider
import { NotificationProvider } from "./context/NotificationContext";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
    <AuthProvider> {/* ✅ Wrap App with AuthProvider */}
      
        <App />
      
    </AuthProvider>
    </NotificationProvider>
  </StrictMode>,
);
