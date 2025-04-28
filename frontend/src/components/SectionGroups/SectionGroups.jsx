import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getDisplayName } from '../../utils/getDisplayName';
import { iconMapper } from '../../utils/iconMapper';
import useTabs from '../../hooks/useTabs';
import '../../styles/SectionGroups.css';

const SectionGroups = ({ sectionName, groups }) => {
  const { language } = useLanguage();
  const { addTab } = useTabs();
  const [visibleGroups, setVisibleGroups] = useState([]);

  useEffect(() => {
    let timeoutIds = [];
    groups.forEach((group, index) => {
      const timeoutId = setTimeout(() => {
        setVisibleGroups(prev => [...prev, group]);
      }, index * 150); // ❗ Затримка 150ms на кожну групу
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [groups]);

  const handleItemClick = (item) => {
    if (item.type === 'custom') {
      addTab({
        id: `custom-${item.code}`,
        type: 'customForm',
        itemType: item.type, 
        originalItem: item,
      });
    } else if (item.type === 'masterdata') {
      addTab({
        id: `masterdata-${item.code}`,
        type: 'masterdataSheet',
        itemType: item.type, 
        originalItem: item,
      });
    } else if (item.type === 'transactiondata') {
      addTab({
        id: `transactiondata-${item.code}`,
        type: 'transactionSheet',
        itemType: item.type, 
        originalItem: item,
      });
    }
  };

  return (
    <div className="section-groups-container">
      {groups.map((group, index) => (
        <div
          key={index}
          className={`group-card ${visibleGroups.includes(group) ? 'visible' : ''}`}
        >
          <div className="group-title">
            {language === 'en' ? group.groupName : group.groupName_ua}
          </div>
          <div className="group-items">
            {group.items.map(item => (
              <button
                key={item.code}
                className="group-item-btn"
                onClick={() => handleItemClick(item)}
              >
                {item.icon && (
                  <span style={{ marginRight: '8px' }}>
                    {iconMapper[item.icon]}
                  </span>
                )}
                {getDisplayName(item, language)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionGroups;
