import React from 'react';
import '../../styles/Sidebar.css';
import sections from '../../config/sections';
import useTabs from '../../hooks/useTabs';
import { useLanguage } from '../../context/LanguageContext'; // ❗ Додаємо
import { getDisplayName } from '../../utils/getDisplayName'; // ❗ Додаємо

const Sidebar = () => {
  const { addTab } = useTabs();
  const { language } = useLanguage(); 

  const handleSectionClick = (section) => {
    addTab({
      id: `section-${section.code}`,
      title: section.name,
      type: 'sectionGroups',
      code: section.code,
      data: section.groups,
      originalItem: section  
    });
  };

  return (
    <aside className="sidebar">
      {sections
        .filter(section => section.showInSidebar)
        .map(section => (
          <button
            key={section.code}
            className="sidebar-section-btn"
            onClick={() => handleSectionClick(section)}
          >
            {getDisplayName(section, language)}
          </button>
      ))}
    </aside>
  );
};

export default Sidebar;
