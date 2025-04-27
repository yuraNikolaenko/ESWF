// src/context/TabContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Типи вкладок
export const TabTypes = {
  SECTION: 'section',
  DIRECTORY_LIST: 'directoryList',
  DIRECTORY_ITEM: 'directoryItem',
  DOCUMENT_FORM: 'documentForm',
  CUSTOM: 'custom',
};

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  const addTab = (tab) => {
    setTabs((prevTabs) => {
      // Якщо вкладка з таким id вже відкрита, не додаємо ще раз
      const exists = prevTabs.some(t => t.id === tab.id);
      if (exists) return prevTabs;
      return [...prevTabs, tab];
    });
    setActiveTabId(tab.id);
  };

  const closeTab = (id) => {
    setTabs((prevTabs) => prevTabs.filter(tab => tab.id !== id));
    if (activeTabId === id) {
      setActiveTabId(null); // Якщо закрили активну вкладку
    }
  };

  const setActiveTab = (id) => {
    setActiveTabId(id);
  };

  return (
    <TabContext.Provider value={{ tabs, activeTabId, addTab, closeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => useContext(TabContext);
