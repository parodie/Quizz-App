import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/Card';
import '../styles/TakeQuiz.css';

export default function TakeSharedQuiz() {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
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
        console.error('Shared quiz fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedQuiz();
  }, [shareToken]);

  // Timer effect
  useEffect(() => {
    if (!quiz) return;
    
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [quiz]);

  const handleAnswer = (questionId, option, isMultiple, isChecked) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      
      let updated;
      if (isMultiple) {
        if (isChecked) {
          updated = [...current, option];
        } else {
          updated = current.filter(ans => ans !== option);
        }
      } else {
        updated = [option];
      }
      
      return { ...prev, [questionId]: updated };
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('Please answer all questions before submitting!');
      return;
    }

    const displayName = prompt('Enter your name (optional):') || 'Anonymous Participant';
    
    const submission = {
      displayName,
      timeTaken: timeElapsed,
      answers: quiz.questions.map(q => ({
        questionId: q.id,
        selectedAnswers: answers[q.id] || []
      }))
    };

    try {
      const response = await api.post(`/quizzes/${quiz.id}/submit`, submission);
      alert(`Quiz submitted! Score: ${response.data.score}%`);
      navigate(`/shared/${shareToken}/results`);
    } catch (err) {
      alert('Submission failed. Please try again.');
      console.error('Submission error:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getOptionLabel = (index, questionType) => {
    if (questionType === 'true-false') {
      return index === 0 ? 'T' : 'F';
    }
    return String.fromCharCode(65 + index);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container">
        <Card>
          <div className="error-card">
            <h2 className="error-title">Quiz Unavailable</h2>
            <p className="error-message">{error || 'This quiz is no longer available.'}</p>
            <button onClick={() => navigate('/')} className="btnSecondary">
              Return to Home
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <Card className="card">
        <div className="header">
          <h2 className="title">{quiz.title}</h2>
          {quiz.description && <p className="description shared-description">Shared Quiz - Anonymous Responses</p>}
          <div className="timer">
            ⏱ Time: {formatTime(timeElapsed)}
          </div>
        </div>

        <div className="questionsContainer">
          {quiz.questions.map((q, i) => {
            const isMultiple = q.question_type === 'multiple-choice';
            return (
              <div key={q.id} className="question">
                <h4 className="questionTitle">{i + 1}. {q.text}</h4>
                <div className="options">
                  {q.options.map((opt, idx) => {
                    const isSelected = answers[q.id]?.includes(opt);
                    return (
                      <label key={idx} className={`optionLabel ${isSelected ? 'selected' : ''}`}>
                        <input
                          type={isMultiple ? "checkbox" : "radio"}
                          name={isMultiple ? undefined : `question-${q.id}`}
                          checked={isSelected}
                          onChange={(e) => handleAnswer(q.id, opt, isMultiple, e.target.checked)}
                          className={isMultiple ? "checkboxInput" : "radioInput"}
                        />
                        <span className="optionText">
                          {getOptionLabel(idx, q.question_type)}) {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleSubmit} className="submitBtn">
          Submit Quiz
        </button>
      </Card>
    </div>
  );
}