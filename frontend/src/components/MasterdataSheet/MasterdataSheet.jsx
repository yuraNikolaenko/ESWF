// MasterdataSheet.jsx — with icons and dividers in dropdown

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Input } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  MoreOutlined,
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  FileAddOutlined,
  StopOutlined,
  DeleteOutlined,
  CheckCircleTwoTone,
  MinusCircleTwoTone,
  FolderOutlined,
  FileOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import useTabs from "../../hooks/useTabs";
import { getBaseApiUrl } from "../../utils/apiConfig";
import "../../styles/MasterdataSheet.css";

const MasterdataSheet = ({ originalItem }) => {
  const searchRef = useRef();
  const [activeRowId, setActiveRowId] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const { addTab, closeTab } = useTabs();
  const tabId = `masterdata-${originalItem.code}`;

  useEffect(() => {
    if (searchRef.current) searchRef.current.focus();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const BASE_API_URL = getBaseApiUrl();
      const metaRes = await fetch(`${BASE_API_URL}/${originalItem.code}/meta/`);
      if (!metaRes.ok) throw new Error("Failed to fetch metadata");
      const metaJson = await metaRes.json();
      setMeta(metaJson);

      const dataRes = await fetch(`${BASE_API_URL}/${originalItem.code}/`);
      if (!dataRes.ok) throw new Error("Failed to fetch data");
      const dataJson = await dataRes.json();
      const items = Array.isArray(dataJson)
        ? dataJson
        : Array.isArray(dataJson?.results)
        ? dataJson.results
        : [];
      setData(items);
      setFilteredData(items);
    } catch (err) {
      console.error("Load error:", err);
      setMeta(null);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const BASE_API_URL = getBaseApiUrl();
    if (!originalItem?.code) return;
    fetchAll();
  }, [originalItem?.code]);

  useEffect(() => {
    if (!search) {
      setFilteredData(data);
    } else {
      const lower = search.toLowerCase();
      setFilteredData(
        data.filter((item) =>
          Object.values(item).some(
            (val) => typeof val === "string" && val.toLowerCase().includes(lower)
          )
        )
      );
    }
  }, [search, data]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRowDoubleClick = (record) => {
    addTab({
      id: `edit-${originalItem.code}-${record.id}`,
      type: "directoryItem",
      itemType: originalItem.type,
      title: record.name || `${originalItem.name} item`,
      originalItem: { ...originalItem, data: record },
    });
  };

  const handleCreate = () => {
    addTab({
      id: `create-${originalItem.code}`,
      type: "directoryItem",
      itemType: originalItem.type,
      title: `New ${originalItem.name}`,
      originalItem: { ...originalItem, data: null },
    });
  };

  const handleToggleMark = async () => {
    if (!activeRowId) return;
    const item = data.find((d) => d.id === activeRowId);
    if (!item) return;
    const updated = { ...item, ismark: !item.ismark };

    try {
      const BASE_API_URL = getBaseApiUrl();
      const res = await fetch(`${BASE_API_URL}/${originalItem.code}/${activeRowId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchAll();
    } catch (err) {
      console.error("Mark toggle error:", err);
    }
  };

  const columns = useMemo(() => {
    if (!meta?.fields) return [];
    return meta.fields
      .filter((f) => f.visible !== false && f.name !== "uuid" && f.name !== "parent")
      .map((f) => {
        const key = f.name;
        const title = f.title?.ua || f.title?.en || key;
        if (key === "ismark") {
          return {
            title: "",
            dataIndex: key,
            key,
            render: (val) => val
              ? <MinusCircleTwoTone twoToneColor={["var(--error-color)", "var(--table-background)"]} style={{ fontSize: 16, display: "flex", justifyContent: "center" }} />
              : <CheckCircleTwoTone twoToneColor={["var(--success-color)", "var(--table-background)"]} style={{ fontSize: 16, display: "flex", justifyContent: "center" }} />,
          };
        }
        if (key === "isfolder") {
          return {
            title: "",
            dataIndex: key,
            key,
            render: (val) => val
              ? <FolderOutlined style={{ fontSize: 16, display: "flex", justifyContent: "center" }} />
              : <FileOutlined style={{ fontSize: 16, display: "flex", justifyContent: "center" }} />,
          };
        }
        if (f.type === "reference") {
          return {
            title,
            key,
            render: (_, rec) => {
              const ref = rec[key.replace("_id", "")];
              return ref?.title || ref?.name || `[id: ${rec[key]}]`;
            },
          };
        }
        return {
          title,
          dataIndex: key,
          key,
          ellipsis: true,
          sorter: (a, b) => {
            if (typeof a[key] === 'number' && typeof b[key] === 'number') {
              return a[key] - b[key];
            }
            return String(a[key] || '').localeCompare(String(b[key] || ''));
          },
        };
      });
  }, [meta]);

  if (!meta) return <div className="masterdata-sheet">Metadata error</div>;

  return (
    <div className="masterdata-sheet" onContextMenu={(e) => e.preventDefault()}>
      <div className="header-bar">
        <div className="left-controls">
          <Button icon={<LeftOutlined />} type="text" />
          <Button icon={<RightOutlined />} type="text" />
          <span className="sheet-title">{originalItem.name}</span>
        </div>
        <div className="right-controls">
          <Button icon={<CloseOutlined />} onClick={() => closeTab?.(tabId)} type="text" />
        </div>
      </div>

      <div className="action-bar">
        <div className="left-buttons">
          <Button icon={<PlusOutlined />} type="primary" onClick={handleCreate}>New</Button>
          <Button icon={<EditOutlined />}>Edit</Button>
          <Button icon={<ReloadOutlined />} onClick={() => fetchAll()} type="default">Refresh</Button>
          <Input.Search
            allowClear
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280, marginLeft: 12 }}
            className="themed-search" ref={searchRef}
          />
        </div>
        <div className="right-dropdown" ref={menuRef}>
          <Button icon={<MoreOutlined />} type="text" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const menuWidth = 200;
            const adjustedLeft = (rect.left + menuWidth > viewportWidth) ? viewportWidth - menuWidth - 10 : rect.left;
            setContextPos({ x: adjustedLeft + 8, y: rect.bottom + 8 });
            setMenuOpen(!menuOpen);
          }} />
          {menuOpen && (
            <div className="custom-dropdown-menu" style={{ position: 'fixed', top: contextPos.y, left: contextPos.x, zIndex: 1000 }}>
              <div className="menu-item"><FileAddOutlined /> Create</div>
              <div className="menu-item"><EditOutlined /> Edit</div>
              <div className="menu-divider" />
              <div className="menu-item" onClick={handleToggleMark}><StopOutlined /> Mark for deletion</div>
              <div className="menu-item"><DeleteOutlined /> Delete</div>
            </div>
          )}
        </div>
      </div>

      <div className="masterdata-table-container">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(r) => r.id}
          pagination={pagination}
          loading={loading}
          scroll={{ y: "calc(100vh - 295px)", x: "max-content" }}
          onChange={(p) => setPagination(p)}
          rowClassName={(rec) => rec.id === activeRowId ? "active-row" : ""}
          onRow={(rec) => ({
            onClick: () => setActiveRowId(rec.id),
            onDoubleClick: () => handleRowDoubleClick(rec),
            onContextMenu: (e) => {
              e.preventDefault();
              setActiveRowId(rec.id);
              setContextPos({ x: e.clientX, y: e.clientY });
              setMenuOpen(true);
            }
          })}
        />
      </div>
    </div>
  );
};

export default MasterdataSheet;
