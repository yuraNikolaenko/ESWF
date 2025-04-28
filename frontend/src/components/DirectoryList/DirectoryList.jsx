import React from 'react';
import '../../styles/DirectoryList.css';

const DirectoryList = ({ title }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Directory Selected:</h2>
      <p style={{ fontSize: '18px' }}>
        {title}
      </p>
    </div>
  );
};

export default DirectoryList;
