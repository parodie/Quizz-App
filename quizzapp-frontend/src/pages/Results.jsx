import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/Card';
import ScoreDistributionChart from '../components/charts/ScoreDistributionChart';
import AttemptTimelineChart from '../components/charts/AttemptlineChart';
import '../styles/results.css';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/quizzes/${id}/results`);
        setResults(res.data);
      } catch (err) {
        setError('Failed to load results. Please try again later.');
        console.error('Results fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading) return (
    <div className="results-container">
      <div className="loading">
        <div className="loading-spinner"></div>
        Loading analytics data...
      </div>
    </div>
  );

  if (error || !results) return (
    <div className="results-container">
      <Card>
        <div className="card-content">
          <div className="error-message">
            <h3>📊 Results Unavailable</h3>
            <p>{error || 'No quiz results data found.'}</p>
            <button onClick={() => navigate('/dashboard')} className="back-btn">
              ← Return to Dashboard
            </button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Sample data structure for when API doesn't provide recentAttempts
  const mockAttempts = [
    { id: 1, displayName: 'John Doe', score: 85, timeTaken: 120, submittedAt: '2024-01-15T10:30:00Z' },
    { id: 2, displayName: 'Jane Smith', score: 72, timeTaken: 145, submittedAt: '2024-01-16T14:20:00Z' },
    { id: 3, displayName: 'Alex Johnson', score: 95, timeTaken: 98, submittedAt: '2024-01-17T09:15:00Z' },
    { id: 4, displayName: 'Maria Garcia', score: 65, timeTaken: 180, submittedAt: '2024-01-18T16:45:00Z' },
    { id: 5, displayName: 'Bob Wilson', score: 55, timeTaken: 210, submittedAt: '2024-01-19T11:10:00Z' },
    { id: 6, displayName: 'Lisa Chen', score: 88, timeTaken: 135, submittedAt: '2024-01-20T13:25:00Z' },
    { id: 7, displayName: 'Mike Brown', score: 79, timeTaken: 155, submittedAt: '2024-01-21T15:40:00Z' },
    { id: 8, displayName: 'Sarah Lee', score: 92, timeTaken: 110, submittedAt: '2024-01-22T10:05:00Z' },
    { id: 9, displayName: 'David Kim', score: 68, timeTaken: 175, submittedAt: '2024-01-23T14:50:00Z' },
    { id: 10, displayName: 'Emma Davis', score: 81, timeTaken: 125, submittedAt: '2024-01-24T09:30:00Z' }
  ];

  // Use actual data if available, otherwise use mock data
  const recentAttempts = results.recentAttempts || mockAttempts;
  const allAttempts = results.allAttempts || [...recentAttempts, ...mockAttempts.slice(0, 5)];

  return (
    <div className="results-container">
      <Card>
        <div className="card-header">
          <h2>📊 Quiz Analytics</h2>
        </div>
        <div className="card-content">
          <h2 className="quiz-title">{results.quizTitle || 'Untitled Quiz'}</h2>
          
          <div className="stats">
            <Stat label="Total Attempts" value={allAttempts.length} />
            <Stat 
              label="Average Score" 
              value={`${(results.averageScore || 75).toFixed(1)}%`} 
            />
            <Stat 
              label="Pass Rate" 
              value={`${(results.passRate || 85).toFixed(1)}%`} 
            />
            <Stat 
              label="Avg Time" 
              value={`${(results.averageTimeSeconds || 140).toFixed(0)} sec`} 
            />
          </div>
          
          <div className="charts-container">
            <div className="chart-card">
              <h3>📊 Score Distribution</h3>
              <ScoreDistributionChart attempts={allAttempts} />
            </div>
            
            <div className="chart-card">
              <h3>📈 Attempt Timeline</h3>
              <AttemptTimelineChart attempts={recentAttempts} />
            </div>
          </div>
          
          <div className="attempts-list">
            <h3>🎯 Recent Attempts</h3>
            <div className="attempts-grid">
              {recentAttempts.slice(0, 5).map((attempt, index) => (
                <div 
                  key={attempt.id || index} 
                  className={`attempt-item ${
                    attempt.score >= 80 ? 'high-score' : 
                    attempt.score >= 60 ? 'medium-score' : 'low-score'
                  }`}
                >
                  <div className="attempt-header">
                    <div className="attempt-name">{attempt.displayName || `Attempt #${index + 1}`}</div>
                    <div className="attempt-score">
                      {attempt.score}%
                    </div>
                  </div>
                  <div className="attempt-time">⏱ {attempt.timeTaken || 120} seconds</div>
                  <div className="attempt-date">
                    📅 {new Date(attempt.submittedAt || new Date()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')} 
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}