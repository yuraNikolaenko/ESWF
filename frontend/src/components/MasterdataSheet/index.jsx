// components/masterdata/MasterdataSheet.jsx
import React, { useState, useMemo, useRef } from "react";
import useTabs from "../../hooks/useTabs";
import useMasterdataFull from "../../hooks/useMasterdataFull";
import useMasterdataColumns from "./useMasterdataColumns";
import HeaderBar from "./HeaderBar";
import ActionBar from "./ActionBar";
import MasterdataTable from "./MasterdataTable";
import "./MasterdataSheet.css";
import { getBaseApiUrl } from "../../utils/apiConfig";

const MasterdataSheet = ({ originalItem }) => {
  const code = originalItem.code;
  const tabId = `masterdata-${code}`;
  const searchRef = useRef();
  const menuRef = useRef(null);

  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [activeRowId, setActiveRowId] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

  const [plainData, setPlainData] = useState([]);
  const [reloading, setReloading] = useState(false);

  const { addTab, closeTab } = useTabs();

  // FULL LOAD (meta + data)
  const {
    meta,
    data,
    isLoading,
    isError,
  } = useMasterdataFull(code);

  const fetchDataOnly = async () => {
    setReloading(true);
    try {
      const BASE_API_URL = getBaseApiUrl();
      const res = await fetch(`${BASE_API_URL}/${code}/`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      const list = Array.isArray(json) ? json : json?.results || [];
      setPlainData(list);
    } catch (e) {
      console.error("🔁 Refresh error:", e);
    } finally {
      setReloading(false);
    }
  };

  const columns = useMasterdataColumns(meta);
  const tableData = plainData.length ? plainData : data;

  const filteredData = useMemo(() => {
    if (!search) return tableData;
    const lower = search.toLowerCase();
    return tableData.filter((item) =>
      Object.values(item).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(lower)
      )
    );
  }, [search, tableData]);

  const handleRowDoubleClick = (record) => {
    addTab({
      id: `edit-${code}-${record.id}`,
      type: "directoryItem",
      itemType: originalItem.type,
      title: record.name || `${originalItem.name} item`,
      originalItem: { ...originalItem, data: record },
    });
  };

  const handleCreate = () => {
    addTab({
      id: `create-${code}`,
      type: "directoryItem",
      itemType: originalItem.type,
      title: `New ${originalItem.name}`,
      originalItem: { ...originalItem, data: null },
    });
  };

  const handleEdit = () => {
    if (!activeRow) return;
    addTab({
      id: `edit-${code}-${activeRow.id}`,
      type: "directoryItem",
      itemType: originalItem.type,
      title: activeRow.name || `${originalItem.name} item`,
      originalItem: { ...originalItem, data: activeRow },
    });
  };

  const handleToggleMark = async () => {
    if (!activeRow) return;
    const updated = { ...activeRow, ismark: !activeRow.ismark };
    try {
      const BASE_API_URL = getBaseApiUrl();
      const res = await fetch(`${BASE_API_URL}/${code}/${activeRow.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchDataOnly(); // оновлюємо лише дані
    } catch (err) {
      console.error("Mark toggle error:", err);
    }
  };

  if (isError) return <div className="masterdata-sheet">❌ Load error</div>;
  if (!meta) return <div className="masterdata-sheet">⏳ Loading metadata...</div>;

  return (
    <div className="masterdata-sheet" onContextMenu={(e) => e.preventDefault()}>
      <HeaderBar title={originalItem.name} onClose={() => closeTab?.(tabId)} />

      <ActionBar
        onCreate={handleCreate}
        onEdit={handleEdit}
        onRefresh={fetchDataOnly}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchRef={searchRef}
        menuOpen={menuOpen}
        toggleMenu={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const menuWidth = 200;
          const adjustedLeft =
            rect.left + menuWidth > viewportWidth
              ? viewportWidth - menuWidth - 10
              : rect.left;
          setContextPos({ x: adjustedLeft + 8, y: rect.bottom + 8 });
          setMenuOpen(!menuOpen);
        }}
        contextPos={contextPos}
        menuRef={menuRef}
        onMark={handleToggleMark}
      />

      <MasterdataTable
        columns={columns}
        data={filteredData}
        pagination={pagination}
        onPaginationChange={(p) => setPagination(p)}
        isLoading={isLoading || reloading}
        activeRowId={activeRowId}
        onRowClick={(rec) => {
          setActiveRowId(rec.id);
          setActiveRow(rec);
        }}
        onRowDoubleClick={handleRowDoubleClick}
        onRowContextMenu={(e, rec) => {
          e.preventDefault();
          setActiveRowId(rec.id);
          setActiveRow(rec);
          setContextPos({ x: e.clientX, y: e.clientY });
          setMenuOpen(true);
        }}
      />
    </div>
  );
};

export default MasterdataSheet;
