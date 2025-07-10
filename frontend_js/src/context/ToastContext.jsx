// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("info");

  const showToast = (msg, msgType = "info") => {
    setMessage(msg);
    setType(msgType);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className={`toast show ${type}`}>
          <span>{message}</span>
          <button className="toast-close" onClick={() => setMessage(null)}>
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};
