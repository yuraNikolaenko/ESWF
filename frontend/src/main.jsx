import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import 'antd/dist/reset.css';

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TabProvider } from './context/TabContext'; 
// Якщо з'явиться Router — теж додається тут

import './styles/index.css';
import './styles/light-theme.css';
import './styles/dark-theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <TabProvider>
          <App />
        </TabProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
