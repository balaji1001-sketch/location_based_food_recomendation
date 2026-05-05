/**
 * Price Comparison Chart Component
 * Displays price comparison across restaurants for same food item
 */

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../styles/Charts.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * PriceComparisonChart Component
 * Shows price differences for same food across restaurants
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of {restaurant, price} objects
 * @param {string} props.foodItem - Name of food item being compared
 * @returns {React.Component} Price comparison chart element
 */
function PriceComparisonChart({ data, foodItem }) {
  if (!data || data.length === 0) {
    return <div className="chart-container">No data available</div>;
  }

  const chartData = {
    labels: data.map((item) => item.restaurant),
    datasets: [
      {
        label: `Price of ${foodItem}`,
        data: data.map((item) => item.price),
        backgroundColor: '#4299e1',
        borderColor: 'rgba(66, 153, 225, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Price Comparison - ${foodItem}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (₹)',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default PriceComparisonChart;
