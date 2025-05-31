import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const MainGraph = ({ emotionData, atmosphereData }) => {
  const data = {
    datasets: [
      {
        label: '感情',
        data: emotionData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '雰囲気',
        data: atmosphereData,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: -100,
        max: 100,
      },
      y: {
        type: 'linear',
        min: -100,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '感情と雰囲気',
      },
    },
  };

  return (
    <div>
      {emotionData.length > 0 || atmosphereData.length > 0 ? (
        <Scatter options={options} data={data} />
      ) : (
        <p>データがありません。新しい入力を行ってください。</p>
      )}
    </div>
  );
};

export default MainGraph;