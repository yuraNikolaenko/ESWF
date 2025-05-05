
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import useTabs from "../../hooks/useTabs";

const MasterdataSheet = ({ title, originalItem }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  const { addTab } = useTabs();

  useEffect(() => {
    if (!originalItem || !originalItem.code) {
      setLoading(false);
      return;
    }

    let BASE_API_URL = import.meta.env.VITE_API_URL;
    if (import.meta.env.DEV && import.meta.env.VITE_API_URL_LOCAL) {
      BASE_API_URL = import.meta.env.VITE_API_URL_LOCAL;
    }

    const endpoint = `${BASE_API_URL}/${originalItem.code}/`;

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((responseData) => {
        const results = Array.isArray(responseData?.results)
          ? responseData.results
          : Array.isArray(responseData)
          ? responseData
          : [];
        setData(results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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

  if (loading) return <div>Loading...</div>;
  if (!data.length) return <div>No data</div>;

  const sample = data[0];
  const columns = Object.keys(sample).map((key) => ({
    title: key,
    dataIndex: key,
    key,
  }));

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={pagination}
      onChange={(p) => setPagination(p)}
      onRow={(record) => ({
        onDoubleClick: () => handleRowDoubleClick(record),
      })}
    />
  );
};

export default MasterdataSheet;
