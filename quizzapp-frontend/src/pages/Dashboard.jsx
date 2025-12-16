import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';
import ShareQuizModal from '../components/ShareQuizModal';

export default function Dashboard() {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get('/quizzes/my');
                console.log('Fetched quizzes:', res.data);

                if(res.data) {
                    setQuizzes(res.data);
                }
                
                console.log('array quizzes:', res);

            } catch (err) {
                console.log('Failed to load quizzes', err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [location.pathname]);

    const handleCreate = () => navigate('/create-quiz');
    const handleTake = (id) => navigate(`/quiz/${id}/take`);
    const handleResults = (id) => navigate(`/quiz/${id}/results`);
    const handleEdit = (id) => navigate(`/quiz/${id}`);
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return;
        try {
            await api.delete(`/quizzes/${id}`);
            setQuizzes(quizzes.filter(q => q.id !== id));
            alert('Quiz deleted');
        } catch (err) {
            alert('Failed to delete quiz', err);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('email');
        sessionStorage.removeItem('email');

        navigate('/'); 
    };

    const handleShare = (quiz) => {
      setSelectedQuiz(quiz);
      setShowShareModal(true);
    };

    const handleCloseShareModal = () => {
      setShowShareModal(false);
      setSelectedQuiz(null);
    };


    if (loading) return <p className="loading">Loading your quizzes...</p>;

    return (
      <div className="container">
        <div className="header">
          <h2>My Quizzes</h2>
           <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleCreate} className="createBtn">
                + Create Quiz
            </button>
            <button onClick={handleLogout} className="btnSecondary">
                Log out
            </button>
          </div>
        </div>

        {quizzes.length === 0 ? (
          <Card>
            <p>You haven't created any quizzes yet.</p>
          </Card>
        ) : (
          <div className="grid">
            {quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <h3 className="title">{quiz.title}</h3>
                <p className="description">
                  {quiz.description || 'No description'}
                </p>
                <div className="meta">
                  <span className={quiz.public ? 'badgePublic' : 'badgePrivate'}>
                    {quiz.public ? 'Public' : 'Private'}
                  </span>
                  <span>
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="actions">
                  <button
                    onClick={() => handleTake(quiz.id)}
                    className="btnSecondary"
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => handleResults(quiz.id)}
                    className="btnPrimary"
                  >
                    View Results
                  </button>
                  <button
                    onClick={() => handleShare(quiz)}
                    className="btnShare"
                  >
                    Share Quiz
                  </button>
                  <button
                    onClick={() => handleEdit(quiz.id)}
                    className="btnEdit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="btnDelete"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* THIS IS THE FIX - Modal must be INSIDE the return statement */}
        {showShareModal && selectedQuiz && (
          <ShareQuizModal 
            quiz={selectedQuiz} 
            onClose={handleCloseShareModal} 
          />
        )}
      </div>
    );
}