import React from 'react';
import useTabs from '../../hooks/useTabs';
import '../../styles/SectionGroups.css'; // Додамо окремий стиль для краси

const SectionGroups = ({ sectionName, groups }) => {
  const { addTab } = useTabs();

  const handleItemClick = (item) => {
    addTab({
      id: `item-${item.code}`,
      title: item.name,
      type: 'directoryList', // або потім підлаштуємо під тип
      code: item.code,
      itemType: item.type,
      data: null,
    });
  };

  return (
    <div className="section-groups">
      <h2 className="section-title">{sectionName}</h2>
      <div className="groups-container">
        {groups.map(group => (
          <div key={group.groupName} className="group-card">
            <div className="group-title">{group.groupName}</div>
            <div className="group-items">
              {group.items.map(item => (
                <button
                  key={item.code}
                  onClick={() => handleItemClick(item)}
                  className="group-item-btn"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGroups;
