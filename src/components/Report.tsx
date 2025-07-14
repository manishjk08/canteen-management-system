import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axiosInstance from './axiosInstance';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReportData {
  date: string;
  vote_count: number;
}

const Report = () => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskId, setTaskId] = useState<string | null>(null);
  const access = Cookies.get('access');
  const today = new Date().toISOString().split('T')[0];
  const fromDate = '2025-05-01';

  const colors = ['#FF6384', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB', '#9966FF'];
  const backgroundColor = reportData.map((_, index) => colors[index % colors.length]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axiosInstance.get('/report/', {
          params: {
            from: fromDate,
            to: today,
            export: 'csv',
          },
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        if (res.data.task_id) {
          setTaskId(res.data.task_id);
          pollReportStatus(res.data.task_id);
        }
      } catch (error: any) {
        console.error('Error starting report:', error.response?.data || error.message);
      }
    };

    if (access) {
      fetchChartData();
    }
  }, [access, today]);

  const pollReportStatus = (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await axiosInstance.get('/status/', {
          params: { task_id: taskId },
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        if (res.data.status === 'SUCCESS') {
          clearInterval(interval);
          downloadCSV(taskId);
        } else if (res.data.status === 'FAILURE') {
          clearInterval(interval);
          console.error('Report generation failed');
        }
      } catch (error) {
        clearInterval(interval);
        console.error('Error polling status:', error);
      }
    }, 3000);
  };

  const downloadCSV = async (taskId: string) => {
    try {
      const fileName = `report_${fromDate}_to_${today}.csv`; 

      const res = await axiosInstance.get('/download-report/', {
        params: { file_name: fileName },
        headers: {
          Authorization: `Bearer ${access}`,
        },
        responseType: 'blob',
      });

      saveAs(res.data, fileName);

      const text = await res.data.text();
      const parsed = Papa.parse<ReportData>(text, { header: true });
      setReportData(parsed.data);
    } catch (error: any) {
      console.error('Error downloading CSV:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'report.csv');
  };

  const chartData = {
    labels: reportData.map((item) => item.date),
    datasets: [
      {
        label: 'Votes',
        data: reportData.map((item) => item.vote_count),
        backgroundColor: backgroundColor,
        barThickness: 30,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Votes per Day' },
    },
  };

  return (
    <div className="lg:w-3/4">
      {loading ? (
        <p>Generating report and chart...</p>
      ) : reportData.length > 0 ? (
        <>
          <Bar options={options} data={chartData} />
          <button
            onClick={exportCSV}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export as CSV (Local)
          </button>
        </>
      ) : (
        <p>No report data available.</p>
      )}
    </div>
  );
};

export default Report;
