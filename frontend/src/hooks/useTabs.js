import { useContext } from 'react';
import { TabContext } from '../context/TabContext';

const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context;
};

export default useTabs;
