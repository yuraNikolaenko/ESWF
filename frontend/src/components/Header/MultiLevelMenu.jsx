// components/header/MultiLevelMenu.jsx
import React from "react";
import { getDisplayName } from "../../utils/getDisplayName";
import { iconMapper } from "../../utils/iconMapper";

const MultiLevelMenu = ({
  menuOpen,
  sections,
  language,
  activeSection,
  setActiveSection,
  activeGroup,
  setActiveGroup,
  handleItemClick,
}) => {
  if (!menuOpen) return null;

  const menuWidth =
    activeSection && activeGroup ? "800px" : activeSection ? "520px" : "200px";

  return (
    <div className="dropdown-multimenu" style={{ width: menuWidth }}>
      {/* Рівень 1: Секції */}
      <div className="menu-panel">
        {sections
          .filter((section) => section.showInMenu)
          .map((section, index) => (
            <React.Fragment key={section.code}>
              <div
                className={`dropdown-item small-text ${
                  activeSection?.code === section.code ? "active" : ""
                }`}
                onMouseEnter={() => {
                  setActiveSection(section);
                  setActiveGroup(null);
                }}
              >
                {section.icon && (
                  <span style={{ marginRight: 6 }}>
                    {iconMapper[section.icon]}
                  </span>
                )}
                {getDisplayName(section, language)}
              </div>
              {index !== sections.length - 1 && (
                <div className="dropdown-divider" />
              )}
            </React.Fragment>
          ))}
      </div>

      {/* Рівень 2: Групи */}
      {activeSection && (
        <div className="menu-panel">
          {activeSection.groups.map((group, index) => (
            <React.Fragment key={group.groupName}>
              <div
                className={`dropdown-item small-text ${
                  activeGroup?.groupName === group.groupName ? "active" : ""
                }`}
                onMouseEnter={() => setActiveGroup(group)}
              >
                {group.icon && (
                  <span style={{ marginRight: 6 }}>
                    {iconMapper[group.icon]}
                  </span>
                )}
                {language === "en"
                  ? group.groupName
                  : group.groupName_ua || group.groupName}
              </div>
              {index !== activeSection.groups.length - 1 && (
                <div className="dropdown-divider" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Рівень 3: Пункти */}
      {activeGroup && (
        <div className="menu-panel">
          {activeGroup.items.map((item, index) => (
            <React.Fragment key={item.code}>
              <div
                className="dropdown-item small-text"
                onClick={() => handleItemClick(item)}
              >
                {item.icon && (
                  <span style={{ marginRight: 6 }}>
                    {iconMapper[item.icon]}
                  </span>
                )}
                {getDisplayName(item, language)}
              </div>
              {index !== activeGroup.items.length - 1 && (
                <div className="dropdown-divider" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiLevelMenu;
