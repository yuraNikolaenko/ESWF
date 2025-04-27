import React, { createContext, useState, useContext } from 'react';

export const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  const addTab = (tab) => {
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
  };

  const closeTab = (id) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeTabId === id && tabs.length > 0) {
      setActiveTabId(tabs[0].id);
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
