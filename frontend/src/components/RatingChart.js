/**
 * Rating Chart Component
 * Displays restaurant ratings using Chart.js
 */

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../styles/Charts.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * RatingChart Component
 * Shows rating distribution for a restaurant
 * @param {Object} props - Component props
 * @param {Array} props.ratingDistribution - Array of rating counts [1-star, 2-star, 3-star, 4-star, 5-star]
 * @param {string} props.restaurantName - Restaurant name
 * @returns {React.Component} Rating chart element
 */
function RatingChart({ ratingDistribution, restaurantName }) {
  const data = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: ratingDistribution || [0, 0, 0, 0, 0],
        backgroundColor: [
          '#ff6b6b',
          '#ffa502',
          '#ffd93d',
          '#95e1d3',
          '#38a169',
        ],
        borderColor: 'rgba(75, 192, 192, 1)',
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
        text: `Rating Distribution - ${restaurantName}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
}

export default RatingChart;
