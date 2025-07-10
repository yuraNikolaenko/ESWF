// components/masterdata/useMasterdataColumns.js
import { useMemo } from "react";
import {
  CheckCircleTwoTone,
  MinusCircleTwoTone,
  FolderOutlined,
  FileOutlined,
} from "@ant-design/icons";

const useMasterdataColumns = (meta) => {
  return useMemo(() => {
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
            render: (val) =>
              val ? (
                <MinusCircleTwoTone
                  twoToneColor={["var(--error-color)", "var(--table-background)"]}
                  style={{ fontSize: 16, display: "flex", justifyContent: "center" }}
                />
              ) : (
                <CheckCircleTwoTone
                  twoToneColor={["var(--success-color)", "var(--table-background)"]}
                  style={{ fontSize: 16, display: "flex", justifyContent: "center" }}
                />
              ),
          };
        }

        if (key === "isfolder") {
          return {
            title: "",
            dataIndex: key,
            key,
            render: (val) =>
              val ? (
                <FolderOutlined style={{ fontSize: 16, display: "flex", justifyContent: "center" }} />
              ) : (
                <FileOutlined style={{ fontSize: 16, display: "flex", justifyContent: "center" }} />
              ),
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
            if (typeof a[key] === "number" && typeof b[key] === "number") {
              return a[key] - b[key];
            }
            return String(a[key] || "").localeCompare(String(b[key] || ""));
          },
        };
      });
  }, [meta]);
};

export default useMasterdataColumns;
