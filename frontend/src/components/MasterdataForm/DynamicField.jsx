import React from "react";
import { Form, Input, Select, DatePicker, Checkbox } from "antd";

const { Option } = Select;

const DynamicField = ({ field, language }) => {
  const label = field.title?.[language] || field.title?.en || field.name;

  const commonProps = {
    name: field.name,
    rules: field.required ? [{ required: true, message: "Обов'язкове поле" }] : [],
  };

  let input = null;

  switch (field.type) {
    case "boolean":
      input = (
        <Form.Item {...commonProps} valuePropName="checked" noStyle>
          <Checkbox />
        </Form.Item>
      );
      break;

    case "date":
      input = (
        <Form.Item {...commonProps} noStyle>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      );
      break;

    case "choice":
      input = (
        <Form.Item {...commonProps} noStyle>
          <Select>
            {field.choices?.map(([value, text]) => (
              <Option key={value} value={value}>
                {text}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );
      break;

    default:
      input = (
        <Form.Item {...commonProps} noStyle>
          <Input />
        </Form.Item>
      );
  }

  return (
    <div className="form-field-inline">
      <span className="field-label">{label}:</span>
      {input}
    </div>
  );
};

export default DynamicField;
