import { useState, useEffect } from "react";
import { getBaseApiUrl } from "../utils/apiConfig";

const useMasterdataItem = (code, id) => {
  const [meta, setMeta] = useState(null);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const BASE_API_URL = getBaseApiUrl();
    const fetchData = async () => {
      setLoading(true);
      try {
        const metaRes = await fetch(`${BASE_API_URL}/${code}/meta/`);
        const metaJson = await metaRes.json();
        setMeta(metaJson.fields || []);

        if (id) {
          const dataRes = await fetch(`${BASE_API_URL}/${code}/${id}/`);
          const dataJson = await dataRes.json();
          setData(dataJson);
        } else {
          setData({});
        }

        setError(false);
      } catch (e) {
        console.error("❌ useMasterdataItem error:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code, id]);

  return { meta, data, loading, error };
};

export default useMasterdataItem;
