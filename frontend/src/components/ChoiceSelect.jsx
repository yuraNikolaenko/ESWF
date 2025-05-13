import React, { useEffect, useState } from "react";
import { Select, Spin, Tag } from "antd";
import axios from "axios";
import { Controller } from "react-hook-form";

// 🔧 кольори за замовчуванням для значень (опційно)
const DEFAULT_COLORS = {
  car: "green",
  trailer: "blue",
  equipment: "orange",
  winter: "blue",
  summer: "orange",
  spring: "lime",
  autumn: "volcano",
  in_use: "green",
  in_stock: "gold",
  disposed: "red",
};

const ChoiceSelect = ({
  code,
  control,
  name,
  rules,
  defaultValue = null,
  placeholder = "Оберіть значення",
  showTag = true,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    axios
      .get(`/api/choices/${code}/`)
      .then((res) => {
        setOptions(res.data);
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [code]);

  const renderOption = (value, label) => {
    if (showTag) {
      return <Tag color={DEFAULT_COLORS[value] || "default"}>{label}</Tag>;
    }
    return label;
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Select
          {...field}
          loading={loading}
          placeholder={placeholder}
          options={options.map(({ value, label }) => ({
            value,
            label: renderOption(value, label),
          }))}
          showSearch
          filterOption={(input, option) =>
            option.label.props?.children
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
          {...props}
        />
      )}
    />
  );
};

export default ChoiceSelect;
