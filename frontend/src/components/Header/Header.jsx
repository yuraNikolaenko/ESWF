import React, { useState } from "react";
import "../../styles/Header.css";
import sections from "../../config/sections";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import useTabs from "../../hooks/useTabs";
import { getDisplayName } from "../../utils/getDisplayName";

import {
  GlobalOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { SettingOutlined, LogoutOutlined } from "@ant-design/icons";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { addTab } = useTabs();

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
    addTab({
      id: `item-${item.code}`,
      title: getDisplayName(item, language),
      type: "directoryList",
      code: item.code,
      itemType: item.type,
      originalItem: item,
      data: null,
    });

    setToastMessage(`Selected: ${getDisplayName(item, language)}`);

    setTimeout(() => {
      setToastMessage(null);
      setMenuOpen(false);
      setActiveSection(null);
      setActiveGroup(null);
    }, 500);
  };

  const userMenu = (
    <Menu className="user-dropdown-menu">
      <Menu.Item key="profile" icon={<UserOutlined />} className="user-dropdown-item">
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} className="user-dropdown-item">
        Settings
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} className="user-dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );
  

  return (
    <header className="header">
      {/* Ліва частина: Лого та кнопка меню */}
      <div className="left-block">
        <div className="logo">LOGO</div>
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* Меню навігації */}
      {menuOpen && (
        <div
          className="dropdown-multimenu"
          style={{
            width: activeGroup ? "640px" : activeSection ? "420px" : "200px",
          }}
        >
          <div className="menu-panel">
            {sections
              .filter((section) => section.showInMenu)
              .map((section) => (
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
              {activeSection.groups.map((group) => (
                <div
                  key={group.groupName}
                  className="dropdown-item"
                  onClick={() => setActiveGroup(group)}
                >
                  {language === "en" ? group.groupName : group.groupName_ua}
                </div>
              ))}
            </div>
          )}

          {activeGroup && (
            <div className="menu-panel">
              {activeGroup.items.map((item) => (
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

      {/* Права частина: Теми, Мова, Користувач */}
      <div className="header-controls">
        <button className="theme-switcher-btn" onClick={toggleTheme}>
          {theme === "light" ? <MoonOutlined /> : <SunOutlined />}
        </button>
        <button className="theme-switcher-btn" onClick={toggleLanguage}>
          <GlobalOutlined />
        </button>
        <Dropdown
          overlay={userMenu}
          placement="bottomRight"
          trigger={["click"]}
        >
          <a className="user-link" onClick={(e) => e.preventDefault()}>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{
                backgroundColor: theme === "light" ? "#87d068" : "#555555",
                marginRight: 8,
              }}
            />
            Administrator
          </a>
        </Dropdown>
      </div>

      {/* Toast-повідомлення */}
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </header>
  );
};

export default Header;
