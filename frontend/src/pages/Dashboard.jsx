import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [driversCount, setDriversCount] = useState(0);
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Запрос к API для водителей
        const BASE_API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
        const endpoint = `${BASE_API_URL}/drivers/`;
        const driversResponse = await fetch(endpoint); // Замените на ваш реальный endpoint
        const driversData = await driversResponse.json();
        setDriversCount(driversData.length); // Подсчет количества записей

        // Запрос к API для машин
/*         const vehiclesResponse = await fetch('http://127.0.0.1:8000/api/vehicles'); // Замените на ваш реальный endpoint
        const vehiclesData = await vehiclesResponse.json(); */
        const vehiclesData = 0;
        setVehiclesCount(vehiclesData.length); // Подсчет количества записей
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome to the ESWF Dashboard!</h1>
      <p>Select a section from the menu to start working.</p>
      <div className="dashboard-stats">
        <p>Number of Drivers: {driversCount}</p>
        <p>Number of Vehicles: {vehiclesCount}</p>
      </div>
    </div>
  );
};

export default Dashboard;
