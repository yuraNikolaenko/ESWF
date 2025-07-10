import React from "react";
import { Button, Dropdown } from "antd";
import {
  SaveOutlined,
  SaveTwoTone,
  ReloadOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";

const MasterdataToolbar = ({
  onSave,
  onSaveAndClose,
  onMenuClick,
  dynamicSubtables = [],
}) => {
  const menuItems = [
    {
      key: "save",
      label: (
        <>
          <SaveOutlined /> Save
        </>
      ),
    },
    {
      key: "saveClose",
      label: (
        <>
          <SaveTwoTone /> Save & Close
        </>
      ),
    },
    { type: "divider" },
    {
      key: "reload",
      label: (
        <>
          <ReloadOutlined /> Reload
        </>
      ),
    },
    {
      key: "mark",
      label: (
        <>
          <DeleteOutlined /> Mark as deleted
        </>
      ),
    },
    ...(dynamicSubtables.length > 0 ? [{ type: "divider" }] : []),
    ...dynamicSubtables.map((sub) => ({
      key: `subtable:${sub.code}`,
      label: `Відкрити ${sub.name_ua || sub.name}`,
    })),
  ];

  return (
    <div className="form-toolbar">
      <div className="toolbar-left">
        <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
          Save
        </Button>
        <Button icon={<SaveTwoTone />} onClick={onSaveAndClose}>
          Save & Close
        </Button>
      </div>
      <div className="toolbar-right">
        <Dropdown
          menu={{ items: menuItems, onClick: onMenuClick }}
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      </div>
    </div>
  );
};

export default MasterdataToolbar;
