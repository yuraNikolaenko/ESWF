import React, { useEffect, useState } from "react";
import {
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  FolderOutlined,
  FileOutlined,
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import "../../styles/MasterdataSheet.css";

import useTabs from "../../hooks/useTabs";

const MasterdataSheet = ({ title, originalItem }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addTab } = useTabs();

  useEffect(() => {
    if (!originalItem || !originalItem.code) {
      console.error("Invalid originalItem: missing code");
      setLoading(false);
      return;
    }
    // Визначаємо базовий API URL
    let BASE_API_URL = import.meta.env.VITE_API_URL;

    // Якщо розробка локальна — підставляємо локальний API
    if (import.meta.env.DEV && import.meta.env.VITE_API_URL_LOCAL) {
      BASE_API_URL = import.meta.env.VITE_API_URL_LOCAL;
    }

    // Формуємо повний endpoint
    const endpoint = `${BASE_API_URL}/${originalItem.code}/`;
    console.log("🔗 API endpoint:", endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {
          setData(data.results);
        } else if (Array.isArray(data)) {
          setData(data);
        } else {
          throw new Error(
            "Invalid data format: expected an array or results field"
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, [originalItem]);

  const handleRowDoubleClick = (row) => {
    const id = `${originalItem.code}-${row.id || row.uuid}`;
    addTab({
      id,
      type: "directoryItem",
      itemType: originalItem.type,
      title: row.name || `${originalItem.name} item`,
      originalItem: originalItem,
      data: row,
    });
  };

  if (loading) return <div>Loading...</div>;
  if (data.length === 0) return <div>No data available</div>;

  const excludedFields = ["parent", "uuid"];
  const headers = Object.keys(data[0]).filter(
    (header) => !excludedFields.includes(header)
  );

  // Сортируем данные
  const sortedData = [...data].sort((a, b) => {
    if (a.isfolder === b.isfolder) return 0;
    return a.isfolder ? -1 : 1;
  });

  const renderHeader = (header) => {
    if (header === "ismark" || header === "isfolder") {
      return ""; // Не отображаем заголовки для этих колонок
    }
    return header;
  };

  const renderCell = (header, value) => {
    if (header === "isfolder") {
      return value ? (
        <FolderOutlined style={{ color: "#1890ff" }} />
      ) : (
        <MinusOutlined style={{ color: "#8c8c8c" }} />
      );
    }
    if (header === "ismark") {
      return value ? (
        <CloseOutlined
          style={{ color: "red", textDecoration: "line-through" }}
        />
      ) : (
        <CheckOutlined style={{ color: "green" }} />
      );
    }
    if (value && typeof value === "object" && value.name) {
      // Если поле ссылочного типа, выводим имя
      return value.name;
    }
    if (header === "phone") {
      return (
        <>
          <PhoneOutlined /> {value}
        </>
      );
    }
    if (header === "email") {
      return (
        <>
          <MailOutlined /> {value}
        </>
      );
    }
    if (header === "ipn") {
      return (
        <>
          <IdcardOutlined /> {value}
        </>
      );
    }
    if (header === "address") {
      return (
        <>
          <HomeOutlined /> {value}
        </>
      );
    }
    return value;
  };

  return (
    <div className="masterdata-sheet">
      {/* <h2>{title}</h2> */}
      <div className="masterdata-table-container">
        <table className="masterdata-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  style={{
                    width:
                      header === "isfolder" || header === "ismark"
                        ? "50px"
                        : "auto", // Уменьшаем ширину колонок
                  }}
                >
                  {renderHeader(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                onDoubleClick={() => handleRowDoubleClick(row)}
                style={{ cursor: "pointer" }}
              >
                {headers.map((header) => (
                  <td
                    key={header}
                    style={{
                      width:
                        header === "isfolder" || header === "ismark"
                          ? "50px"
                          : "auto", // Уменьшаем ширину колонок
                    }}
                  >
                    {renderCell(header, row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MasterdataSheet;
