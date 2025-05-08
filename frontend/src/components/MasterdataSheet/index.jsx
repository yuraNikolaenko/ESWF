// components/masterdata/MasterdataSheet.jsx
import React, { useState, useMemo, useRef } from "react";
import useTabs from "../../hooks/useTabs";
import useMasterdataQuery from "./useMasterdataQuery";
import useMasterdataColumns from "./useMasterdataColumns";
import HeaderBar from "./HeaderBar";
import ActionBar from "./ActionBar";
import MasterdataTable from "./MasterdataTable";
import "./MasterdataSheet.css";
import { getBaseApiUrl } from "../../utils/apiConfig";

const MasterdataSheet = ({ originalItem }) => {
  const searchRef = useRef();
  const menuRef = useRef(null);

  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [activeRowId, setActiveRowId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

  const { addTab, closeTab } = useTabs();
  const tabId = `masterdata-${originalItem.code}`;

  const { meta, data, isLoading, isError, refetch } = useMasterdataQuery(originalItem.code);
  const columns = useMasterdataColumns(meta);

  const filteredData = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(lower)
      )
    );
  }, [search, data]);

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
      refetch();
    } catch (err) {
      console.error("Mark toggle error:", err);
    }
  };

  if (isError) return <div className="masterdata-sheet">Load error</div>;
  if (!meta) return <div className="masterdata-sheet">Loading metadata...</div>;

  return (
    <div className="masterdata-sheet" onContextMenu={(e) => e.preventDefault()}>
      <HeaderBar title={originalItem.name} onClose={() => closeTab?.(tabId)} />

      <ActionBar
        onCreate={handleCreate}
        onEdit={() => {}}
        onRefresh={refetch}
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
        isLoading={isLoading}
        activeRowId={activeRowId}
        onRowClick={(rec) => setActiveRowId(rec.id)}
        onRowDoubleClick={handleRowDoubleClick}
        onRowContextMenu={(e, rec) => {
          e.preventDefault();
          setActiveRowId(rec.id);
          setContextPos({ x: e.clientX, y: e.clientY });
          setMenuOpen(true);
        }}
      />
    </div>
  );
};

export default MasterdataSheet;
