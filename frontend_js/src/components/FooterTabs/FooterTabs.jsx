import React from 'react';
import useTabs from '../../hooks/useTabs';
import '../../styles/FooterTabs.css';
import { useLanguage } from '../../context/LanguageContext';
import { getDisplayName } from '../../utils/getDisplayName'; // ❗ Додаємо


const FooterTabs = () => {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabs();
  const { language } = useLanguage(); // ❗ Отримуємо мову


  return (
    <div className="footer-tabs">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab-item ${tab.id === activeTabId ? 'active' : ''}`}
        >
          <span
            className="tab-title"
            onClick={() => setActiveTab(tab.id)}
          >
            {/* Тут беремо правильну назву */}
            {tab.originalItem ? getDisplayName(tab.originalItem, language) : tab.title}
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
