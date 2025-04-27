import React, { useState } from 'react';
import '../../styles/Header.css';
import sections from '../../config/sections';
import { useTheme } from '../../context/ThemeContext';
import useTabs from '../../hooks/useTabs'; // ➡️ Додаємо сюди useTabs

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { addTab } = useTabs(); // ➡️ Підключаємо вкладки
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
    setActiveSection(null);
    setActiveGroup(null);
  };

  const handleItemClick = (item) => {
    // Додаємо вкладку
    addTab({
      id: `item-${item.code}`,  // Унікальний ID вкладки
      title: item.name,         // Назва вкладки
      type: 'directoryList',    // Тип вкладки (можемо потім розширити)
      code: item.code,          // Код елемента
      data: null
    });

    // Показати повідомлення
    setToastMessage(`Selected: ${item.name}`);
    
    // Плавне закриття меню
    setTimeout(() => {
      setToastMessage(null);
      setMenuOpen(false);
      setActiveSection(null);
      setActiveGroup(null);
    }, 1000);
  };

  return (
    <header className="header">
      {/* Ліва частина: Лого + Кнопка */}
      <div className="left-block">
        <div className="logo">ESWF</div>
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
                  onClick={() => handleItemClick(item)}
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
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        🔸 EN/UA 🔸 Admin | y.nikolaenko@gmial.com
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
