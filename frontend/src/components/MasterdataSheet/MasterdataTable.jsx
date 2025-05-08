// components/masterdata/MasterdataTable.jsx
import React from "react";
import { Table } from "antd";

const MasterdataTable = ({
  columns,
  data,
  pagination,
  onPaginationChange,
  isLoading,
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  activeRowId,
}) => {
  return (
    <div className="masterdata-table-container">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(r) => r.id}
        pagination={pagination}
        loading={isLoading}
        scroll={{ y: "calc(100vh - 295px)", x: "max-content" }}
        onChange={onPaginationChange}
        rowClassName={(rec) => rec.id === activeRowId ? "active-row" : ""}
        onRow={(rec) => ({
          onClick: () => onRowClick?.(rec),
          onDoubleClick: () => onRowDoubleClick?.(rec),
          onContextMenu: (e) => onRowContextMenu?.(e, rec),
        })}
      />
    </div>
  );
};

export default MasterdataTable;
