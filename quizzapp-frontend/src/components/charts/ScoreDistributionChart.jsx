import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ScoreDistributionChart({ attempts = [] }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!Array.isArray(attempts) || attempts.length === 0) {
        throw new Error('No attempt data available');
      }

      // Calculate score distribution
      const distribution = [0, 0, 0, 0, 0]; // 5 bins for score ranges
      
      attempts.forEach(attempt => {
        if (typeof attempt.score !== 'number') return;
        
        const score = attempt.score;
        if (score <= 20) distribution[0]++;
        else if (score <= 40) distribution[1]++;
        else if (score <= 60) distribution[2]++;
        else if (score <= 80) distribution[3]++;
        else distribution[4]++;
      });

      setChartData({
        labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
        datasets: [
          {
            label: 'Number of Attempts',
            data: distribution,
            backgroundColor: [
              'rgba(248, 113, 113, 0.8)', // Red for low scores
              'rgba(251, 191, 36, 0.8)',  // Yellow for medium-low
              'rgba(245, 158, 11, 0.8)',  // Orange for medium
              'rgba(74, 222, 128, 0.8)',  // Green for medium-high
              'rgba(34, 197, 94, 0.8)'   // Dark green for high scores
            ],
            borderColor: [
              'rgba(248, 113, 113, 1)',
              'rgba(251, 191, 36, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(74, 222, 128, 1)',
              'rgba(34, 197, 94, 1)'
            ],
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false
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
        text: 'Score Distribution Across Attempts',
        font: {
          size: 16,
          weight: '600'
        },
        color: '#212529'
      },
      legend: {
        display: false
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
            return `${context.raw} attempts scored in ${context.label} range`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6c757d',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Number of Attempts',
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
            size: 13,
            weight: '500'
          }
        }
      }
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
      <Bar data={chartData} options={options} />
    </div>
  );
}

// Add these helper components
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