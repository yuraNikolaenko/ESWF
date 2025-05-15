import React from 'react';
import useTabs from '../../hooks/useTabs';
import Dashboard from '../../pages/Dashboard';
import SectionGroups from '../SectionGroups/SectionGroups';
import MasterdataSheet from '../MasterdataSheet'; 
import MasterdataForm from '../MasterdataForm/MasterdataForm'; 
import TransactionSheet from '../TransactionSheet/TransactionSheet';
import CustomForm from '../CustomForm/CustomForm';
import { ItemType } from '../../config/itemTypes';
import '../../styles/ContentArea.css';

const ContentArea = () => {
  const { tabs, activeTabId } = useTabs();
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const renderContent = () => {
    if (!activeTab) return <Dashboard />;

    // Вкладка типу: розділ з групами
    if (activeTab.type === 'sectionGroups') {
      return <SectionGroups sectionName={activeTab.title} groups={activeTab.data} />;
    }

    // 🔥 Додано: підтримка custom-вкладок (наприклад, Додатки)
    if (activeTab.type === 'custom' && activeTab.content) {
      return activeTab.content;
    }

    // Вкладка редагування елемента
    if (activeTab.type === 'directoryItem') {
      return <MasterdataForm data={activeTab.data} originalItem={activeTab.originalItem} />;
    }

    // Вкладка з ітемом (довідник, документ, тощо)
    switch (activeTab.itemType) {
      case ItemType.MASTERDATA:
        return <MasterdataSheet title={activeTab.title} originalItem={activeTab.originalItem} />;
      case ItemType.TRANSACTIONDATA:
        return <TransactionSheet title={activeTab.title} />;
      case ItemType.CUSTOM:
        return <CustomForm title={activeTab.title} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="content-area">
      {renderContent()}
    </div>
  );
};

export default ContentArea;
