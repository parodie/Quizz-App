import './FloatingShape.css';

export default function FloatingShape({ size, top, left, delay = 0 }) {
  return (
    <div
      className="floating-shape"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        left,
        animationDelay: `${delay}s`,
      }}
    />
  );
}
