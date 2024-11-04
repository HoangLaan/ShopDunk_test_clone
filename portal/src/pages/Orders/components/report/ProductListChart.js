import React, { useRef } from 'react';

import { Chart, getElementAtEvent } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  registerables as registerablesJS,
} from 'chart.js';
ChartJS.register(...registerablesJS);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
    },
  },
};

const ProductListChart = ({ data, onChange, setChartLevel }) => {
  const chartRef = useRef();
  const onClick = (event) => {
    const position = getElementAtEvent(chartRef.current, event)[0];
    if (position && position.index >= 0 && position.index < data.length) {
      const element = data[position.index];
      if (element.level === 1) {
        onChange({ model_id: element.id });
        setChartLevel(2);
      }
    }
  };

  const randomColor = data.map(() => `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`);
  const dataChart = {
    labels: [...data.map((item) => item.name)],
    datasets: [
      {
        label: 'Thống kê sản phẩm',
        data: [...data.map((item) => item.quantity)],
        backgroundColor: [...randomColor],
      },
    ],
  };
  return <Chart type='doughnut' ref={chartRef} onClick={onClick} options={options} data={dataChart} />;
};

export default React.memo(ProductListChart);
