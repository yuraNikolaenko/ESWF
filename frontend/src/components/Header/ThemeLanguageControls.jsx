// components/header/ThemeLanguageControls.jsx
import React from "react";
import {
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const ThemeLanguageControls = ({
  theme,
  toggleTheme,
  toggleLanguage,
  onToggleChat,
}) => {
  return (
    <div className="header-controls">
      {onToggleChat && (
        <button className="theme-switcher-btn" onClick={onToggleChat}>
          <MessageOutlined />
        </button>
      )}
      <button className="theme-switcher-btn" onClick={toggleTheme}>
        {theme === "light" ? <MoonOutlined /> : <SunOutlined />}
      </button>
      <button className="theme-switcher-btn" onClick={toggleLanguage}>
        <GlobalOutlined />
      </button>
    </div>
  );
};

export default ThemeLanguageControls;
