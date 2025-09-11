import { useState } from 'react';
import './GlassButton.css';

export default function GlassButton({ children, onClick, variant = 'outline', size = 'normal' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`glass-button ${variant} ${size} ${isHovered ? 'hovered' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
}

