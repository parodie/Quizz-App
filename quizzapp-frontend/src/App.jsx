// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import Results from './pages/Results';
import VerifyEmail from './pages/VerifyEmail';
import LandingPage from './pages/LandingPage';
import EditQuiz from './pages/EditQuiz';
import './styles/Global.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/create-quiz" element={<PrivateRoute><CreateQuiz /></PrivateRoute>} />
                    <Route path="/quiz/:id/take" element={<TakeQuiz />} />
                    <Route path="/quiz/:id" element={<PrivateRoute><EditQuiz /></PrivateRoute>} />
                    <Route path="/quiz/:id/results" element={<PrivateRoute><Results /></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}


function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <p>Loading...</p>;
    if (!user) {
        window.location.href = '/login';
        return null;
    }
    return children;
}

/*function Header() {
    const { user, logout } = useAuth();
    return (
        <header style={{ background: '#2c3e50', color: 'white', padding: '1rem', marginBottom: '2rem' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>QuizzApp</h1>
                {user && (
                    <div>
                        <span>Welcome, {user.email.split('@')[0]}</span>
                        <button onClick={logout} style={{ marginLeft: '1rem' }} className="btn-secondary">Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
}*/

export default App;