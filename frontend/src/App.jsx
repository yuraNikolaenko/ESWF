import React from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ContentArea from './components/ContentArea/ContentArea';
import FooterTabs from './components/FooterTabs/FooterTabs';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext'; // додано
import './styles/index.css';
import './styles/light-theme.css'; // Default light theme
import './styles/dark-theme.css';  // Default dark theme

const App = () => {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Header />
        <div className="main-area">
          <Sidebar />
          <ContentArea>
            <Dashboard />
          </ContentArea>
        </div>
        <FooterTabs />
      </div>
    </ThemeProvider>
  );
};

export default App;
