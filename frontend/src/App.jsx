import React from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ContentArea from './components/ContentArea/ContentArea';
import FooterTabs from './components/FooterTabs/FooterTabs';
import Dashboard from './pages/Dashboard';

import './styles/index.css';


const App = () => {
  return (
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
  );
};

export default App;
