export const getDisplayName = (item, language) => {
    if (!item) return '';
    return language === 'en' ? item.name : item.name_ua;
  };
  