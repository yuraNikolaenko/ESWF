// components/masterdata/HeaderBar.jsx
import React from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";

const HeaderBar = ({ title, onClose }) => {
  return (
    <div className="header-bar">
      <div className="left-controls">
        <Button icon={<LeftOutlined />} type="text" />
        <Button icon={<RightOutlined />} type="text" />
        <span className="sheet-title">{title}</span>
      </div>
      <div className="right-controls">
        <Button icon={<CloseOutlined />} onClick={onClose} type="text" />
      </div>
    </div>
  );
};

export default HeaderBar;
