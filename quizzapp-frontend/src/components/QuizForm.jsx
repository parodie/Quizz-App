// src/components/QuizForm.jsx
import { useState } from 'react';
import './QuizForm.css';

export default function QuizForm({ initialData, onSubmit }) {
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        isPublic: true,
        passingScore: 60,
        questions: [{ 
            text: '', 
            options: ['', ''], 
            correctAnswer: '', 
            question_type: 'multiple-choice' 
        }],
        ...initialData
    });

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[index][field] = value;
        
        // Handle question type changes
        if (field === 'question_type') {
            if (value === 'true-false') {
                newQuestions[index].options = ['True', 'False'];
                newQuestions[index].correctAnswer = '';
            } else if (value === 'multiple-choice' || value === 'single-choice') {
                if (newQuestions[index].options.length < 2) {
                    newQuestions[index].options = ['', ''];
                }
                newQuestions[index].correctAnswer = '';
            } else if (value === 'short-answer' || value === 'essay') {
                newQuestions[index].options = [];
                newQuestions[index].correctAnswer = '';
            }
        }
        
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const addQuestion = () => {
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
                { text: '', options: ['', ''], correctAnswer: '', question_type: 'multiple-choice' }
            ]
        });
    };

    const removeQuestion = (index) => {
        if (quiz.questions.length > 1) {
            setQuiz({
                ...quiz,
                questions: quiz.questions.filter((_, i) => i !== index)
            });
        }
    };

    const addOption = (qIndex) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].options.push('');
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...quiz.questions];
        if (newQuestions[qIndex].options.length > 2) {
            newQuestions[qIndex].options.splice(oIndex, 1);
            // Clear correct answer if it was the deleted option
            if (newQuestions[qIndex].correctAnswer === quiz.questions[qIndex].options[oIndex]) {
                newQuestions[qIndex].correctAnswer = '';
            }
            setQuiz({ ...quiz, questions: newQuestions });
        }
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...quiz.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(quiz);
    };

    const getOptionLabel = (index, question_type) => {
        if (question_type === 'true-false') {
            return index === 0 ? 'T' : 'F';
        }
        return String.fromCharCode(65 + index);
    };

    const renderQuestionOptions = (question, qIndex) => {
        const { question_type, options, correctAnswer } = question;

        switch (question_type) {
            case 'multiple-choice':
            case 'single-choice':
                return (
                    <div className="options-container">
                        <label>Options:</label>
                        {options.map((opt, oIndex) => (
                            <div key={oIndex} className="option-item">
                                <span className="option-label">
                                    {getOptionLabel(oIndex, question_type)}
                                </span>
                                <input
                                    type="text"
                                    className="option-input"
                                    placeholder={`Option ${getOptionLabel(oIndex, question_type)}`}
                                    value={opt}
                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="option-delete-btn"
                                    onClick={() => removeOption(qIndex, oIndex)}
                                    disabled={options.length <= 2}
                                    title="Delete option"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        
                        <button 
                            type="button" 
                            className="add-option-btn"
                            onClick={() => addOption(qIndex)}
                        >
                            <span>+</span> Add Option
                        </button>

                        <select
                            className="correct-answer-select"
                            required
                            value={correctAnswer}
                            onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                        >
                            <option value="">Select Correct Answer</option>
                            {options.map((opt, i) => (
                                <option key={i} value={opt}>
                                    {getOptionLabel(i, question_type)}) {opt || `Option ${getOptionLabel(i, question_type)}`}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case 'true-false':
                return (
                    <div className="options-container">
                        <label>Select Correct Answer:</label>
                        <div className="true-false-container">
                            {options.map((opt, oIndex) => (
                                <label 
                                    key={oIndex} 
                                    className={`true-false-option ${correctAnswer === opt ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`correct-${qIndex}`}
                                        value={opt}
                                        checked={correctAnswer === opt}
                                        onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 'short-answer':
                return (
                    <div className="options-container">
                        <label>Expected Answer (optional):</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Sample correct answer for reference"
                            value={correctAnswer}
                            onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                        />
                    </div>
                );

            case 'essay':
                return (
                    <div className="options-container">
                        <label>Grading Notes (optional):</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Key points or criteria for grading this essay question"
                            value={correctAnswer}
                            onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="quiz-form">
            <form onSubmit={handleSubmit}>
                <h3>{initialData ? 'Edit Quiz' : 'Create New Quiz'}</h3>
                
                <div className="form-group">
                    <label>Quiz Title</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter quiz title"
                        value={quiz.title}
                        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Enter quiz description (optional)"
                        value={quiz.description}
                        onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                    />
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="isPublic"
                        checked={quiz.isPublic}
                        onChange={(e) => setQuiz({ ...quiz, isPublic: e.target.checked })}
                    />
                    <label htmlFor="isPublic">Make this quiz public</label>
                </div>

                <div className="passing-score-group">
                    <label>Passing Score:</label>
                    <input
                        type="number"
                        className="passing-score-input"
                        value={quiz.passingScore}
                        onChange={(e) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) || 60 })}
                        min="0"
                        max="100"
                    />
                    <span>%</span>
                </div>

                <h4 style={{ color: '#2c3e50', marginTop: '2rem', marginBottom: '1rem' }}>Questions</h4>

                {quiz.questions.map((q, qIndex) => (
                    <div key={qIndex} className="question-card">
                        <div className="question-header">
                            <span className="question-number">Question {qIndex + 1}</span>
                            <select
                                className="question-type-select"
                                value={q.question_type}
                                onChange={(e) => updateQuestion(qIndex, 'question_type', e.target.value)}
                            >
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="single-choice">Single Choice</option>
                                <option value="true-false">True/False</option>
                                <option value="short-answer">Short Answer</option>
                                <option value="essay">Essay</option>
                            </select>
                        </div>

                        <input
                            type="text"
                            className="question-input"
                            placeholder="Enter your question here..."
                            value={q.text}
                            onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                            required
                        />

                        {renderQuestionOptions(q, qIndex)}

                        <div className="question-actions">
                            <div></div>
                            {quiz.questions.length > 1 && (
                                <button
                                    type="button"
                                    className="delete-question-btn"
                                    onClick={() => removeQuestion(qIndex)}
                                >
                                    Delete Question
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="btn btn-success"
                        onClick={addQuestion}
                    >
                        <span>+</span> Add Question
                    </button>
                    
                    <button type="submit" className="btn btn-primary">
                        {initialData ? 'Update Quiz' : 'Create Quiz'}
                    </button>
                </div>
            </form>
        </div>
    );
}