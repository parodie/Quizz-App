import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css'; // import the CSS

import GlassButton from '../components/GlassButton';
import FeatureCard from '../components/FeatureCard';
import FloatingShape from '../components/FloatingShape';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="landing-container">
      <div
        className="animated-background"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}
      />

      <FloatingShape delay={0} size={60} top="20%" left="10%" />
      <FloatingShape delay={2} size={80} top="60%" left="85%" />
      <FloatingShape delay={4} size={40} top="80%" left="15%" />
      <FloatingShape delay={1} size={100} top="30%" left="80%" />

      <div className="landing-content">
        {/* Hero Section */}
        <header className="hero-section">
          <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
            <h1 className="hero-title">QuizzApp</h1>
            <p className="hero-subtitle">
              Create, share, and take quizzes in seconds — perfect for teachers, teams, and learners everywhere.
            </p>

            <div className="hero-buttons">
              <GlassButton onClick={() => navigate('/login')} variant="outline">
                Login
              </GlassButton>
              <GlassButton onClick={() => navigate('/register')} variant="solid">
                Get Started
              </GlassButton>
            </div>

          </div>
        </header>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-container">
            <h2>Why QuizzApp?</h2>
            <div className="features-grid">
              <FeatureCard
                icon="🚀"
                title="Create Quizzes Easily"
                description="Build engaging quizzes with multiple-choice, true/false, and more."
                delay={0}
              />
              <FeatureCard
                icon="🌐"
                title="Share & Take Anywhere"
                description="Generate shareable links instantly. No login required for takers."
                delay={0.2}
              />
              <FeatureCard
                icon="📈"
                title="Real-Time Analytics"
                description="Get instant insights with detailed reports on performance."
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-container">
            <h2>Ready to revolutionize learning?</h2>
            <p>Join educators and teams using QuizzApp to create engaging, interactive learning experiences.</p>
            <GlassButton onClick={() => navigate('/register')} variant="cta" size="large">
              Create Your First Quiz →
            </GlassButton>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>© 2025 QuizzApp. Crafted with ❤️ for educators worldwide.</p>
        </footer>
      </div>
    </div>
  );
}
