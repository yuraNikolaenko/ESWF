import React from 'react';
import useTabs from '../../hooks/useTabs';
import '../../styles/FooterTabs.css';

const FooterTabs = () => {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabs();

  return (
    <div className="footer-tabs">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab-item ${tab.id === activeTabId ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}  // ⬅️ Додаємо клік по вкладці
        >
          <span className="tab-title">
            {tab.title}
          </span>
          <button
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation(); // щоб не переключалась вкладка при закритті
              closeTab(tab.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default FooterTabs;
