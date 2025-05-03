import React, { useState } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ContentArea from './components/ContentArea/ContentArea';
import FooterTabs from './components/FooterTabs/FooterTabs';
import Dashboard from './pages/Dashboard';
import ChatPanel from './components/ChatPanel/ChatPanel';

import './styles/index.css';

const App = () => {
  const [isChatVisible, setChatVisible] = useState(false);

  const toggleChat = () => {
    setChatVisible((prev) => !prev);
  };

  return (
    <div className="app-container">
      <Header onToggleChat={toggleChat} />
      <div className="main-area">
        <Sidebar />
        <ContentArea>
          <Dashboard />
        </ContentArea>
        <ChatPanel isVisible={isChatVisible} />
      </div>
      <FooterTabs />
    </div>
  );
};

export default App;
