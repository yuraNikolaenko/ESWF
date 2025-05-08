import React from 'react';
import useTabs from '../../hooks/useTabs';
import Dashboard from '../../pages/Dashboard';
import SectionGroups from '../SectionGroups/SectionGroups';
import MasterdataSheet from '../MasterdataSheet'; 
import MasterdataForm from '../MasterdataForm/MasterdataForm'; 
import TransactionSheet from '../TransactionSheet/TransactionSheet';
import CustomForm from '../CustomForm/CustomForm';
import { ItemType } from '../../config/itemTypes'; // потрібен для визначення типу
import '../../styles/ContentArea.css';

const ContentArea = () => {
  const { tabs, activeTabId } = useTabs();
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const renderContent = () => {
    if (!activeTab) return <Dashboard />;

    // Якщо вкладка розділу
    if (activeTab.type === 'sectionGroups') {
      return <SectionGroups sectionName={activeTab.title} groups={activeTab.data} />;
    }
    if (activeTab.type === 'directoryItem') {
      return <MasterdataForm data={activeTab.data} originalItem={activeTab.originalItem} />;
    }

    // Якщо вкладка ітема
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
