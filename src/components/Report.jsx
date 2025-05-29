import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'
import {saveAs} from 'file-saver';
import Papa from 'papaparse'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const access = Cookies.get('access');
  const today = new Date().toISOString().split('T')[0];
  const colors = ['	#FF6384', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF'];
  const backgroundColor = reportData.map((_, index) => colors[index % colors.length]);


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/report/', {
          params: {
            from: '2025-05-01',
            to: today,
          },
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        if (Array.isArray(response.data)) {
          setReportData(response.data);
        } else {
          setReportData([]);
        }
      } catch (error) {
        console.error('Failed to fetch report:', error.response?.data );
      }
    };

    if (access) {
      fetchReports();
    }
  }, [access, today]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Votes per Day' },
    },
  };

  const chartData = {
    labels: reportData.map(item => item.date),
    datasets: [
      {
        label: 'Votes',
        data: reportData.map(item => item.vote_count),
        backgroundColor:backgroundColor,
        barThickness:30,
      },
    ],
  };
  const exportCSV = () => {
    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'report.csv');
  };

  return (
    <div className='lg:w-3/4'>
      {reportData.length > 0 ? (
        <Bar options={options} data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
       <button
        onClick={exportCSV}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export as CSV
      </button>
    </div>
  );
};

export default Report;
