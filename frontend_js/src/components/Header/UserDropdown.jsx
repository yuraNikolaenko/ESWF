// components/header/UserDropdown.jsx
import React from "react";
import { Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const UserDropdown = ({ theme }) => {
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      trigger={["click"]}
      overlayClassName="user-dropdown-menu-container"
    >
      <a className="user-link" onClick={(e) => e.preventDefault()}>
        <Avatar
          size="small"
          icon={<UserOutlined />}
          style={{
            backgroundColor: theme === "light" ? "#87d068" : "#555",
            marginRight: 8,
          }}
        />
        Administrator
      </a>
    </Dropdown>
  );
};

export default UserDropdown;
