import React from 'react';
import '../../styles/Sheet.css';

const CustomForm = ({ title }) => {
  return (
    <div className="sheet">
      <h2>Custom Form</h2>
      <p>Process: {title}</p>
    </div>
  );
};

export default CustomForm;
