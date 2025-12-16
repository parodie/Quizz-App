// src/pages/TakeQuiz.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/Card';
import '../styles/TakeQuiz.css';

export default function TakeQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/my/${id}`);
                setQuiz(res.data);
            } catch (err) {
                alert('Quiz not found', err);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleAnswer = (questionId, option, isMultiple, isChecked) => {
        setAnswers(prev => {
            const current = prev[questionId] || [];
            
            let updated;
            if (isMultiple) {
                // Multiple choice: add/remove based on checked state
                if (isChecked) {
                    updated = [...current, option];
                } else {
                    updated = current.filter(ans => ans !== option);
                }
            } else {
                // Single choice: always replace with new selection
                updated = [option];
            }
            
            return { ...prev, [questionId]: updated };
        });
    };

    const handleSubmit = async () => {
        const submission = {
            displayName: prompt('Enter your name:') || 'Guest',
            timeTaken: timeElapsed,
            answers: quiz.questions.map(q => ({
                questionId: q.id,
                selectedAnswers: answers[q.id] || []
            }))
        };

        try {
            const res = await api.post(`/quizzes/${id}/submit`, submission);
            alert(`Quiz submitted! Score: ${res.data.score}%`);
            navigate(`/quiz/${id}/results`);
        } catch (err) {
            alert('Submission failed', err);
        }
    };

    if (loading || !quiz) return <p>Loading quiz...</p>;

    return (
        <div className="container">
            <Card className="card">
                <div className="header">
                    <h2 className="title">{quiz.title}</h2>
                    {quiz.description && <p className="description">{quiz.description}</p>}
                    <div className="timer">
                        ⏱ Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="questionsContainer">
                    {quiz.questions.map((q, i) => (
                        <div key={q.id} className="question">
                            <h4 className="questionTitle">{i + 1}. {q.text}</h4>
                            <div className="options">
                                {q.options.map((opt, idx) => {
                                    const isMultiple = q.question_type === 'multiple-choice';
                                    const isSelected = answers[q.id]?.includes(opt);

                                    return (
                                        <label key={idx} className="optionLabel">
                                            <input
                                                type={isMultiple ? "checkbox" : "radio"}
                                                name={isMultiple ? undefined : `question-${q.id}`}
                                                checked={isSelected}
                                                onChange={(e) => handleAnswer(q.id, opt, isMultiple, e.target.checked)}
                                                className={isMultiple ? "checkboxInput" : "radioInput"}
                                            />
                                            <span className="optionText">
                                                {String.fromCharCode(65 + idx)}) {opt}
                                            </span>
                                        </label>
                                    );
            })}
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={handleSubmit} className="submitBtn">
                    Submit Quiz
                </button>
            </Card>
        </div>
    );
}
