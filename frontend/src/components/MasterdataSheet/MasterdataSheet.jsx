import React from 'react';
import '../../styles/Sheet.css'; // Стилі можна поки спільні

const MasterdataSheet = ({ title }) => {
  return (
    <div className="sheet">
      <h2>Master Data Sheet</h2>
      <p>Directory: {title}</p>
    </div>
  );
};

export default MasterdataSheet;
