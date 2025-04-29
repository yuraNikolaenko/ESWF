import React, { useEffect, useState } from 'react';
import '../../styles/MasterdataSheet.css'; // Підключення стилів

const MasterdataSheet = ({ title  }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      
    fetch('http://127.0.0.1:8000/api/drivers/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: expected an array');
        }
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  const excludedFields = ['parent', 'uuid']; // Поля, которые нужно исключить

  // Фильтруем заголовки, исключая ненужные поля
  const headers = Object.keys(data[0]).filter(header => !excludedFields.includes(header));

  return (
    <div className="masterdata-sheet">
      <h2>{title}</h2>
      <table className="masterdata-table">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MasterdataSheet;
