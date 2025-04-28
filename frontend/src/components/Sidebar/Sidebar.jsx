import React from 'react';
import '../../styles/Sidebar.css';
import sections from '../../config/sections';
import useTabs from '../../hooks/useTabs';

const Sidebar = () => {
  const { addTab } = useTabs();

  const handleSectionClick = (section) => {
    addTab({
      id: `section-${section.code}`,
      title: section.name,
      type: 'sectionGroups',
      code: section.code,
      data: section.groups
    });
  };

  return (
    <aside className="sidebar">
      {sections
        .filter(section => section.showInSidebar) // ❗ Показуємо тільки ті що мають showInSidebar: true
        .map(section => (
          <button
            key={section.code}
            className="sidebar-section-btn"
            onClick={() => handleSectionClick(section)}
          >
            {section.name}
          </button>
      ))}
    </aside>
  );
};

export default Sidebar;
