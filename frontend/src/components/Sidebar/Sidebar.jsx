import React, { useState, useEffect } from "react";
import "../../styles/Sidebar.css";
import sections from "../../config/sections";
import useTabs from "../../hooks/useTabs";
import { useLanguage } from "../../context/LanguageContext";
import { getDisplayName } from "../../utils/getDisplayName";
import { iconMapper } from "../../utils/iconMapper";

const Sidebar = () => {
  const { addTab } = useTabs();
  const { language } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSectionClick = (section) => {
    addTab({
      id: `section-${section.code}`,
      type: "sectionGroups",
      code: section.code,
      originalItem: section,
      data: section.groups,
    });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Викликати один раз при старті

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-sections">
        {sections
          .filter((section) => section.showInSidebar)
          .map((section) => (
            <button
              key={section.code}
              className="sidebar-section-btn"
              onClick={() => handleSectionClick(section)}
              title={isCollapsed ? getDisplayName(section, language) : ""} // ❗ Додаємо тултіп тільки якщо згорнутий
            >
              <span className="sidebar-icon">
                {section.icon && iconMapper[section.icon]}
              </span>
              {!isCollapsed && (
                <span className="sidebar-text">
                  {getDisplayName(section, language)}
                </span>
              )}
            </button>
          ))}
      </div>

      <button className="collapse-btn" onClick={toggleCollapse}>
        {isCollapsed ? "➤" : "◀"}
      </button>
    </aside>
  );
};

export default Sidebar;
