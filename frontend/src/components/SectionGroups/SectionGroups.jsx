import React from 'react';
import { Collapse } from 'antd';
import { useLanguage } from '../../context/LanguageContext';
import { getDisplayName } from '../../utils/getDisplayName';
import { iconMapper } from '../../utils/iconMapper';
import useTabs from '../../hooks/useTabs';
import '../../styles/SectionGroups.css';

const { Panel } = Collapse;

const SectionGroups = ({ sectionName, groups }) => {
  const { language } = useLanguage();
  const { addTab } = useTabs();

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
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="group-card visible">
          <div className="group-title">
            {language === 'en' ? group.groupName : group.groupName_ua}
          </div>
          {/* Якщо у групи є підгрупи — Collapse по підгрупах */}
          {group.subgroups && group.subgroups.length > 0 ? (
            <Collapse
              defaultActiveKey={['0']}
              ghost
              className="group-collapse"
            >
              {group.subgroups.map((subgroup, idx) => (
                <Panel
                  header={language === 'en' ? subgroup.subgroupName : subgroup.subgroupName_ua}
                  key={String(idx)}
                  className="subgroup-panel"
                >
                  <div className="group-items">
                    {subgroup.items.map(item => (
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
                </Panel>
              ))}
            </Collapse>
          ) : (
            // Якщо підгруп нема — просто список довідників
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
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionGroups;
