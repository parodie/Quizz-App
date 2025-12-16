import { useEffect, useState } from 'react';
import { api } from '../services/api';
import QuizForm from '../components/QuizForm';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/my/${id}`);
                setQuiz(res.data);
            } catch (err) {
                console.error(err);
                alert('Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleUpdate = async (updatedQuiz) => {
        try {
            await api.put(`/quizzes/${id}`, updatedQuiz);
            alert('Quiz updated!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to update quiz');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!quiz) return <p>Quiz not found</p>;

    return <QuizForm initialData={quiz} onSubmit={handleUpdate} />;
}
