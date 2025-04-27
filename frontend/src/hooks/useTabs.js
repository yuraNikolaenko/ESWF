import { useContext } from 'react';
import { useTabContext } from '../context/TabContext';

const useTabs = () => {
  const context = useTabContext();
  if (!context) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context;
};

export default useTabs;
