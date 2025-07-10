// components/panels/ApplicationsPanel.jsx
import React from "react";
import { Card, Tag, Space, Button, message } from "antd";
import { iconMapper } from "../../utils/iconMapper";
import sections from "../../config/sections";
import useTabs from "../../hooks/useTabs";
import "./ApplicationsPanel.css";

const ApplicationsPanel = () => {
  const apps = sections.find((s) => s.code === "applications")?.groups[0]?.items || [];
  const { addTab } = useTabs();

  const renderPrice = (price) => {
    if (price === "free") {
      return <Tag className="app-tag-free">Free</Tag>;
    } else {
      return <Tag className="app-tag-paid">Paid</Tag>;
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "installed":
        return <Tag className="app-tag-installed">Installed</Tag>;
      case "activated":
        return <Tag className="app-tag-activated">Activated</Tag>;
      default:
        return null;
    }
  };

  const handleInstall = (app) => {
    if (app.link) {
      window.open(app.link, "_blank");
    } else {
      message.info(`Link for "${app.name}" not specified`);
    }
  };

  const handleOpen = (app) => {
    const section = sections.find((s) => s.code === app.code);
    if (section) {
      addTab({
        id: `section-${section.code}`,
        title: section.name_ua || section.name,
        type: "sectionGroups",
        data: section.groups,
      });
    } else {
      message.warning(`Section "${app.name}" not found in config`);
    }
  };

  const renderActionButton = (app) => {
    if (app.status === "available") {
      return (
        <Button className="app-button" onClick={() => handleInstall(app)}>
          Install
        </Button>
      );
    }
    if (app.status === "activated") {
      return (
        <Button className="app-button" onClick={() => handleOpen(app)}>
          Open
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="applications-panel">
      {apps.map((app) => (
        <Card
          key={app.code}
          className="app-card"
          title={
            <span className="app-card-title">
              {app.icon && iconMapper[app.icon]}{" "}
              <span style={{ marginLeft: 8 }}>{app.name}</span>
            </span>
          }
          headStyle={{
            backgroundColor: "var(--tab-header-background, var(--tab-background))",
          }}
        >
          <p className="app-card-description">{app.description}</p>
          <Space size="middle">
            {renderPrice(app.price)}
            {renderStatus(app.status)}
            {renderActionButton(app)}
          </Space>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationsPanel;
