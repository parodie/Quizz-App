import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/Card';
import '../styles/TakeQuiz.css';

export default function SharedQuiz() {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedQuiz = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/quizzes/public/${shareToken}`);
        setQuiz(response.data);
        setError(null);
      } catch (err) {
        setError('This quiz link is invalid or has been revoked.');
        console.error('Shared quiz error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedQuiz();
  }, [shareToken]);

  const handleTakeQuiz = () => {
    navigate(`/shared/${shareToken}/take`);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading shared quiz...
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container">
        <Card className="card error-card">
          <h2 className="error-title">Invalid Quiz Link</h2>
          <p className="error-message">{error || 'The quiz could not be found.'}</p>
          <button onClick={() => navigate('/')} className="btnSecondary">
            Return to Home
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <Card className="card shared-quiz-card">
        <div className="header">
          <h2 className="title">{quiz.title}</h2>
          {quiz.description && <p className="description">{quiz.description}</p>}
          <div className="quiz-meta">
            <span className="badgePublic">	Public</span>
            <span>Anonymous responses</span>
          </div>
        </div>

        <div className="quiz-preview">
          <h4>Quiz Preview:</h4>
          <div className="questions-preview">
            {quiz.questions.slice(0, 3).map((q, i) => (
              <div key={q.id} className="preview-question">
                <span className="question-number">{i + 1}.</span>
                <span className="question-text">{q.text}</span>
              </div>
            ))}
            {quiz.questions.length > 3 && (
              <p className="more-questions">+ {quiz.questions.length - 3} more questions</p>
            )}
          </div>
        </div>

        <button onClick={handleTakeQuiz} className="submitBtn">
          Start Quiz
        </button>
      </Card>
    </div>
  );
}