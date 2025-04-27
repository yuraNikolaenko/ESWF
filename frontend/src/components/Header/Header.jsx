import React, { useState } from 'react';
import '../../styles/Header.css';
import sections from '../../config/sections';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
    setActiveSection(null);
    setActiveGroup(null);
  };

  const handleItemClick = (itemName) => {
    setToastMessage(`Selected: ${itemName}`);
    
    setTimeout(() => {
      setToastMessage(null);
      setMenuOpen(false);
      setActiveSection(null);
      setActiveGroup(null);
    }, 2000); // Плавне закриття після вибору
  };

  return (
    <header className="header">
      {/* Ліва частина: Лого + Кнопка */}
      <div className="left-block">
        <div className="logo">LOGO</div>
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Меню */}
      {menuOpen && (
        <div
          className="dropdown-multimenu"
          style={{
            width: activeGroup ? '640px' : activeSection ? '420px' : '200px'
          }}
        >
          {/* Sections */}
          <div className="menu-panel">
            {sections.map(section => (
              <div
                key={section.code}
                className="dropdown-item"
                onClick={() => {
                  setActiveSection(section);
                  setActiveGroup(null);
                }}
              >
                {section.name}
              </div>
            ))}
          </div>

          {/* Groups */}
          {activeSection && (
            <div className="menu-panel">
              {activeSection.groups.map(group => (
                <div
                  key={group.groupName}
                  className="dropdown-item"
                  onClick={() => setActiveGroup(group)}
                >
                  {group.groupName}
                </div>
              ))}
            </div>
          )}

          {/* Items */}
          {activeGroup && (
            <div className="menu-panel">
              {activeGroup.items.map(item => (
                <div
                  key={item.code}
                  className="dropdown-item"
                  onClick={() => handleItemClick(item.name)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Права частина: Кнопки */}
      <div className="header-controls">
        <button className="theme-switcher-btn" onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
        🔸 Language | User
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
    </header>
  );
};

export default Header;
