import React from 'react';
import '../../styles/Sidebar.css';
import sections from '../../config/sections';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {sections.map(section => (
        <button key={section.code} className="sidebar-section-btn">
          {section.name}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
