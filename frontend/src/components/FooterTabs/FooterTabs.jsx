import React from 'react';
import useTabs from '../../hooks/useTabs';
import '../../styles/FooterTabs.css';

const FooterTabs = () => {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabs();

  return (
    <div className="footer-tabs">
      {tabs.length > 0 && tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab-item ${tab.id === activeTabId ? 'active' : ''}`}
        >
          <span
            className="tab-title"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
          </span>
          <button
            className="close-btn"
            onClick={() => closeTab(tab.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default FooterTabs;
