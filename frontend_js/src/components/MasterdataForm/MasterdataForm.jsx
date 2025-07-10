import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./MasterdataForm.css";
import { Form, Button, message, Tabs } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import useMasterdataItem from "../../hooks/useMasterdataItem";
import useTabs from "../../hooks/useTabs";
import DynamicField from "./DynamicField";
import sections from "../../config/sections";
import MasterdataToolbar from "./MasterdataToolbar";

const { TabPane } = Tabs;

const getSubtablesFor = (code) => {
  for (const section of sections) {
    for (const group of section.groups) {
      for (const item of group.items) {
        if (item.code === code) return item.subtables || [];
      }
    }
  }
  return [];
};

const MasterdataForm = ({ originalItem, onSuccess }) => {
  const { language } = useLanguage();
  const { closeTab } = useTabs();
  const [form] = Form.useForm();
  const [extraTabs, setExtraTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("main");

  const code = originalItem.code;
  const id = originalItem.data?.id || null;
  const tabId = `edit-${code}-${id || "new"}`;

  const { meta, data, loading, error } = useMasterdataItem(code, id);
  const hiddenFields = ["uuid", "isfolder", "ismark"];

  const allSubtables = getSubtablesFor(code);
  const autoloadSubtables = allSubtables.filter((t) => t.autoload);
  const dynamicSubtables = allSubtables.filter((t) => !t.autoload);

  const handleFinish = async (values, closeAfter = false) => {
    try {
      const formatted = { ...values };
      meta.forEach((field) => {
        if (field.type === "date" && values[field.name]) {
          formatted[field.name] = values[field.name].format("YYYY-MM-DD");
        }
      });

      const BASE_API_URL =
        import.meta.env.VITE_API_URL_LOCAL || import.meta.env.VITE_API_URL;
      const url = `${BASE_API_URL}/${code}/${id || ""}`;

      if (id) {
        await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formatted),
        });
        message.success("Record updated");
      } else {
        await fetch(`${BASE_API_URL}/${code}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formatted),
        });
        message.success("Record created");
      }

      if (onSuccess) onSuccess();
      if (closeAfter) closeTab?.(tabId);
    } catch (err) {
      console.error("❌ Save error:", err);
      message.error("Save failed");
    }
  };

  const handleSave = () => form.submit();
  const handleSaveAndClose = () =>
    handleFinish(form.getFieldsValue(), true);

  const handleMenuClick = ({ key }) => {
    if (key.startsWith("subtable:")) {
      const subtableCode = key.split(":")[1];
      const sub = dynamicSubtables.find((s) => s.code === subtableCode);
      if (sub && !extraTabs.includes(sub.code)) {
        setExtraTabs([...extraTabs, sub.code]);
        setActiveTab(sub.code);
      }
      return;
    }

    switch (key) {
      case "save":
        handleSave();
        break;
      case "saveClose":
        handleSaveAndClose();
        break;
      case "reload":
        window.location.reload();
        break;
      case "mark":
        message.info("Позначено як видалено (ще не реалізовано)");
        break;
      default:
        break;
    }
  };

  if (loading)
    return <div className="masterdata-form">⏳ Loading...</div>;

  if (error || !meta) {
    console.warn("❌ useMasterdataItem error:", { error, meta, data });
    return <div className="masterdata-form">❌ Load error</div>;
  }

  return (
    <div className="masterdata-form">
      {/* 🔹 Header */}
      <div className="form-header">
        <h2 className="form-title">
          {data?.name || "New record"} ({originalItem.name})
        </h2>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => closeTab?.(tabId)}
        />
      </div>

      {/* 🔧 Toolbar */}
      <MasterdataToolbar
        onSave={handleSave}
        onSaveAndClose={handleSaveAndClose}
        onMenuClick={handleMenuClick}
        dynamicSubtables={dynamicSubtables}
      />

      {/* 📑 Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 24 }}
      >
        <TabPane tab="Основні" key="main">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={data || {}}
          >
            <div className="form-card">
              {meta
                .filter((f) =>
                  ["id", "name", "parent", "comment"].includes(f.name)
                )
                .filter((f) => !hiddenFields.includes(f.name))
                .map((f) => (
                  <DynamicField field={f} language={language} key={f.name} />
                ))}
            </div>

            <div className="form-card">
              {meta
                .filter(
                  (f) =>
                    !["id", "name", "parent", "comment"].includes(f.name)
                )
                .filter((f) => !hiddenFields.includes(f.name))
                .map((f) => (
                  <DynamicField field={f} language={language} key={f.name} />
                ))}
            </div>
          </Form>
        </TabPane>

        {autoloadSubtables.map((sub) => (
          <TabPane tab={sub.name_ua || sub.name} key={sub.code}>
            <div className="form-card">📋 Тут буде таблиця "{sub.name_ua || sub.name}"</div>
          </TabPane>
        ))}

        {extraTabs.map((code) => {
          const sub = dynamicSubtables.find((s) => s.code === code);
          return (
            <TabPane tab={sub?.name_ua || sub?.name || code} key={code}>
              <div className="form-card">📋 Динамічна вкладка для "{sub?.name_ua || code}"</div>
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default MasterdataForm;
