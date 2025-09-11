// src/components/Header.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header style={styles.header}>
            <div style={styles.container}>
                <h1 style={styles.logo} onClick={() => navigate('/')}>
                    QuizzApp
                </h1>

                {user ? (
                    <div style={styles.authActions}>
                        <span style={styles.welcome}>Hi, {user.email.split('@')[0]}</span>
                        <button onClick={logout} style={styles.logoutBtn}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={styles.authActions}>
                        <button onClick={() => navigate('/login')} style={styles.btnSecondary}>
                            Login
                        </button>
                        <button onClick={() => navigate('/register')} style={styles.btnPrimary}>
                            Register
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

const styles = {
    header: {
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem 0',
        marginBottom: '2rem',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1rem',
    },
    logo: {
        fontSize: '1.8rem',
        fontWeight: '600',
        cursor: 'pointer',
        color: 'white',
        textDecoration: 'none',
    },
    authActions: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    welcome: {
        fontSize: '1rem',
    },
    btnPrimary: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    btnSecondary: {
        backgroundColor: '#95a5a6',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    logoutBtn: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};