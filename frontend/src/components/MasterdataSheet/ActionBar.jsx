// components/masterdata/ActionBar.jsx
import React from "react";
import { Button, Input } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  MoreOutlined,
  FileAddOutlined,
  StopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ActionBar = ({
  onCreate,
  onEdit,
  onRefresh,
  onSearchChange,
  searchRef,
  menuOpen,
  toggleMenu,
  contextPos,
  menuRef,
  onMark,
}) => {
  return (
    <div className="action-bar">
      <div className="left-buttons">
        <Button icon={<PlusOutlined />} type="primary" onClick={onCreate}>New</Button>
        <Button icon={<EditOutlined />} onClick={onEdit}>Edit</Button>
        <Button icon={<ReloadOutlined />} onClick={onRefresh} type="default">Refresh</Button>
        <Input.Search
          allowClear
          placeholder="Search..."
          onChange={onSearchChange}
          style={{ width: 280, marginLeft: 12 }}
          className="themed-search"
          ref={searchRef}
        />
      </div>

      <div className="right-dropdown" ref={menuRef}>
        <Button
          icon={<MoreOutlined />}
          type="text"
          onClick={toggleMenu}
        />
        {menuOpen && (
          <div
            className="custom-dropdown-menu"
            style={{
              position: 'fixed',
              top: contextPos.y,
              left: contextPos.x,
              zIndex: 1000,
            }}
          >
            <div className="menu-item"><FileAddOutlined /> Create</div>
            <div className="menu-item"><EditOutlined /> Edit</div>
            <div className="menu-divider" />
            <div className="menu-item" onClick={onMark}><StopOutlined /> Mark for deletion</div>
            <div className="menu-item"><DeleteOutlined /> Delete</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
