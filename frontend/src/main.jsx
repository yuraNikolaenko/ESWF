// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import 'antd/dist/reset.css';

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TabProvider } from './context/TabContext';
import { ToastProvider } from './context/ToastContext'; // ← додали

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './styles/index.css';
import './styles/light-theme.css';
import './styles/dark-theme.css';
import './styles/toast.css'; // ← стилі для toast

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TabProvider>
            <ToastProvider> {/* ← обгорнули App */}
              <App />
            </ToastProvider>
          </TabProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
