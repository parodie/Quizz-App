// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/AuthForm.css';
import FloatingShape from '../components/FloatingShape';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            console.log('Login response:', res);
            login(res.data.email, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert(`Invalid credentials: ${err}`);
        }
    };

    return (
        <div className="auth-container">
            
            <FloatingShape delay={0} size={60} top="20%" left="10%" />
            <FloatingShape delay={2} size={80} top="60%" left="85%" />
            <FloatingShape delay={4} size={40} top="80%" left="15%" />
            <FloatingShape delay={1} size={100} top="30%" left="80%" />
            <FloatingShape delay={5} size={50} top="40%" left="20%" />
            <FloatingShape delay={6} size={70} top="85%" left="75%" />

            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>

                <p>
                Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
                </p>
            </form>
        </div>
    );
}