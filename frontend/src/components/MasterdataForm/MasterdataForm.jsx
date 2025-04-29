import React, { useState } from "react";
import "../../styles/MasterdataForm.css";

const MasterdataForm = ({ data, originalItem }) => {
  const [formData, setFormData] = useState({ ...data });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const apiUrl = `http://127.0.0.1:8000/api/${originalItem.code.toLowerCase()}/${
    formData.id || formData.uuid
  }/`;

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Помилка при збереженні");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="masterdata-form">
      <button className="save-button" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
      <h2>Edit: {formData.name || `${originalItem.name} Item`}</h2>

      {success && <div className="save-success">✅ Збережено успішно!</div>}
      <form>
        {Object.keys(formData).map((key) => (
          <div key={key} className="form-group">
            <label>{key}: </label>
            <input
              type="text"
              value={formData[key] !== null ? formData[key] : ""}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={key === "id" || key === "uuid"}
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default MasterdataForm;
