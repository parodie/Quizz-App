import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ShareQuizModal({ quiz, onClose, onShared }) {
  const [shareToken, setShareToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchShareToken = async () => {
      try {
        setLoading(true);
        const response = await api.post(`/quizzes/${quiz.id}/share`);
        setShareToken(response.data.shareToken);
        setError(null);
      } catch (err) {
        setError('Failed to generate share link. Please try again.');
        console.error('Share token error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShareToken();
  }, [quiz.id]);

  const handleCopy = async () => {
    if (!shareToken) return;
    
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onShared) onShared(shareUrl);
    } catch (err) {
      setError('Failed to copy link. Please copy manually.');
      console.error('Copy error:', err);
    }
  };

  const handleRevoke = async () => {
    if (!window.confirm('Are you sure you want to revoke this share link? This will make the current link invalid.')) return;
    
    try {
      await api.delete(`/quizzes/${quiz.id}/share`);
      setShareToken(null);
      setError('Share link has been revoked. A new link can be generated.');
    } catch (err) {
      setError('Failed to revoke share link. Please try again.');
      console.error('Revoke error:', err);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading-spinner"></div>
          <p>Generating share link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content share-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h3 className="modal-title">Share Quiz: {quiz.title}</h3>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="share-content">
          <p className="share-description">
            Share this link with anyone to let them take your quiz anonymously:
          </p>
          
          <div className="share-url-container">
            <input
              type="text"
              value={shareToken ? `${window.location.origin}/shared/${shareToken}` : 'Generating...'}
              readOnly
              className="share-url-input"
            />
            <button 
              onClick={handleCopy}
              className={`copy-btn ${copied ? 'copied' : ''}`}
              disabled={!shareToken}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>

          <div className="share-info">
            <div className="info-item">
              <span className="info-icon">👥</span>
              <span>Anonymous participants can take this quiz</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📊</span>
              <span>Their results will appear in your analytics</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🔒</span>
              <span>You can revoke access anytime</span>
            </div>
          </div>

          <div className="share-actions">
            <button onClick={handleRevoke} className="revoke-btn" disabled={!shareToken}>
              🔒 Revoke Access
            </button>
            <button onClick={onClose} className="close-btn">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}