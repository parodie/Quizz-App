// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/AuthForm.css';
import FloatingShape from '../components/FloatingShape';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { email, password });
            alert('Registration successful! Please check your email to verify your account.');
            navigate('/login');
        } catch (err) {
            alert('Registration failed. Email may already be in use.' + err);
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
        <h2>Register</h2>
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
        <button type="submit">Register</button>
        <p>
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
}
