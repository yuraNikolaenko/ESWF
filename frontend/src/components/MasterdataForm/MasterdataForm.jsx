import React, { useEffect, useState } from "react";
import "../../styles/MasterdataForm.css";
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Checkbox,
  DatePicker,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const MasterdataForm = ({ originalItem, onSuccess }) => {
  const [form] = Form.useForm();
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);

  const code = originalItem.code;
  const id = originalItem.data?.id || null;

  let BASE_API_URL = import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV && import.meta.env.VITE_API_URL_LOCAL) {
    BASE_API_URL = import.meta.env.VITE_API_URL_LOCAL;
  }

  const modelName = code.endsWith("s") ? code.slice(0, -1) : code;
  const metaUrl = `${BASE_API_URL}/${modelName}/meta/`;
  const dataUrl = `${BASE_API_URL}/${code}/${id || ""}`;

  useEffect(() => {
    const fetchMetadataAndData = async () => {
      try {
        console.log("📤 Запит на мета:", metaUrl);
        const metaRes = await axios.get(metaUrl);
        console.log("✅ Metadata loaded:", metaRes.data);

        const fields = metaRes.data.filter(
          (f) =>
            !["id", "uuid", "isfolder", "ismark", "parent"].includes(f.name)
        );
        setMetadata(fields);
        console.log("✅ Відфільтровані поля:", fields);

        if (id) {
          console.log("📤 Запит на дані:", dataUrl);
          const dataRes = await axios.get(dataUrl);
          const initialValues = { ...dataRes.data };
          console.log("📦 Завантажено дані елемента:", dataRes.data);

          fields.forEach((field) => {
            if (field.type === "date" && initialValues[field.name]) {
              initialValues[field.name] = dayjs(initialValues[field.name]);
            }
          });

          form.setFieldsValue(initialValues);
          console.log("✅ Form values set:", initialValues);
        }
      } catch (error) {
        console.error("❌ Помилка у fetchMetadataAndData:", error);
        message.error("Не вдалося завантажити форму");
      }
    };

    fetchMetadataAndData();
  }, [metaUrl, dataUrl, id, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const formatted = { ...values };
      metadata.forEach((field) => {
        if (field.type === "date" && values[field.name]) {
          formatted[field.name] = values[field.name].format("YYYY-MM-DD");
        }
      });

      if (id) {
        await axios.put(dataUrl, formatted);
        message.success("Запис оновлено успішно");
      } else {
        await axios.post(`${BASE_API_URL}/${code}/`, formatted);
        message.success("Запис створено успішно");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      message.error("Помилка під час збереження");
    }
    setLoading(false);
  };

  const renderField = (field) => {
    const commonProps = {
      name: field.name,
      label: field.name,
      rules: field.required
        ? [{ required: true, message: "Обов'язкове поле" }]
        : [],
    };

    switch (field.type) {
      case "boolean":
        return (
          <Form.Item {...commonProps} valuePropName="checked" key={field.name}>
            <Checkbox>{field.name}</Checkbox>
          </Form.Item>
        );
      case "date":
        return (
          <Form.Item {...commonProps} key={field.name}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        );
      case "choice":
        return (
          <Form.Item {...commonProps} key={field.name}>
            <Select>
              {field.choices.map(([val, label]) => (
                <Select.Option value={val} key={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      default:
        return (
          <Form.Item {...commonProps} key={field.name}>
            <Input />
          </Form.Item>
        );
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="masterdata-form"
    >
      <div className="form-card">
        {metadata
          .filter((f) => ["id", "name", "parent", "comment"].includes(f.name))
          .map(renderField)}
      </div>

      <div className="form-card">
        {metadata
          .filter((f) => !["id", "name", "parent", "comment"].includes(f.name))
          .map(renderField)}
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Зберегти
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MasterdataForm;
