import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export default function AttemptTimelineChart({ attempts = [] }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!Array.isArray(attempts) || attempts.length === 0) {
        throw new Error('No attempt data available');
      }

      // Sort attempts by date
      const sortedAttempts = [...attempts].sort((a, b) => 
        new Date(a.submittedAt) - new Date(b.submittedAt)
      );

      // Get last 10 attempts or all if less than 10
      const recentAttempts = sortedAttempts.slice(-10);
      
      setChartData({
        labels: recentAttempts.map(attempt => 
          new Date(attempt.submittedAt).toLocaleDateString()
        ),
        datasets: [
          {
            label: 'Score %',
            data: recentAttempts.map(attempt => attempt.score),
            borderColor: 'rgba(67, 97, 238, 1)',
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: 'rgba(67, 97, 238, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgba(67, 97, 238, 1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Passing Score',
            data: recentAttempts.map(() => 60), // Assuming 60% is passing score
            borderColor: 'rgba(248, 113, 113, 0.8)',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          }
        ]
      });
      setError(null);
    } catch (err) {
      console.error('Chart data error:', err);
      setError(err.message || 'Failed to process chart data');
    } finally {
      setLoading(false);
    }
  }, [attempts]);

  // Simplified options without type assertions
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Recent Attempt Scores Over Time',
        font: {
          size: 16,
          weight: '600'
        },
        color: '#212529'
      },
      legend: {
        position: 'top',
        labels: {
          color: '#495057',
          font: {
            size: 13
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#212529',
        bodyColor: '#495057',
        borderColor: '#e9ecef',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Passing Score') {
              return `Passing Score: 60%`;
            }
            return `Score: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 12
          },
          callback: (value) => `${value}%`
        },
        title: {
          display: true,
          text: 'Score Percentage',
          color: '#6c757d',
          font: {
            size: 12,
            style: 'italic'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#212529',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Date of Attempt',
          color: '#6c757d',
          font: {
            size: 12,
            style: 'italic'
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };

  if (loading) return <ChartSkeleton />;
  if (error) return <ChartError message={error} />;
  if (!chartData) return <ChartError message="No data available for chart" />;

  return (
    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

// Reuse helper components
function ChartSkeleton() {
  return (
    <div className="chart-placeholder">
      <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
      <p>Loading chart data...</p>
    </div>
  );
}

function ChartError({ message }) {
  return (
    <div className="chart-placeholder">
      <p>📊 {message}</p>
      <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '0.5rem' }}>
        Chart could not be loaded
      </p>
    </div>
  );
}