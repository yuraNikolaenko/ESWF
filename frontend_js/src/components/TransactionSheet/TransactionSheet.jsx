import React from 'react';
import '../../styles/Sheet.css';

const TransactionSheet = ({ title }) => {
  return (
    <div className="sheet">
      <h2>Transaction Sheet</h2>
      <p>Document: {title}</p>
    </div>
  );
};

export default TransactionSheet;
