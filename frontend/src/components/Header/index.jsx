// components/header/index.jsx
import React, { useState } from "react";
import "./Header.css";
import sections from "../../config/sections";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import useTabs from "../../hooks/useTabs";
import { useToast } from "../../context/ToastContext";

import MultiLevelMenu from "./MultiLevelMenu";
import UserDropdown from "./UserDropdown";
import ThemeLanguageControls from "./ThemeLanguageControls";

const Header = ({ onToggleChat }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { addTab } = useTabs();
  const { showToast } = useToast(); // ← глобальний тост

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setActiveSection(null);
    setActiveGroup(null);
  };

  const handleItemClick = (item) => {
    addTab({
      id: `item-${item.code}`,
      title: item.name || item.code,
      type: "directoryList",
      code: item.code,
      itemType: item.type,
      originalItem: item,
      data: null,
    });

    showToast(`Selected: ${item.name || item.code}`, "info");

    setTimeout(() => {
      setMenuOpen(false);
      setActiveSection(null);
      setActiveGroup(null);
    }, 300);
  };

  return (
    <header className="header">
      <div className="left-block">
        <div className="logo">ESWF</div>
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <MultiLevelMenu
        menuOpen={menuOpen}
        sections={sections}
        language={language}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
        handleItemClick={handleItemClick}
      />

      <ThemeLanguageControls
        theme={theme}
        toggleTheme={toggleTheme}
        toggleLanguage={toggleLanguage}
        onToggleChat={onToggleChat}
      />

      <UserDropdown theme={theme} />
    </header>
  );
};

export default Header;
