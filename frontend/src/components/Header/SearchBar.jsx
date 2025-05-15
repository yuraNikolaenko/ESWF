import React, { useState } from "react";
import { AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Рекурсивно збираємо тільки елементи з code (кінцеві довідники)
function collectItems(node) {
  let found = [];
  if (!node) return found;

  if (Array.isArray(node)) {
    node.forEach(child => found.push(...collectItems(child)));
    return found;
  }

  // Додаємо тільки item з name/name_ua і code
  if ((node.name || node.name_ua) && node.code) {
    found.push(node);
  }

  if (node.subgroups) {
    found.push(...collectItems(node.subgroups));
  }
  if (node.items) {
    found.push(...collectItems(node.items));
  }
  return found;
}

const SearchBar = ({ sections, addTab }) => {
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const localSearch = (query) => {
    if (!query) return [];
    const lc = query.toLowerCase();
    let results = [];

    (sections || []).forEach(section =>
      (section.groups || []).forEach(group => {
        const allItems = collectItems(group.items || []);
        allItems.forEach(item => {
          if (
            (item.name && item.name.toLowerCase().includes(lc)) ||
            (item.name_ua && item.name_ua.toLowerCase().includes(lc))
          ) {
            results.push({
              label: `Довідник: ${item.name_ua || item.name}`,
              value: item.name_ua || item.name,
              type: "directory",
              code: item.code,
              item,
            });
          }
        });
      })
    );

    return results;
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setOptions(localSearch(value));
  };

  const onSelect = (value, option) => {
    if (option.type === "directory") {
      addTab({
        id: `item-${option.code}`,
        title: option.label,
        type: "directoryList",
        code: option.code,
        originalItem: option.item,
        data: null,
      });
    }
    setSearchValue("");
    setOptions([]);
  };

  return (
    <div style={{ width: 300, marginLeft: 12 }}>
      <AutoComplete
        options={options}
        style={{ width: "100%" }}
        value={searchValue}
        onSearch={handleSearch}
        onSelect={onSelect}
        allowClear
        placeholder="Пошук по довідниках..."
      >
        <Input prefix={<SearchOutlined />} />
      </AutoComplete>
    </div>
  );
};

export default SearchBar;
