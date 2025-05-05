// MasterdataSheet.jsx — with custom HTML/JS dropdown menu

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Tooltip } from "antd";
import { LeftOutlined, RightOutlined, MoreOutlined, CloseOutlined } from "@ant-design/icons";
import useTabs from "../../hooks/useTabs";
import { getBaseApiUrl } from "../../utils/apiConfig";
import "../../styles/MasterdataSheet.css";

const MasterdataSheet = ({ originalItem }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { addTab, closeTab } = useTabs();

  const tabId = `masterdata-${originalItem.code}`;
  console.log("[MasterdataSheet] Loaded with originalItem:", originalItem);
  console.log("[MasterdataSheet] Using tabId:", tabId);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!originalItem?.code) {
      setLoading(false);
      return;
    }

    const BASE_API_URL = getBaseApiUrl();
    const endpoint = `${BASE_API_URL}/${originalItem.code}/`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((resData) => {
        const results = Array.isArray(resData?.results) ? resData.results : (Array.isArray(resData) ? resData : []);
        setData(results);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [originalItem]);

  const handleRowDoubleClick = (record) => {
    const id = `edit-${originalItem.code}-${record.id}`;
    addTab({
      id,
      type: "directoryItem",
      itemType: originalItem.type,
      title: record.name || `${originalItem.name} item`,
      originalItem: { ...originalItem, data: record },
    });
  };

  const columns = useMemo(() => {
    const sample = data[0];
    if (!sample) return [];
    return Object.keys(sample)
      .filter((key) => key !== "uuid")
      .map((key) => {
        if (key === "ismark" || key === "isfolder") {
          return {
            title: "",
            dataIndex: key,
            key,
            render: (value) => (value ? <span style={{ display: 'flex', justifyContent: 'center' }}><span className="anticon">✔️</span></span> : null)
          };
        }
        return {
          title: key,
          dataIndex: key,
          key
        };
      });
  }, [data]);

  if (loading) return <div className="masterdata-sheet" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>Loading...</div>;
  if (!data.length) return <div className="masterdata-sheet" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>No data</div>;

  const headerTitle = `${originalItem.name} (${originalItem.type})`;

  return (
    <div className="masterdata-sheet">
      {/* Header */}
      <div className="header-bar">
        <div className="left-controls">
          <Button icon={<LeftOutlined />} type="text" />
          <Button icon={<RightOutlined />} type="text" />
          <span className="sheet-title">{headerTitle}</span>
        </div>
        <div className="right-controls">
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              console.log("[MasterdataSheet] Close button clicked. tabId =", tabId);
              if (typeof closeTab === "function") {
                console.log("[MasterdataSheet] closeTab is a function, calling it...");
                closeTab(tabId);
              } else {
                console.warn("[MasterdataSheet] closeTab is NOT a function!");
              }
            }}
            type="text"
          />
        </div>
      </div>

      {/* Action Menu */}
      <div className="action-bar">
        <div className="left-buttons">
          <Button type="primary">Save</Button>
          <Button>Save and Close</Button>
        </div>
        <div className="right-dropdown" ref={menuRef}>
          <Button icon={<MoreOutlined />} type="text" onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && (
            <div className="custom-dropdown-menu">
              <div className="menu-item">Edit</div>
              <div className="menu-item">Delete</div>
              <div className="menu-item">Help</div>
            </div>
          )}
        </div>
      </div>

      {/* Table content */}
      <div className="masterdata-table-container" style={{ flex: 1, overflow: 'auto' }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id || `${record.key}`}
          pagination={pagination}
          scroll={{ y: 'calc(100vh - 295px)', x: 'max-content' }}
          onChange={(p) => setPagination(p)}
          onRow={(record) => ({
            onDoubleClick: () => handleRowDoubleClick(record),
          })}
        />
      </div>
    </div>
  );
};

export default MasterdataSheet;
