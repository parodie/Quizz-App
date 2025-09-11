// src/pages/Results.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/Card';
import '../styles/results.css'; // <-- import the new CSS

export default function Results() {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/quizzes/${id}/results`);
        setResults(res.data);
      } catch (err) {
        alert('Failed to load results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  if (loading) return <p className="loading">Loading results...</p>;
  if (!results) return <p className="loading">No results available.</p>;

  return (
    <div className="results-container">
      <Card title="Quiz Analytics">
        <h2 className="quiz-title">{results.quizTitle}</h2>
        <div className="stats">
          <Stat label="Total Attempts" value={results.totalAttempts} />
          <Stat label="Average Score" value={`${results.averageScore}%`} />
          <Stat label="Pass Rate" value={`${results.passRate}%`} />
          <Stat label="Avg Time" value={`${results.averageTimeSeconds} sec`} />
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
