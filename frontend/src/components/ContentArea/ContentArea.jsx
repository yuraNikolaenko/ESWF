import React from 'react';
import '../../styles/ContentArea.css';

const ContentArea = ({ children }) => {
  return (
    <main className="content-area">
      {children}
    </main>
  );
};

export default ContentArea;
