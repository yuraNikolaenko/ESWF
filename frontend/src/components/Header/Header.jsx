import React, { useState } from "react";
import "../../styles/Header.css";
import sections from "../../config/sections";
import { useTheme } from "../../context/ThemeContext";
import useTabs from "../../hooks/useTabs"; // ➡️ Додаємо сюди useTabs
import { useLanguage } from "../../context/LanguageContext";
import { getDisplayName } from "../../utils/getDisplayName";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { addTab } = useTabs(); // ➡️ Підключаємо вкладки
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setActiveSection(null);
    setActiveGroup(null);
  };

  const handleItemClick = (item) => {
    // Додаємо вкладку
    addTab({
      id: `item-${item.code}`, // Унікальний ID вкладки
      title: getDisplayName(item, language),
      type: "directoryList", // Тип вкладки (можемо потім розширити)
      code: item.code, // Код елемента
      itemType: item.type,
      originalItem: item ,
      data: null,
    });

    // Показати повідомлення
    setToastMessage(`Selected: ${getDisplayName(item, language)}`);

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
      <div className="left-block">
        <div className="logo">LOGO</div>
        <button className="menu-button" onClick={toggleMenu}>☰</button>
      </div>

      {/* Меню */}
      {menuOpen && (
        <div
          className="dropdown-multimenu"
          style={{ width: activeGroup ? '640px' : activeSection ? '420px' : '200px' }}
        >
          <div className="menu-panel">
            {sections
              .filter(section => section.showInMenu)
              .map(section => (
                <div
                  key={section.code}
                  className="dropdown-item"
                  onClick={() => {
                    setActiveSection(section);
                    setActiveGroup(null);
                  }}
                >
                  {getDisplayName(section, language)}
                </div>
            ))}
          </div>

          {activeSection && (
            <div className="menu-panel">
              {activeSection.groups.map(group => (
                <div
                  key={group.groupName}
                  className="dropdown-item"
                  onClick={() => setActiveGroup(group)}
                >
                   {language === 'en' ? group.groupName : group.groupName_ua}
                </div>
              ))}
            </div>
          )}

          {activeGroup && (
            <div className="menu-panel">
              {activeGroup.items.map(item => (
                <div
                  key={item.code}
                  className="dropdown-item"
                  onClick={() => handleItemClick(item)}
                >
                  {getDisplayName(item, language)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Кнопки справа */}
      <div className="header-controls">
        <button className="theme-switcher-btn" onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
        <button className="theme-switcher-btn" onClick={toggleLanguage}>
          {language === 'en' ? 'UA' : 'EN'}
        </button>
        🔸 User
      </div>

      {/* Toast повідомлення */}
      {toastMessage && (
        <div className="toast">{toastMessage}</div>
      )}
    </header>
  );
};


export default Header;
