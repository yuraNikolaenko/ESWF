import React, { createContext, useState, useContext } from 'react';

export const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  const addTab = (tab) => {
    setTabs((prevTabs) => {
      const exists = prevTabs.some((t) => t.id === tab.id);
      if (exists) {
        setActiveTabId(tab.id); // Якщо вкладка вже є — активуємо її
        return prevTabs;        // НЕ додаємо дубль
      }
      return [...prevTabs, tab]; // Інакше додаємо нову вкладку
    });
    setActiveTabId(tab.id); // У будь-якому випадку активуємо вкладку
  };

  const closeTab = (id) => {
    setTabs((prevTabs) => {
      const filteredTabs = prevTabs.filter((tab) => tab.id !== id);
      if (activeTabId === id) {
        // Якщо закриваємо активну вкладку
        if (filteredTabs.length > 0) {
          setActiveTabId(filteredTabs[filteredTabs.length - 1].id); // Активуємо останню вкладку
        } else {
          setActiveTabId(null); // Взагалі немає вкладок
        }
      }
      return filteredTabs;
    });
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
