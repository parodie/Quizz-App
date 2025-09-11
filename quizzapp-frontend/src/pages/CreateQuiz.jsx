// In CreateQuiz.jsx
import QuizForm from '../components/QuizForm';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateQuiz(){

    const navigate = useNavigate();
    
    const handleSubmit = async (quizData) => {
        console.log('Submitting quiz:', quizData);
        await api.post('/quizzes', quizData);
        navigate('/dashboard');
        alert('Quiz created!');
    };

    return (
        <div className="container">
            <QuizForm onSubmit={handleSubmit} />
        </div>
    );
}