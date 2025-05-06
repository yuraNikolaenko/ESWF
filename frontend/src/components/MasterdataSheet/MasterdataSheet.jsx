// MasterdataSheet.jsx — metadata‑driven

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Table, Button } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  MoreOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import useTabs from "../../hooks/useTabs";
import { getBaseApiUrl } from "../../utils/apiConfig";
import "../../styles/MasterdataSheet.css";

const MasterdataSheet = ({ originalItem }) => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { addTab, closeTab } = useTabs();
  const tabId = `masterdata-${originalItem.code}`;

  /* ---------- DATA & META FETCH ---------- */
  useEffect(() => {
    const BASE_API_URL = getBaseApiUrl();

    const fetchData = async () => {
      if (!originalItem?.code) {
        console.warn("No originalItem.code — skipping fetch");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        /* META ------------------------------------------------------------- */
        const metaRes = await fetch(`${BASE_API_URL}/${originalItem.code}/meta/`);
        if (!metaRes.ok) throw new Error("Failed to fetch metadata");
        const metaJson = await metaRes.json();
        setMeta(metaJson);

        /* DATA ------------------------------------------------------------- */
        const dataRes = await fetch(
          `${BASE_API_URL}/${originalItem.code}/?page=${pagination.current}&page_size=${pagination.pageSize}`
        );
        if (!dataRes.ok) throw new Error("Failed to fetch data");
        const dataJson = await dataRes.json();

        // універсальна обробка: масив або { results: [...] }
        const items = Array.isArray(dataJson)
          ? dataJson
          : Array.isArray(dataJson?.results)
          ? dataJson.results
          : [];

        setData(items);
      } catch (err) {
        console.error("Load error:", err);
        setMeta(null);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [originalItem, pagination]);

  /* ---------- DROPDOWN CLOSE ON OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- DOUBLE‑CLICK ROW OPENS EDIT TAB ---------- */
  const handleRowDoubleClick = (record) => {
    addTab({
      id: `edit-${originalItem.code}-${record.id}`,
      type: "directoryItem",
      itemType: originalItem.type,
      title: record.name || `${originalItem.name} item`,
      originalItem: { ...originalItem, data: record },
    });
  };

  /* ---------- TABLE COLUMNS FROM META ---------- */
  const columns = useMemo(() => {
    if (!meta?.fields) return [];

    return meta.fields
      .filter(
        (f) => f.visible !== false && f.name !== "uid" && f.name !== "parent"
      )
      .map((f) => {
        const key = f.name;
        const title = f.title?.ua || f.title?.en || key;

        if (key === "ismark" || key === "isfolder") {
          return {
            title: "",
            dataIndex: key,
            key,
            render: (val) =>
              val ? (
                <span style={{ display: "flex", justifyContent: "center" }}>
                  ✔️
                </span>
              ) : null,
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

        return { title, dataIndex: key, key, ellipsis: true };
      });
  }, [meta]);

  /* ---------- EARLY RETURNS ---------- */
  if (loading)   return <div className="masterdata-sheet">Loading…</div>;
  if (!meta)     return <div className="masterdata-sheet">Metadata error</div>;
  if (!data.length)
    return <div className="masterdata-sheet">No data</div>;

  /* ---------- RENDER ---------- */
  return (
    <div className="masterdata-sheet">
      {/* Header bar */}
      <div className="header-bar">
        <div className="left-controls">
          <Button icon={<LeftOutlined />} type="text" />
          <Button icon={<RightOutlined />} type="text" />
          <span className="sheet-title">{originalItem.name}</span>
        </div>
        <div className="right-controls">
          <Button
            icon={<CloseOutlined />}
            onClick={() => closeTab?.(tabId)}
            type="text"
          />
        </div>
      </div>

      {/* Action bar */}
      <div className="action-bar">
        <div className="left-buttons">
          <Button type="primary">Save</Button>
          <Button>Save and Close</Button>
        </div>
        <div className="right-dropdown" ref={menuRef}>
          <Button
            icon={<MoreOutlined />}
            type="text"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="custom-dropdown-menu">
              <div className="menu-item">Edit</div>
              <div className="menu-item">Delete</div>
              <div className="menu-item">Help</div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className="masterdata-table-container"
        style={{ flex: 1, overflow: "auto" }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(r) => r.id}
          pagination={pagination}
          scroll={{ y: "calc(100vh - 295px)", x: "max-content" }}
          onChange={(p) =>
            setPagination({ current: p.current, pageSize: p.pageSize })
          }
          onRow={(rec) => ({
            onDoubleClick: () => handleRowDoubleClick(rec),
          })}
        />
      </div>
    </div>
  );
};

export default MasterdataSheet;
